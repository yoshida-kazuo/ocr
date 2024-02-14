<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Auth Routes
|--------------------------------------------------------------------------
*/

Route::middleware([
        'guest',
        'app.manager',
    ])
    ->prefix('/')
    ->group(function () {

        Route::get('register', [
                \App\Http\Controllers\V1\Web\Auth\RegisteredUserController::class,
                'create',
            ])
            ->name('register');
        Route::post('register', [
                \App\Http\Controllers\V1\Web\Auth\RegisteredUserController::class,
                'store',
            ]);

        Route::get('login', [
                \App\Http\Controllers\V1\Web\Auth\AuthenticatedSessionController::class,
                'create',
            ])
            ->name('login');
        Route::post('login', [
                \App\Http\Controllers\V1\Web\Auth\AuthenticatedSessionController::class,
                'store',
            ]);

        Route::get('forgot-password', [
                \App\Http\Controllers\V1\Web\Auth\PasswordResetLinkController::class,
                'create',
            ])
            ->name('password.request');
        Route::post('forgot-password', [
                \App\Http\Controllers\V1\Web\Auth\PasswordResetLinkController::class,
                'store',
            ])
            ->name('password.email');

        Route::get('reset-password/{token}', [
                \App\Http\Controllers\V1\Web\Auth\NewPasswordController::class,
                'create',
            ])
            ->name('password.reset');
        Route::post('reset-password', [
                \App\Http\Controllers\V1\Web\Auth\NewPasswordController::class,
                'store',
            ])
            ->name('password.store');

        Route::prefix('auth')
            ->group(function() {

                Route::get('google', \App\Http\Controllers\V1\Web\Auth\Google\AuthController::class)
                    ->name('auth.google');
                Route::get('google-callback', \App\Http\Controllers\V1\Web\Auth\Google\CallbackController::class)
                    ->name('auth.google.callback');
                Route::get('x', \App\Http\Controllers\V1\Web\Auth\X\AuthController::class)
                    ->name('auth.x');
                Route::get('x-callback', \App\Http\Controllers\V1\Web\Auth\X\CallbackController::class)
                    ->name('auth.x.callback');
                Route::get('twitch', \App\Http\Controllers\V1\Web\Auth\Twitch\AuthController::class)
                    ->name('auth.twitch');
                Route::get('twitch-callback', \App\Http\Controllers\V1\Web\Auth\Twitch\CallbackController::class)
                    ->name('auth.twitch.callback');

            });
    });

Route::middleware('auth')
    ->prefix('/')
    ->group(function () {

        Route::get('verify-email', \App\Http\Controllers\V1\Web\Auth\EmailVerificationPromptController::class)
            ->name('verification.notice');
        Route::get('verify-email/{id}/{hash}', \App\Http\Controllers\V1\Web\Auth\VerifyEmailController::class)
            ->middleware([
                'signed',
                'throttle:6,1',
            ])
            ->name('verification.verify');
        Route::post('email/verification-notification', [
                \App\Http\Controllers\V1\Web\Auth\EmailVerificationNotificationController::class,
                'store',
            ])
            ->middleware('throttle:6,1')
            ->name('verification.send');
        Route::get('confirm-password', [
                \App\Http\Controllers\V1\Web\Auth\ConfirmablePasswordController::class,
                'show',
            ])
            ->name('password.confirm');
        Route::post('confirm-password', [
                \App\Http\Controllers\V1\Web\Auth\ConfirmablePasswordController::class,
                'store',
            ]);
        Route::put('password', [
                \App\Http\Controllers\V1\Web\Auth\PasswordController::class,
                'update',
            ])
            ->name('password.update');
        Route::post('logout', [
                \App\Http\Controllers\V1\Web\Auth\AuthenticatedSessionController::class,
                'destroy',
            ])
            ->name('logout');

    });
