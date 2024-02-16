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

        Route::prefix('ocr')
            ->group(function() {

                Route::get('example', \App\Http\Controllers\V1\Web\User\Ocr\ExampleController::class)
                    ->name('user.ocr.example');

                Route::get('monitoring-setup', \App\Http\Controllers\V1\Web\User\Ocr\MonitoringSetup\IndexController::class)
                    ->name('user.ocr.monitoring-setup');
                Route::post('monitoring-setup', \App\Http\Controllers\V1\Web\User\Ocr\MonitoringSetup\StoreController::class)
                    ->name('user.ocr.monitoring-setup.store');
                Route::put('monitoring-setup', \App\Http\Controllers\V1\Web\User\Ocr\MonitoringSetup\UpdateController::class)
                    ->name('user.ocr.monitoring-setup.update');
                Route::delete('monitoring-setup', \App\Http\Controllers\V1\Web\User\Ocr\MonitoringSetup\DestroyController::class)
                    ->name('user.ocr.monitoring-setup.delete');

            });

    });
