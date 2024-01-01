<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\V1\Web\Admin\DashboardController;
use App\Http\Controllers\V1\Web\Admin\ProfileController;

Route::middleware([
        'auth',
        'auth.role:admin',
        'verified',
    ])
    ->prefix('admin/')
    ->group(function() {

        Route::get('dashboard', DashboardController::class)
            ->name('admin.dashboard');

        Route::get('profile', [
                ProfileController::class,
                'edit',
            ])
            ->name('admin.profile.edit');

        Route::patch('profile', [
                ProfileController::class,
                'update',
            ])
            ->name('admin.profile.update');

        Route::delete('profile', [
                ProfileController::class,
                'destroy',
            ])
            ->name('admin.profile.destroy');

    });
