<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\Cart;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            
            // Shared user authentication & permissions
            'auth' => [
                'user'        => $request->user() ? $request->user() : null,
                'permissions' => $request->user() ? $request->user()->getPermissionArray() : [],
            ],

            // Shared cart summary data
            'dataCarts' => [
                'total'  => $request->user() ? (int) Cart::where('user_id', $request->user()->id)->sum('qty') : 0,
                'price'  => $request->user() ? (int) Cart::where('user_id', $request->user()->id)->sum('price') : 0,
                'weight' => $request->user() ? (int) Cart::where('user_id', $request->user()->id)->sum('weight') : 0,
            ],

        ]);
    }
}

