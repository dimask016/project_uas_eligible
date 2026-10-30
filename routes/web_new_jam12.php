<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Web\CartController;
use App\Http\Controllers\Web\CategoryController;
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

// Carts Routes (Public Guest & Auth)
Route::get('/carts', [CartController::class, 'index'])->name('web.carts.index');
Route::post('/carts', [CartController::class, 'store'])->name('web.carts.store');
Route::put('/carts/{cart}', [CartController::class, 'update'])->name('web.carts.update');
Route::delete('/carts/{cart}', [CartController::class, 'destroy'])->name('web.carts.destroy');

// Auth Routes
Route::middleware('guest')->group(function () {
    Route::get('/register', [RegisterController::class, 'index'])->name('register');
    Route::post('/register', [RegisterController::class, 'store'])->name('register.store');

    Route::get('/login', [LoginController::class, 'index'])->name('login');
    Route::post('/login', [LoginController::class, 'store'])->name('login.store');
});

Route::middleware('auth')->group(function () {
    Route::post('/logout', [LoginController::class, 'destroy'])->name('logout');

    Route::prefix('account')->group(function () {
        Route::get('/transactions', [TransactionController::class, 'index'])->name('account.transactions.index');
        Route::get('/transactions/{snap_token}', [TransactionController::class, 'show'])->name('account.transactions.show');
    });
});
