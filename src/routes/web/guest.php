<?php

use Illuminate\Support\Facades\Route;

Route::get('/', \App\Http\Controllers\V1\Web\Guest\HomeController::class)
    ->name('home');

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
        Route::post('contact', \App\Http\Controllers\V1\Web\Guest\Contact\SendController::class)
            ->name('contact.send');

    });
