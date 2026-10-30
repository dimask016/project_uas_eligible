<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Auth Routes
Route::get('/register', [\App\Http\Controllers\Auth\RegisterController::class, 'index'])->name('register')->middleware('guest');
Route::post('/register', [\App\Http\Controllers\Auth\RegisterController::class, 'store'])->name('register.store')->middleware('guest');
Route::get('/login', [\App\Http\Controllers\Auth\LoginController::class, 'index'])->name('login')->middleware('guest');
Route::post('/login', [\App\Http\Controllers\Auth\LoginController::class, 'store'])->name('login.store')->middleware('guest');
Route::post('/logout', \App\Http\Controllers\Auth\LogoutController::class)->name('logout')->middleware('auth');

// Account / Dashboard Routes
Route::prefix('account')->group(function() {
    Route::group(['middleware' => ['auth']], function () {
        Route::get('/dashboard', App\Http\Controllers\Account\DashboardController::class)->name('account.dashboard');
        Route::get('/permissions', [\App\Http\Controllers\Account\PermissionController::class, 'index'])->name('account.permissions.index');
        Route::resource('/roles', \App\Http\Controllers\Account\RoleController::class, ['as' => 'account']);
        Route::resource('/users', \App\Http\Controllers\Account\UserController::class, ['as' => 'account']);
        Route::resource('/colors', \App\Http\Controllers\Account\ColorController::class, ['as' => 'account']);
        Route::resource('/categories', \App\Http\Controllers\Account\CategoryController::class, ['as' => 'account']);

        Route::post('/products/store_image_product', [\App\Http\Controllers\Account\ProductController::class, 'storeImageProduct'])->name('account.products.store_image_product');
        Route::delete('/products/destroy_image_product/{id}', [\App\Http\Controllers\Account\ProductController::class, 'destroyImage'])->name('account.products.destroy_image_product');
        Route::resource('/products', \App\Http\Controllers\Account\ProductController::class, ['as' => 'account']);

        Route::get('/transactions', [App\Http\Controllers\Account\TransactionController::class, 'index'])->name('account.transactions.index');
        Route::get('/transactions/{invoice}', [App\Http\Controllers\Account\TransactionController::class, 'show'])->name('account.transactions.show');

        Route::resource('/sliders', App\Http\Controllers\Account\SliderController::class, ['except' => ['create', 'show', 'edit', 'update'], 'as' => 'account']);
    });
});

// Store Front Web Routes
Route::get('/', \App\Http\Controllers\Web\HomeController::class)->name('web.home.index');
Route::get('/categories', [\App\Http\Controllers\Web\CategoryController::class, 'index'])->name('web.categories.index');
Route::get('/categories/{slug}', [\App\Http\Controllers\Web\CategoryController::class, 'show'])->name('web.categories.show');
Route::get('/products', [\App\Http\Controllers\Web\ProductController::class, 'index'])->name('web.products.index');
Route::get('/products/{slug}', [\App\Http\Controllers\Web\ProductController::class, 'show'])->name('web.products.show');

// Cart Routes
Route::get('/carts', [\App\Http\Controllers\Web\CartController::class, 'index'])->name('web.carts.index')->middleware('auth');
Route::post('/carts', [\App\Http\Controllers\Web\CartController::class, 'store'])->name('web.carts.store')->middleware('auth');
Route::delete('/carts/{id}', [\App\Http\Controllers\Web\CartController::class, 'destroy'])->name('web.carts.destroy')->middleware('auth');

// Checkout Routes (Menggunakan Method GET untuk Dropdown Dynamic)
Route::get('/checkouts', [\App\Http\Controllers\Web\CheckoutController::class, 'index'])->name('web.checkouts.index')->middleware('auth');
Route::get('/checkouts/cities', [\App\Http\Controllers\Web\CheckoutController::class, 'getCities'])->name('web.checkouts.getCities')->middleware('auth');
Route::get('/checkouts/districts', [\App\Http\Controllers\Web\CheckoutController::class, 'getDistricts'])->name('web.checkouts.getDistricts')->middleware('auth');
Route::post('/checkouts/checkOngkir', [\App\Http\Controllers\Web\CheckoutController::class, 'checkOngkir'])->name('web.checkouts.checkOngkir')->middleware('auth');
Route::post('/checkouts', [\App\Http\Controllers\Web\CheckoutController::class, 'store'])->name('web.checkouts.store')->middleware('auth');

// Payment Gateway Callback Route
Route::post('/callback', \App\Http\Controllers\Web\CallbackController::class)->name('web.callback');
