<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;

class LoginController extends Controller
{    
    /**
     * Display login page
     */
    public function index()
    {
        return inertia('Auth/Login');
    }
    
    /**
     * Handle login process
     */
    public function store(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        // Ambil cart_session_id dari Cookie/Session sebelum session di-regenerate
        $cartSessionId = Cookie::get('cart_session_id') ?? session()->get('cart_session_id');

        $credentials = $request->only('email', 'password');

        if (auth()->attempt($credentials)) {

            $request->session()->regenerate();

            // Pindahkan keranjang guest ke user ID yang login
            if ($cartSessionId) {
                Cart::where('session_id', $cartSessionId)
                    ->orWhereNull('user_id')
                    ->update([
                        'user_id' => auth()->user()->id
                    ]);
            } else {
                Cart::whereNull('user_id')->update([
                    'user_id' => auth()->user()->id
                ]);
            }

            // Kembalikan pengguna ke Halaman Utama Storefront
            return redirect()->route('web.home.index');
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ]);
    }

    /**
     * Handle logout process
     */
    public function destroy(Request $request)
    {
        // 1. Logout user
        auth()->logout();

        // 2. Invalidate session & regenerate CSRF token
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        // 3. Redirect ke Halaman Utama Front End Storefront
        return redirect()->route('web.home.index');
    }
}
