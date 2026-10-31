<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Web\CartController;
use App\Http\Controllers\Web\CategoryController;
use App\Http\Controllers\Web\CheckoutController;
use App\Http\Controllers\Web\HomeController;
use App\Http\Controllers\Web\ProductController;
use App\Http\Controllers\Web\SearchController;
use App\Http\Controllers\Web\MyOrderController; // <-- Tambahkan Import Ini
use App\Http\Controllers\Account\TransactionController;
use App\Http\Controllers\Account\DashboardController as AdminDashboardController;
use App\Http\Controllers\Account\CategoryController as AdminCategoryController;
use App\Http\Controllers\Account\ProductController as AdminProductController;
use App\Http\Controllers\Account\SliderController as AdminSliderController;
use App\Http\Controllers\Account\RoleController as AdminRoleController;
use App\Http\Controllers\Account\PermissionController as AdminPermissionController;
use App\Http\Controllers\Account\UserController as AdminUserController;
use App\Http\Controllers\Account\ColorController as AdminColorController;
use Illuminate\Support\Facades\Route;

// Home & Catalog Web Public
Route::get('/', HomeController::class)->name('web.home.index');
Route::get('/products', [ProductController::class, 'index'])->name('web.products.index');
Route::get('/products/{slug}', [ProductController::class, 'show'])->name('web.products.show');
Route::get('/categories', [CategoryController::class, 'index'])->name('web.categories.index');
Route::get('/categories/{slug}', [CategoryController::class, 'show'])->name('web.categories.show');
Route::get('/search', [SearchController::class, 'index'])->name('web.search.index');

// Carts Routes (Dapat diakses Guest & Auth)
Route::get('/carts', [CartController::class, 'index'])->name('web.carts.index');
Route::get('/cart', [CartController::class, 'index']); // Alias

Route::post('/carts', [CartController::class, 'store'])->name('web.carts.store');
Route::post('/cart', [CartController::class, 'store']); // Alias

Route::post('/cart/update/{id}', [CartController::class, 'update'])->name('web.carts.update');
Route::put('/carts/{cart}', [CartController::class, 'update']);

Route::post('/cart/delete', [CartController::class, 'destroy'])->name('web.carts.destroy');
Route::delete('/carts/{cart}', [CartController::class, 'destroy']);

// Auth Routes (Guest)
Route::middleware('guest')->group(function () {
    Route::get('/register', [RegisterController::class, 'index'])->name('register');
    Route::post('/register', [RegisterController::class, 'store'])->name('register.store');

    Route::get('/login', [LoginController::class, 'index'])->name('login');
    Route::post('/login', [LoginController::class, 'store'])->name('login.store');
});

// Authenticated User Routes (Customer & General Auth)
Route::middleware('auth')->group(function () {
    Route::post('/logout', [LoginController::class, 'destroy'])->name('logout');

    // Checkout Routes
    Route::get('/checkouts', [CheckoutController::class, 'index'])->name('web.checkouts.index');
    Route::get('/checkout', [CheckoutController::class, 'index']);
    Route::post('/checkouts', [CheckoutController::class, 'store'])->name('web.checkouts.store');
    
    Route::get('/checkouts/cities', [CheckoutController::class, 'getCities'])->name('web.checkouts.getCities');
    Route::get('/checkouts/districts', [CheckoutController::class, 'getDistricts'])->name('web.checkouts.getDistricts');
    Route::post('/checkouts/check-ongkir', [CheckoutController::class, 'checkOngkir'])->name('web.checkouts.checkOngkir');

    // =========================================================================
    // MY ORDERS ROUTES (History Transaction khusus Customer / Public Storefront)
    // =========================================================================
    Route::get('/my-orders', [MyOrderController::class, 'index'])->name('web.my-orders.index');
    Route::get('/my-orders/{invoice}', [MyOrderController::class, 'show'])->name('web.my-orders.show');
});

// =========================================================================
// RUTE KHUSUS ADMINISTRATOR (Semua Menu Dashboard Admin)
// =========================================================================
Route::middleware(['auth', 'role:admin'])->prefix('account')->group(function () {
    
    // Dashboard
    Route::get('/dashboard', AdminDashboardController::class)->name('account.dashboard');

    // Categories Management
    if (class_exists(AdminCategoryController::class)) {
        Route::resource('/categories', AdminCategoryController::class, ['as' => 'account']);
    }

    // Colors Management
    Route::resource('/colors', AdminColorController::class, ['as' => 'account']);

    // Custom Image Product Routes (Wajib dideklarasikan SEBELUM Route::resource products)
    Route::post('/products/store_image_product', [AdminProductController::class, 'storeImageProduct'])->name('account.products.store_image_product');
    Route::post('/products/destroy_image_product', [AdminProductController::class, 'destroyImageProduct'])->name('account.products.destroy_image_product');
    Route::delete('/products/destroy_image_product', [AdminProductController::class, 'destroyImageProduct']); // Support DELETE method

    // Products Management
    if (class_exists(AdminProductController::class)) {
        Route::resource('/products', AdminProductController::class, ['as' => 'account']);
    }

    // Sliders Management
    if (class_exists(AdminSliderController::class)) {
        Route::resource('/sliders', AdminSliderController::class, ['as' => 'account']);
    }

    // Transactions Admin View
    Route::get('/transactions', [TransactionController::class, 'index'])->name('account.transactions.index');
    Route::get('/transactions/{snap_token}', [TransactionController::class, 'show'])->name('account.transactions.show');

    // Roles & Permissions Management
    if (class_exists(AdminRoleController::class)) {
        Route::resource('/roles', AdminRoleController::class, ['as' => 'account']);
    }
    if (class_exists(AdminPermissionController::class)) {
        Route::resource('/permissions', AdminPermissionController::class, ['as' => 'account']);
    }

    // Users Management
    if (class_exists(AdminUserController::class)) {
        Route::resource('/users', AdminUserController::class, ['as' => 'account']);
    }
});
