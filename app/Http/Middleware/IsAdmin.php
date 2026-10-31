<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsAdmin
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Cek apakah user sudah login DAN memiliki role 'admin' (atau is_admin == 1)
        if (auth()->check() && (auth()->user()->role === 'admin' || auth()->user()->is_admin == 1)) {
            return $next($request);
        }

        // Jika user biasa (Customer) mencoba mengakses, redirect ke home atau berikan error 403 Forbidden
        return redirect('/')->with('error', 'Akses ditolak! Halaman ini khusus Administrator.');
    }
}<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        return $next($request);
    }
}
