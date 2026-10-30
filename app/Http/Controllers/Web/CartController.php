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

        // Load relasi productSizes dan productImages.color untuk keperluan modal edit di React
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
        if (!auth()->check()) {
            return redirect('/login');
        }

        $request->validate([
            'product_id' => 'required|exists:products,id',
            'qty'        => 'required|integer|min:1',
            'price'      => 'required',
        ]);

        $userId = auth()->user()->id;
        $sessionId = $this->getCartSessionId();

        // Pastikan hanya menyimpan nama file murni menggunakan basename
        $productImage = $request->product_image ? basename($request->product_image) : null;
        $colorImage   = $request->color_image ? basename($request->color_image) : null;

        $cart = Cart::where('product_id', $request->product_id)
            ->where('color', $request->color)
            ->where('size', $request->size)
            ->where('user_id', $userId)
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
                'product_image' => $productImage,
                'color'         => $request->color ?? null,
                'color_image'   => $colorImage,
                'size'          => $request->size ?? null,
                'qty'           => $request->qty,
                'price'         => $request->price * $request->qty,
                'weight'        => $request->weight ?? 0,
            ]);
        }

        return redirect()->route('web.carts.index');
    }

    /**
     * Update specified cart item (qty, size, and color).
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'qty' => 'required|integer|min:1',
        ]);

        $cart = Cart::findOrFail($id);

        $newSize  = $request->size ?? $cart->size;
        $newColor = $request->color ?? $cart->color;

        // 1. Hitung ulang unit price berdasarkan size baru
        $productSize = ProductSize::where('product_id', $cart->product_id)
            ->where('size', $newSize)
            ->first();

        $unitPrice = $productSize ? $productSize->price : ($cart->price / ($cart->qty > 0 ? $cart->qty : 1));

        // 2. Cari gambar produk & warna berdasarkan nama warna baru
        $productImage = ProductImage::where('product_id', $cart->product_id)
            ->whereHas('color', function($q) use ($newColor) {
                $q->where('name', $newColor);
            })->first();

        // Ambil nama file murni produk
        $rawProductImage = $productImage ? $productImage->image : ($request->product_image ?? $cart->getRawOriginal('product_image'));

        // Ambil nama file murni warna (otomatis cari jika $request->color_image kosong)
        if ($productImage && $productImage->color && $productImage->color->image) {
            $rawColorImage = $productImage->color->image;
        } else {
            $rawColorImage = $request->color_image ?? $cart->getRawOriginal('color_image');
        }

        // 3. Simpan perubahan ke database dengan basename()
        $cart->update([
            'qty'           => $request->qty,
            'size'          => $newSize,
            'color'         => $newColor,
            'price'         => $unitPrice * $request->qty,
            'product_image' => $rawProductImage ? basename($rawProductImage) : null,
            'color_image'   => $rawColorImage ? basename($rawColorImage) : null,
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