<?php

use Illuminate\Support\Facades\Route;

Route::middleware([
        'auth',
        'verified',
        'account.ban',
    ])
    ->prefix('member')
    ->group(function() {

        Route::post('post', \App\Http\Controllers\V1\Web\Member\Post\StoreController::class)
            ->name('member.post.store');
        Route::put('post', \App\Http\Controllers\V1\Web\Member\Post\UpdateController::class)
            ->name('member.post.update');
        Route::delete('post', \App\Http\Controllers\V1\Web\Member\Post\DestroyController::class)
            ->name('member.post.delete');

    });
