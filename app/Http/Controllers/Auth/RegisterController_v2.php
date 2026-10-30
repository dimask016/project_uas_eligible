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
        //return inertia
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
        //set validation
        $request->validate([
            'name'     => 'required',
            'email'    => 'required|email|unique:users',
            'password' => 'required|confirmed',
        ]);

        // Ambil session ID saat ini sebelum user dibuat
        $sessionId = $request->session()->getId();

        //insert data user
        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => bcrypt($request->password)
        ]);

        //find atau buat role "customer" jika belum ada
        $role = Role::firstOrCreate(['name' => 'customer']);

        //assign role "customer" to user
        $user->assignRole($role);

        // Auto-login user setelah berhasil registrasi
        auth()->login($user);
        $request->session()->regenerate();

        // Transfer keranjang belanja milik guest ke user ID baru ini
        Cart::whereNull('user_id')
            ->orWhere('session_id', $sessionId)
            ->update([
                'user_id' => $user->id
            ]);

        // Cek jika user memiliki item di keranjang
        $cartCount = Cart::where('user_id', $user->id)->count();

        if ($cartCount > 0) {
            return redirect()->route('web.carts.index');
        }

        // redirect ke dashboard jika tidak ada cart
        return redirect()->route('account.dashboard');
    }
}

