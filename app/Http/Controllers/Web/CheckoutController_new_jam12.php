<?php

namespace App\Http\Controllers\Web;

use App\Models\Cart;
use App\Models\City;
use App\Models\District;
use App\Models\Province;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Http;
use Exception;

class CheckoutController extends Controller
{
    /**
     * index
     *
     * @return \Inertia\Response|\Illuminate\Http\RedirectResponse
     */
    public function index()
    {
        // 1. Cek jika keranjang belanja kosong
        $carts = Cart::with('product')
            ->where('user_id', auth()->user()->id)
            ->get();

        if ($carts->isEmpty()) {
            return redirect()->route('web.carts.index');
        }

        // 2. Hitung total harga & total berat
        $totalPrice  = $carts->sum('price');
        $totalWeight = $carts->sum('weight');

        // 3. Ambil seluruh data provinsi dari DB lokal
        $provinces = Province::all();

        // 4. Return ke komponen Inertia beserta data props lengkap
        return inertia('Web/Checkouts/Index', [
            'provinces'   => $provinces,
            'carts'       => $carts,
            'totalPrice'  => $totalPrice,
            'totalWeight' => $totalWeight,
        ]);
    }

    /**
     * getCities
     *
     * @param  Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getCities(Request $request)
    {
        // Ambil data kota berdasarkan province_id
        $cities = City::where('province_id', $request->province_id)->get();

        return response()->json($cities);
    }

    /**
     * getDistricts
     *
     * @param  Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getDistricts(Request $request)
    {
        // Ambil data kecamatan berdasarkan city_id
        $districts = District::where('city_id', $request->city_id)->get();

        return response()->json($districts);
    }

    /**
     * checkOngkir
     *
     * @param  Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function checkOngkir(Request $request)
    {
        $response = Http::withHeaders([
            'Accept' => 'application/json',
            'key'    => config('rajaongkir.api_key'),
        ])->withOptions([
            'query' => [
                'origin'      => 606, // Lokasi Toko Bekasi Selatan
                'destination' => $request->destination,
                'weight'      => $request->weight,
                'courier'     => $request->courier,
            ]
        ])->post('https://rajaongkir.komerce.id/api/v1/calculate/domestic-cost');

        return response()->json($response->json()['data'] ?? []);
    }

    /**
     * store
     *
     * @param  Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $duitkuConfig = new \Duitku\Config(config('duitku.merchant_key'), config('duitku.merchant_code'));
        $duitkuConfig->setSandboxMode(config('duitku.sandbox_mode'));
        $duitkuConfig->setSanitizedMode(true);
        $duitkuConfig->setDuitkuLogs(false);

        DB::transaction(function () use ($duitkuConfig, $request) {

            $paymentAmount   = $request->grand_total;
            $email           = $request->email;
            $merchantOrderId = 'INV-' . time();
            $productDetails  = "Pembayaran untuk Invoice : " . $merchantOrderId;
            $customerVaName  = $request->name;
            $callbackUrl     = config('app.url') . '/callback';
            $returnUrl       = config('app.url') . '/account/transactions/' . $merchantOrderId;
            $expiryPeriod    = 1440; // Expiration in minutes

            // Create Transaction
            $transaction = Transaction::create([
                'invoice'         => $merchantOrderId,
                'user_id'         => auth()->user()->id,
                'province_id'     => $request->province_id,
                'city_id'         => $request->city_id,
                'district_id'     => $request->district_id,
                'weight'          => $request->weight,
                'courier_name'    => $request->courier_name,
                'courier_service' => $request->courier_service,
                'courier_cost'    => $request->courier_cost,
                'grand_total'     => $request->grand_total,
                'address'         => $request->address,
                'status'          => 'UNPAID',
            ]);

            // Item Details
            $item_details = [];

            foreach (Cart::with('product')->where('user_id', auth()->user()->id)->get() as $cart) {

                // Insert into transaction_details table
                $transaction->transactionDetails()->create([
                    'transaction_id' => $transaction->id,
                    'product_id'     => $cart->product->id,
                    'product_image'  => basename($cart->product_image),
                    'color'          => $cart->color,
                    'color_image'    => basename($cart->color_image),
                    'size'           => $cart->size,
                    'qty'            => $cart->qty,
                    'price'          => $cart->price,
                ]);

                $item_details[] = [
                    'name'     => $cart->product->title,
                    'price'    => $cart->price,
                    'quantity' => $cart->qty
                ];
            }

            // Clear carts
            Cart::where('user_id', auth()->user()->id)->delete();

            // Add Ongkir to item_details
            $ongkir = [
                'name'     => 'Shipping Cost : ' . $request->courier_name,
                'price'    => (int) $request->courier_cost,
                'quantity' => 1
            ];
            array_push($item_details, $ongkir);

            $customerDetail = [
                'firstName'      => $request->name,
                'email'          => $request->email,
                'billingAddress' => [
                    'firstName' => $request->name,
                    'address'   => $request->address,
                ],
                'shippingAddress' => [
                    'firstName' => $request->name,
                    'address'   => $request->address,
                ],
            ];

            $payload = [
                'paymentAmount'   => $paymentAmount,
                'merchantOrderId' => $merchantOrderId,
                'productDetails'  => $productDetails,
                'customerVaName'  => $customerVaName,
                'email'           => $email,
                'itemDetails'     => $item_details,
                'customerDetail'  => $customerDetail,
                'callbackUrl'     => $callbackUrl,
                'returnUrl'       => $returnUrl,
                'expiryPeriod'    => $expiryPeriod
            ];

            try {
                $responseDuitkuPop = \Duitku\Pop::createInvoice($payload, $duitkuConfig);
                $getReference = json_decode($responseDuitkuPop, true);

                $transaction->reference = $getReference['reference'];
                $transaction->save();

                $this->response['invoice'] = $transaction->invoice;
            } catch (Exception $e) {
                echo $e->getMessage();
            }
        });

        return redirect()->route('account.transactions.show', $this->response);
    }
}
