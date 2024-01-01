<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\V1\Web\Root\DashboardController;
use App\Http\Controllers\V1\Web\Root\ProfileController;

Route::middleware([
        'auth',
        'auth.role:root',
        'verified',
    ])
    ->prefix('root/')
    ->group(function() {

        Route::get('dashboard', DashboardController::class)
            ->name('root.dashboard');

        Route::get('profile', [
                ProfileController::class,
                'edit',
            ])
            ->name('root.profile.edit');

        Route::patch('profile', [
                ProfileController::class,
                'update',
            ])
            ->name('root.profile.update');

        Route::delete('profile', [
                ProfileController::class,
                'destroy',
            ])
            ->name('root.profile.destroy');

    });
