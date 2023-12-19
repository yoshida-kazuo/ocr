<?php

use Illuminate\Support\Facades\Route;

Route::middleware([
        'auth',
        'auth.role:admin',
        'verified',
        'account.ban',
    ])
    ->prefix(config('route.prefix.url.admin'))
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

        Route::get('activity', \App\Http\Controllers\V1\Web\Admin\Activity\IndexController::class)
            ->name('admin.activity');

        Route::prefix('user')
            ->group(function() {
                Route::get('manager', \App\Http\Controllers\V1\Web\Admin\User\Manager\IndexController::class)
                    ->name('admin.user.manager');
                Route::get('manager/{id}', \App\Http\Controllers\V1\Web\Admin\User\Manager\EditController::class)
                    ->where('id', '[0-9]+')
                    ->name('admin.user.manager.edit');
                Route::patch('manager/{id}', \App\Http\Controllers\V1\Web\Admin\User\Manager\UpdateController::class)
                    ->where('id', '[0-9]+')
                    ->name('admin.user.manager.update');
                Route::delete('manager/{id}', \App\Http\Controllers\V1\Web\Admin\User\Manager\DeleteController::class)
                    ->where('id', '[0-9]+')
                    ->name('admin.user.manager.delete');
                Route::get('manager/create', \App\Http\Controllers\V1\Web\Admin\User\Manager\CreateController::class)
                    ->name('admin.user.manager.create');
                Route::post('manager/store', \App\Http\Controllers\V1\Web\Admin\User\Manager\StoreController::class)
                    ->name('admin.user.manager.store');
            });

    });
