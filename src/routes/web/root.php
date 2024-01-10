<?php

use Illuminate\Support\Facades\Route;

Route::middleware([
        'auth',
        'auth.role:root',
        'verified',
    ])
    ->prefix('root/')
    ->group(function() {

        Route::get('dashboard', \App\Http\Controllers\V1\Web\Root\DashboardController::class)
            ->name('root.dashboard');

        Route::get('profile', [
                \App\Http\Controllers\V1\Web\Root\ProfileController::class,
                'edit',
            ])
            ->name('root.profile.edit');
        Route::patch('profile', [
                \App\Http\Controllers\V1\Web\Root\ProfileController::class,
                'update',
            ])
            ->name('root.profile.update');
        Route::delete('profile', [
                \App\Http\Controllers\V1\Web\Root\ProfileController::class,
                'destroy',
            ])
            ->name('root.profile.destroy');

        Route::get('user/manager', \App\Http\Controllers\V1\Web\Root\User\Manager\IndexController::class)
            ->name('root.user.manager');
    });
