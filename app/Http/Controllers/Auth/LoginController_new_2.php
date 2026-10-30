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
        // Validasi input email dan password
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        $credentials = $request->only('email', 'password');

        // Melakukan otentikasi
        if (auth()->attempt($credentials)) {

            // Regenerate session ID untuk keamanan
            $request->session()->regenerate();

            // Transfer keranjang belanja guest (user_id null) ke user yang baru saja login
            Cart::whereNull('user_id')
                ->update([
                    'user_id' => auth()->user()->id
                ]);

            // Selalu kembalikan pengguna ke Halaman Utama Front End Storefront (Katalog Produk)
            return redirect()->route('web.home.index');
        }

        // Jika login gagal
        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ]);
    }
}
