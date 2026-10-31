<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\City;
use App\Models\District;
use App\Models\Province;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CheckoutController extends Controller
{
    /**
     * Tampilkan Halaman Checkout
     */
    public function index()
    {
        $provinces = Province::all();

        $carts = Cart::with('product')
            ->where('user_id', auth()->user()->id)
            ->get();

        $totalPrice = $carts->sum('price');
        $totalWeight = $carts->sum(function ($cart) {
            return ($cart->weight ?? 0) * ($cart->qty ?? 1);
        });

        if ($totalWeight <= 0) {
            $totalWeight = 1000; // Minimal 1kg
        }

        return inertia('Web/Checkouts/Index', [
            'provinces' => $provinces,
            'dataCarts' => [
                'price'  => $totalPrice,
                'weight' => $totalWeight,
            ]
        ]);
    }

    /**
     * Get Data Kota
     */
    public function getCities(Request $request)
    {
        $cities = City::where('province_id', $request->province_id)->get();
        return response()->json($cities);
    }

    /**
     * Get Data Kecamatan
     */
    public function getDistricts(Request $request)
    {
        $districts = District::where('city_id', $request->city_id)->get();
        return response()->json($districts);
    }

    /**
     * Check Ongkir Fast-Response (Origin: 606 Bekasi Selatan)
     */
    public function checkOngkir(Request $request)
    {
        $apiKey  = config('services.rajaongkir.key', env('RAJAONGKIR_API_KEY'));
        $origin  = config('services.rajaongkir.origin', env('RAJAONGKIR_ORIGIN_CITY_ID', 606)); 
        $courier = strtolower($request->courier);
        $weight  = $request->weight ?? 1000;
        $destination = $request->destination;

        if ($apiKey && $destination) {
            try {
                $district = District::find($destination);
                $destinationCityId = $district ? $district->city_id : $destination;

                $response = Http::timeout(3)->connectTimeout(2)->withHeaders([
                    'key' => $apiKey,
                ])->post('https://pro.rajaongkir.com/api/cost', [
                    'origin'          => $origin,
                    'originType'      => 'subdistrict',
                    'destination'     => $destination,
                    'destinationType' => 'subdistrict',
                    'weight'          => $weight,
                    'courier'         => $courier,
                ]);

                if ($response->failed()) {
                    $response = Http::timeout(3)->connectTimeout(2)->withHeaders([
                        'key' => $apiKey,
                    ])->post('https://api.rajaongkir.com/starter/cost', [
                        'origin'      => 55,
                        'destination' => $destinationCityId,
                        'weight'      => $weight,
                        'courier'     => $courier,
                    ]);
                }

                if ($response->successful()) {
                    $costs = $response->json()['rajaongkir']['results'][0]['costs'] ?? [];

                    if (!empty($costs)) {
                        $results = [];
                        foreach ($costs as $cost) {
                            $results[] = [
                                'service' => strtoupper($courier) . ' ' . $cost['service'] . ' (' . ($cost['cost'][0]['etd'] ?? '1-3') . ' Hari)',
                                'cost'    => $cost['cost'][0]['value']
                            ];
                        }
                        return response()->json($results);
                    }
                }
            } catch (\Exception $e) {
                // Fallback jika API timeout
            }
        }

        $multiplier = max(1, ceil($weight / 1000));

        $rates = [
            'jne' => [
                ['service' => 'JNE REG (2-3 Hari)', 'base_cost' => 12000],
                ['service' => 'JNE YES (1 Hari)',   'base_cost' => 22000],
            ],
            'pos' => [
                ['service' => 'POS Kilat Khusus', 'base_cost' => 10000],
                ['service' => 'POS Express',       'base_cost' => 18000],
            ],
            'jnt' => [
                ['service' => 'J&T EZ (2-3 Hari)', 'base_cost' => 13000],
            ],
            'ninja' => [
                ['service' => 'Ninja Standard',    'base_cost' => 11000],
            ]
        ];

        $courierRates = $rates[$courier] ?? [
            ['service' => strtoupper($courier) . ' Standard', 'base_cost' => 12000]
        ];

        $fallbackResults = [];
        foreach ($courierRates as $rate) {
            $fallbackResults[] = [
                'service' => $rate['service'],
                'cost'    => $rate['base_cost'] * $multiplier
            ];
        }

        return response()->json($fallbackResults);
    }

    /**
     * Store Checkout (Duitku Payment Gateway Integration)
     */
    public function store(Request $request)
    {
        $request->validate([
            'province_id'     => 'required',
            'city_id'         => 'required',
            'district_id'     => 'required',
            'courier_name'    => 'required',
            'courier_service' => 'required',
            'courier_cost'    => 'required|numeric',
            'grand_total'     => 'required|numeric',
            'address'         => 'required',
            'payment_method'  => 'nullable|string', // Contoh: 'B1' (BCA VA), 'M1' (Mandiri VA), 'VC' (Credit Card)
        ]);

        // 1. Ambil Kredensial Duitku dari .env / Config
        $merchantCode = env('DUITKU_MERCHANT_CODE', 'DS37139');
        $merchantKey  = env('DUITKU_MERCHANT_KEY', '');
        $isSandbox    = env('DUITKU_SANDBOX_MODE', true);

        // Keamanan Tambahan: Kalkulasi ulang Grand Total dari Database (Mencegah Tampering)
        $carts = Cart::where('user_id', auth()->user()->id)->get();
        $realCartTotal = $carts->sum('price');
        $calculatedGrandTotal = $realCartTotal + (int) $request->courier_cost;

        $paymentAmount   = $calculatedGrandTotal > 0 ? $calculatedGrandTotal : (int) $request->grand_total;
        $merchantOrderId = 'INV' . time(); 

        // 2. Format Signature MD5 Duitku (merchantCode + merchantOrderId + paymentAmount + merchantKey)
        $signature = md5($merchantCode . $merchantOrderId . $paymentAmount . $merchantKey);

        // Set Default Payment Method ke VC atau amankan dari input request (cth: 'B1' untuk BCA VA, 'M1' Mandiri, 'VC' Credit Card)
        $paymentMethod = $request->payment_method ?? 'VC'; 

        // 3. Payload Parameter Request Duitku V2
        $params = [
            'merchantCode'     => $merchantCode,
            'paymentAmount'    => $paymentAmount,
            'paymentMethod'    => $paymentMethod,
            'merchantOrderId'  => $merchantOrderId,
            'productDetails'   => 'Pembayaran Pesanan 2R Store',
            'additionalParam'  => '',
            'merchantUserInfo' => auth()->user()->email ?? 'customer@example.com',
            'customerVaName'   => auth()->user()->name ?? 'Customer',
            'email'            => auth()->user()->email ?? 'customer@example.com',
            'phoneNumber'      => '082189606233',
            'itemDetails'      => [
                [
                    'name'     => 'Total Pesanan & Ongkir',
                    'price'    => $paymentAmount,
                    'quantity' => 1
                ]
            ],
            'callbackUrl'      => url('/checkouts/callback'),
            'returnUrl'        => url('/checkouts/return'),
            'signature'        => $signature,
            'expiryPeriod'     => 60
        ];

        // 4. Hit Endpoint API Duitku V2
        $endpoint = $isSandbox 
            ? 'https://sandbox.duitku.com/webapi/api/merchant/v2/inquiry' 
            : 'https://passport.duitku.com/webapi/api/merchant/v2/inquiry';

        $response = Http::withHeaders([
            'Content-Type' => 'application/json'
        ])->post($endpoint, $params);

        $result = $response->json();

        // Log respon API Duitku ke storage/logs/laravel.log
        Log::info('Duitku API Response Log:', [
            'http_status' => $response->status(),
            'result'      => $result
        ]);

        // 5. Cek Hasil API Response
        if (isset($result['statusCode']) && $result['statusCode'] == '00') {
            
            DB::transaction(function () use ($request, $merchantOrderId, $paymentAmount, $result) {
                if (class_exists('App\Models\Invoice')) {
                    Invoice::create([
                        'invoice'         => $merchantOrderId,
                        'user_id'         => auth()->user()->id,
                        'courier'         => $request->courier_name,
                        'courier_service' => $request->courier_service,
                        'courier_cost'    => $request->courier_cost,
                        'weight'          => $request->weight ?? 1000,
                        'grand_total'     => $paymentAmount,
                        'province_id'     => $request->province_id,
                        'city_id'         => $request->city_id,
                        'district_id'     => $request->district_id,
                        'address'         => $request->address,
                        'status'          => 'UNPAID',
                        'snap_token'      => $result['paymentUrl'] ?? null,
                    ]);
                }

                // Hapus item keranjang setelah berhasil checkout
                Cart::where('user_id', auth()->user()->id)->delete();
            });

            // Redirect eksternal ke halaman pembayaran Duitku
            return \Inertia\Inertia::location($result['paymentUrl']);
        }

        // Tangkap pesan error dari Duitku jika gagal
        $msg = $result['statusMessage'] ?? ($result['Message'] ?? 'Gagal membuat transaksi Duitku.');
        return back()->withErrors(['payment' => $msg]);
    }
}