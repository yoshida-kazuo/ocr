<?php

use Illuminate\Support\Facades\Route;

Route::middleware([
        'auth',
        'auth.role:root',
        'verified',
        'account.ban',
    ])
    ->prefix(config('route.prefix.url.root'))
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

        Route::get('activity', \App\Http\Controllers\V1\Web\Root\Activity\IndexController::class)
            ->name('root.activity');

        Route::prefix('user')
            ->group(function() {
                Route::get('manager', \App\Http\Controllers\V1\Web\Root\User\Manager\IndexController::class)
                    ->name('root.user.manager');
                Route::get('manager/{id}', \App\Http\Controllers\V1\Web\Root\User\Manager\EditController::class)
                    ->where('id', '[0-9]+')
                    ->name('root.user.manager.edit');
                Route::patch('manager/{id}', \App\Http\Controllers\V1\Web\Root\User\Manager\UpdateController::class)
                    ->where('id', '[0-9]+')
                    ->name('root.user.manager.update');
                Route::delete('manager/{id}', \App\Http\Controllers\V1\Web\Root\User\Manager\DeleteController::class)
                    ->where('id', '[0-9]+')
                    ->name('root.user.manager.delete');
                Route::get('manager/create', \App\Http\Controllers\V1\Web\Root\User\Manager\CreateController::class)
                    ->name('root.user.manager.create');
                Route::post('manager/store', \App\Http\Controllers\V1\Web\Root\User\Manager\StoreController::class)
                    ->name('root.user.manager.store');
            });
    });
