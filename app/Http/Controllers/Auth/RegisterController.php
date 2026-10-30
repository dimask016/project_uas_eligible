<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use App\Models\Cart;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use App\Http\Controllers\Controller;

class RegisterController extends Controller
{    
    /**
     * index
     *
     * @return void
     */
    public function index()
    {
        return inertia('Auth/Register');
    }
    
    /**
     * store
     *
     * @param  mixed $request
     * @return void
     */
    public function store(Request $request)
    {
        // Validasi pendaftaran
        $request->validate([
            'name'     => 'required',
            'email'    => 'required|email|unique:users',
            'password' => 'required|confirmed',
        ]);

        $sessionId = $request->session()->getId();

        // Buat data user baru
        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => bcrypt($request->password)
        ]);

        // Cari atau buat role customer, lalu assign ke user baru
        $role = Role::firstOrCreate(['name' => 'customer']);
        $user->assignRole($role);

        // Langsung login-kan user yang baru register
        auth()->login($user);
        $request->session()->regenerate();

        // Transfer keranjang belanja guest ke user ID yang baru dibuat
        Cart::whereNull('user_id')
            ->orWhere('session_id', $sessionId)
            ->update([
                'user_id' => $user->id
            ]);

        // Cek isi keranjang belanja
        $cartCount = Cart::where('user_id', $user->id)->count();

        // Jika ada item di cart, langsung bawa ke keranjang belanja
        if ($cartCount > 0) {
            return redirect()->route('web.carts.index');
        }

        // Jika tidak ada cart, arahkan ke Halaman Utama Toko
        return redirect()->route('web.home.index');
    }
}
