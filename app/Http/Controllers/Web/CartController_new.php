<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use Illuminate\Http\Request;

class CartController extends Controller
{
    /**
     * Display a listing of the cart items.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        // Ambil data keranjang milik user yang sedang login atau guest (user_id null)
        $userId = auth()->check() ? auth()->user()->id : null;

        $carts = Cart::with('product', 'productSize.color')
            ->where('user_id', $userId)
            ->latest()
            ->get();

        // Hitung total harga belanjaan
        $totalPrice = $carts->sum('price');

        return inertia('Web/Carts/Index', [
            'carts'      => $carts,
            'totalPrice' => $totalPrice
        ]);
    }

    /**
     * Store a newly created item in the cart.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        // 1. Validasi input
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'qty'        => 'required|integer|min:1',
            'price'      => 'required',
        ]);

        // 2. Tentukan user_id
        $userId = auth()->check() ? auth()->user()->id : null;

        // 3. Simpan atau update item di keranjang
        $cart = Cart::where('product_id', $request->product_id)
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
                'user_id'         => $userId,
                'product_id'      => $request->product_id,
                'product_size_id' => $request->product_size_id ?? null,
                'qty'             => $request->qty,
                'price'           => $request->price * $request->qty,
                'weight'          => $request->weight ?? 0,
            ]);
        }

        // 4. Jika user belum login, arahkan ke halaman login
        if (!auth()->check()) {
            return redirect()->route('login');
        }

        // 5. Jika sudah login, bawa ke halaman keranjang belanja
        return redirect()->route('web.carts.index');
    }
}
