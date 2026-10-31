<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Web\CartController;
use App\Http\Controllers\Web\CategoryController;
use App\Http\Controllers\Web\CheckoutController;
use App\Http\Controllers\Web\HomeController;
use App\Http\Controllers\Web\ProductController;
use App\Http\Controllers\Web\SearchController;
use App\Http\Controllers\Account\TransactionController;
use Illuminate\Support\Facades\Route;

// Home & Catalog
Route::get('/', HomeController::class)->name('web.home.index');
Route::get('/products', [ProductController::class, 'index'])->name('web.products.index');
Route::get('/products/{slug}', [ProductController::class, 'show'])->name('web.products.show');
Route::get('/categories', [CategoryController::class, 'index'])->name('web.categories.index');
Route::get('/categories/{slug}', [CategoryController::class, 'show'])->name('web.categories.show');
Route::get('/search', [SearchController::class, 'index'])->name('web.search.index');

// Carts Routes (Dapat diakses Guest & Auth)
Route::get('/carts', [CartController::class, 'index'])->name('web.carts.index');
Route::get('/cart', [CartController::class, 'index']); // Alias singular

Route::post('/carts', [CartController::class, 'store'])->name('web.carts.store');
Route::post('/cart', [CartController::class, 'store']); // Alias singular

// Route Update Cart (Dukungan untuk POST /cart/update/{id} dan PUT /carts/{cart})
Route::post('/cart/update/{id}', [CartController::class, 'update'])->name('web.carts.update');
Route::put('/carts/{cart}', [CartController::class, 'update']);

// Route Delete Cart (Dukungan untuk POST /cart/delete dan DELETE /carts/{cart})
Route::post('/cart/delete', [CartController::class, 'destroy'])->name('web.carts.destroy');
Route::delete('/carts/{cart}', [CartController::class, 'destroy']);

// Auth Routes (Guest)
Route::middleware('guest')->group(function () {
    Route::get('/register', [RegisterController::class, 'index'])->name('register');
    Route::post('/register', [RegisterController::class, 'store'])->name('register.store');

    Route::get('/login', [LoginController::class, 'index'])->name('login');
    Route::post('/login', [LoginController::class, 'store'])->name('login.store');
});

// Authenticated Routes
Route::middleware('auth')->group(function () {
    Route::post('/logout', [LoginController::class, 'destroy'])->name('logout');

    // Checkout Routes & API Endpoints Wilayah
    Route::get('/checkouts', [CheckoutController::class, 'index'])->name('web.checkouts.index');
    Route::get('/checkout', [CheckoutController::class, 'index']); // Alias
    Route::post('/checkouts', [CheckoutController::class, 'store'])->name('web.checkouts.store');
    
    // Route Fetch Data Kota & Kecamatan
    Route::get('/checkouts/cities', [CheckoutController::class, 'getCities'])->name('web.checkouts.getCities');
    Route::get('/checkouts/districts', [CheckoutController::class, 'getDistricts'])->name('web.checkouts.getDistricts');
    Route::post('/checkouts/check-ongkir', [CheckoutController::class, 'checkOngkir'])->name('web.checkouts.checkOngkir');

    // Account Transactions
    Route::prefix('account')->group(function () {
        Route::get('/transactions', [TransactionController::class, 'index'])->name('account.transactions.index');
        Route::get('/transactions/{snap_token}', [TransactionController::class, 'show'])->name('account.transactions.show');
    });
});