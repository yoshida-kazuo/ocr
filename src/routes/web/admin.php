<?php

use Illuminate\Support\Facades\Route;

Route::middleware([
        'auth',
        'auth.role:admin',
        'verified',
    ])
    ->prefix('admin/')
    ->group(function() {

        Route::get('dashboard', \App\Http\Controllers\V1\Web\Admin\DashboardController::class)
            ->name('admin.dashboard');

        Route::get('profile', [
                \App\Http\Controllers\V1\Web\Admin\ProfileController::class,
                'edit',
            ])
            ->name('admin.profile.edit');

        Route::patch('profile', [
                \App\Http\Controllers\V1\Web\Admin\ProfileController::class,
                'update',
            ])
            ->name('admin.profile.update');

        Route::delete('profile', [
                \App\Http\Controllers\V1\Web\Admin\ProfileController::class,
                'destroy',
            ])
            ->name('admin.profile.destroy');

        Route::get('admin/activity', \App\Http\Controllers\V1\Web\Admin\Activity\IndexController::class)
            ->name('admin.activity');

    });
