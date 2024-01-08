<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', \App\Http\Controllers\V1\Web\Guest\TopController::class)
    ->name('top');

Route::prefix('/')
    ->group(function () {

        Route::get('lang', \App\Http\Controllers\V1\Web\Guest\Env\LangController::class)
            ->name('lang');
        Route::put('lang', \App\Http\Controllers\V1\Web\Guest\Env\LangUpdateController::class)
            ->name('lang-put');

        Route::get('timezone', \App\Http\Controllers\V1\Web\Guest\Env\TimezoneController::class)
            ->name('timezone');
        Route::put('timezone', \App\Http\Controllers\V1\Web\Guest\Env\TimezoneUpdateController::class)
            ->name('timezone-put');

        Route::get('contact', \App\Http\Controllers\V1\Web\Guest\Contact\IndexController::class)
            ->name('contact');

    });
