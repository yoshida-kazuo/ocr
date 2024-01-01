<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\V1\Web\User\DashboardController;
use App\Http\Controllers\V1\Web\User\ProfileController;

Route::middleware([
        'auth',
        'auth.role:user',
        'verified',
    ])
    ->prefix('/')
    ->group(function() {

        Route::get('dashboard', DashboardController::class)
            ->name('user.dashboard');

        Route::get('profile', [
                ProfileController::class,
                'edit',
            ])
            ->name('profile.edit');

        Route::patch('profile', [
                ProfileController::class,
                'update',
            ])
            ->name('profile.update');

        Route::delete('profile', [
                ProfileController::class,
                'destroy',
            ])
            ->name('profile.destroy');

    });
