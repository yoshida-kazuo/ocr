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

        Route::prefix('user')
            ->group(function() {
                Route::get('manager', \App\Http\Controllers\V1\Web\Root\User\Manager\IndexController::class)
                    ->name('root.user.manager');
                Route::get('manager/{id}', \App\Http\Controllers\V1\Web\Root\User\Manager\EditController::class)
                    ->where('id', '[0-9]+')
                    ->name('root.user.manager.edit');
            });
    });
