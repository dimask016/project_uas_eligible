<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\ProductSize;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Str;

class CartController extends Controller
{
    /**
     * Helper Session ID Guest
     */
    private function getCartSessionId()
    {
        $sessionId = Cookie::get('cart_session_id') ?? session()->get('cart_session_id');
        
        if (!$sessionId) {
            $sessionId = (string) Str::uuid();
            Cookie::queue('cart_session_id', $sessionId, 60 * 24 * 7);
            session()->put('cart_session_id', $sessionId);
        }

        return $sessionId;
    }

    /**
     * Display a listing of the cart items.
     */
    public function index()
    {
        $userId = auth()->check() ? auth()->user()->id : null;
        $sessionId = $this->getCartSessionId();

        $carts = Cart::with(['product.productSizes', 'product.productImages.color'])
            ->where(function($query) use ($userId, $sessionId) {
                if ($userId) {
                    $query->where('user_id', $userId);
                } else {
                    $query->whereNull('user_id')->where('session_id', $sessionId);
                }
            })
            ->latest()
            ->get();

        $totalPrice = $carts->sum('price');

        return inertia('Web/Carts/Index', [
            'carts'      => $carts,
            'totalPrice' => $totalPrice
        ]);
    }

    /**
     * Store item to cart
     */
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'qty'        => 'required|integer|min:1',
            'price'      => 'required',
        ]);

        $userId = auth()->check() ? auth()->user()->id : null;
        $sessionId = $this->getCartSessionId();

        $cart = Cart::where('product_id', $request->product_id)
            ->where('color', $request->color)
            ->where('size', $request->size)
            ->where(function($query) use ($userId, $sessionId) {
                if ($userId) {
                    $query->where('user_id', $userId);
                } else {
                    $query->whereNull('user_id')->where('session_id', $sessionId);
                }
            })
            ->first();

        if ($cart) {
            $newQty = $cart->qty + $request->qty;
            $cart->update([
                'qty'   => $newQty,
                'price' => $request->price * $newQty,
            ]);
        } else {
            Cart::create([
                'user_id'       => $userId,
                'session_id'    => $sessionId,
                'product_id'    => $request->product_id,
                'product_image' => $request->product_image ?? null,
                'color'         => $request->color ?? null,
                'color_image'   => $request->color_image ?? null,
                'size'          => $request->size ?? null,
                'qty'           => $request->qty,
                'price'         => $request->price * $request->qty,
                'weight'        => $request->weight ?? 0,
            ]);
        }

        if (!auth()->check()) {
            return redirect()->route('login');
        }

        return redirect()->route('web.carts.index');
    }

    /**
     * Update specified cart item (qty, size, and color).
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'qty'   => 'required|integer|min:1',
            'size'  => 'required',
            'color' => 'required',
        ]);

        $cart = Cart::findOrFail($id);

        // Cari harga produk berdasarkan size baru
        $productSize = ProductSize::where('product_id', $cart->product_id)
            ->where('size', $request->size)
            ->first();

        $unitPrice = $productSize ? $productSize->price : ($cart->price / $cart->qty);

        // Cari gambar berdasarkan warna baru jika ada
        $productImage = ProductImage::where('product_id', $cart->product_id)
            ->whereHas('color', function($q) use ($request) {
                $q->where('name', $request->color);
            })->first();

        // Ambil nama file asli jika gambar diperbarui
        $newProductImage = $productImage ? basename($productImage->image) : $cart->getRawOriginal('product_image');
        $newColorImage = ($productImage && $productImage->color) ? basename($productImage->color->image) : $cart->getRawOriginal('color_image');

        $cart->update([
            'qty'           => $request->qty,
            'size'          => $request->size,
            'color'         => $request->color,
            'price'         => $unitPrice * $request->qty,
            'product_image' => $newProductImage,
            'color_image'   => $newColorImage,
        ]);

        return back();
    }

    /**
     * Remove the specified cart item.
     */
    public function destroy($id)
    {
        $cart = Cart::findOrFail($id);
        $cart->delete();

        return back();
    }
}
