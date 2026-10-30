<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use Illuminate\Http\Request;

class LoginController extends Controller
{    
    /**
     * index
     *
     * @return void
     */
    public function index()
    {
        //return inertia
        return inertia('Auth/Login');
    }
    
    /**
     * store
     *
     * @param  mixed $request
     * @return void
     */
    public function store(Request $request)
    {
        //set validation
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        //get email and password from request
        $credentials = $request->only('email', 'password');

        //attempt to login
        if (auth()->attempt($credentials)) {

            // Ambil session ID sebelum di-regenerate untuk melacak cart guest
            $oldSessionId = $request->session()->getId();

            //regenerate session
            $request->session()->regenerate();

            // Transfer keranjang belanja dari guest (user_id null atau session ID lama) ke user yang baru login
            Cart::whereNull('user_id')
                ->orWhere('session_id', $oldSessionId)
                ->update([
                    'user_id' => auth()->user()->id
                ]);

            // Cek apakah ada barang di keranjang belanja
            $cartCount = Cart::where('user_id', auth()->user()->id)->count();

            // Jika ada keranjang yang belum ditransaksikan, arahkan langsung ke halaman Cart / Checkout
            if ($cartCount > 0) {
                return redirect()->route('web.carts.index');
            }

            // Jika tidak ada cart, redirect route dashboard biasa
            return redirect()->route('account.dashboard');
        }

        //if login fails
        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ]);
    }
}
