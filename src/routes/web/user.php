<?php

use Illuminate\Support\Facades\Route;

Route::middleware([
        'auth',
        'auth.role:user',
        'verified',
        'account.ban',
    ])
    ->prefix(config('route.prefix.url.user'))
    ->group(function() {

        Route::get('dashboard', \App\Http\Controllers\V1\Web\User\DashboardController::class)
            ->name('user.dashboard');
        Route::get('profile', [
                \App\Http\Controllers\V1\Web\User\ProfileController::class,
                'edit',
            ])
            ->name('profile.edit');
        Route::patch('profile', [
                \App\Http\Controllers\V1\Web\User\ProfileController::class,
                'update',
            ])
            ->name('profile.update');
        Route::delete('profile', [
                \App\Http\Controllers\V1\Web\User\ProfileController::class,
                'destroy',
            ])
            ->name('profile.destroy');

    });
