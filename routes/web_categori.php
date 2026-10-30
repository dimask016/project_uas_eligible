<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

//route register index
Route::get('/register', [\App\Http\Controllers\Auth\RegisterController::class, 'index'])->name('register')->middleware('guest');

//route register store
Route::post('/register', [\App\Http\Controllers\Auth\RegisterController::class, 'store'])->name('register.store')->middleware('guest');

//route login index
Route::get('/login', [\App\Http\Controllers\Auth\LoginController::class, 'index'])->name('login')->middleware('guest');

//route login store
Route::post('/login', [\App\Http\Controllers\Auth\LoginController::class, 'store'])->name('login.store')->middleware('guest');

//route logout
Route::post('/logout', \App\Http\Controllers\Auth\LogoutController::class)->name('logout')->middleware('auth');

//prefix "account"
Route::prefix('account')->group(function() {
    
    //middleware "auth"
    Route::group(['middleware' => ['auth']], function () {
        
        //route dashboard
        Route::get('/dashboard', App\Http\Controllers\Account\DashboardController::class)->name('account.dashboard');
    
        //route permissions
        Route::get('/permissions', [\App\Http\Controllers\Account\PermissionController::class, 'index'])->name('account.permissions.index');

        //route resource roles
        Route::resource('/roles', \App\Http\Controllers\Account\RoleController::class, ['as' => 'account']);

        //route resource users
        Route::resource('/users', \App\Http\Controllers\Account\UserController::class, ['as' => 'account']);

        //route resource colors
        Route::resource('/colors', \App\Http\Controllers\Account\ColorController::class, ['as' => 'account']);


 //route resource categories
        Route::resource('/categories', \App\Http\Controllers\Account\CategoryController::class, ['as' => 'account']);



//route store image product
         Route::post('/products/store_image_product', [\App\Http\Controllers\Account\ProductController::class, 'storeImageProduct'])->name('account.products.store_image_product');

         //route destroy image product
         Route::delete('/products/destroy_image_product/{id}', [\App\Http\Controllers\Account\ProductController::class, 'destroyImage'])->name('account.products.destroy_image_product');
         
         //route resource products
         Route::resource('/products', \App\Http\Controllers\Account\ProductController::class, ['as' => 'account']);


   //route transactions index
        Route::get('/transactions', [App\Http\Controllers\Account\TransactionController::class, 'index'])->name('account.transactions.index');

        //route transactions show
        Route::get('/transactions/{invoice}', [App\Http\Controllers\Account\TransactionController::class, 'show'])->name('account.transactions.show');

  //route resource sliders
        Route::resource('/sliders', App\Http\Controllers\Account\SliderController::class, ['except' => ['create', 'show', 'edit', 'update'], 'as' => 'account']);

    });
    
});

/**
 * route home
 */
Route::get('/', \App\Http\Controllers\Web\HomeController::class)->name('web.home.index');

/**
 * route category index
 */
Route::get('/categories', [\App\Http\Controllers\Web\CategoryController::class, 'index'])->name('web.categories.index');

/**
 * route category show
 */
Route::get('/categories/{slug}', [\App\Http\Controllers\Web\CategoryController::class, 'show'])->name('web.categories.show');
