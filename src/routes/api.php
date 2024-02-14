<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::prefix('/')
    ->group(function() {

        //

    });

Route::prefix('v1')
    ->middleware([
        'auth:sanctum',
    ])
    ->group(function() {

        Route::prefix('user')
            ->group(function() {

                Route::post('post', \App\Http\Controllers\V1\Api\User\Post\StoreController::class)
                    ->name('api.user.post.store');
                Route::get('post', \App\Http\Controllers\V1\Api\User\Post\IndexController::class)
                    ->name('api.user.post');

            });

    });
