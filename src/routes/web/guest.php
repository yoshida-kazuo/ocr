<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\V1\Web\Guest\Env\LangController;
use App\Http\Controllers\V1\Web\Guest\Env\LangUpdateController;
use App\Http\Controllers\V1\Web\Guest\Env\TimezoneController;
use App\Http\Controllers\V1\Web\Guest\Env\TimezoneUpdateController;

Route::get('/', function () {
        return Inertia::render('Welcome', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'laravelVersion' => Application::VERSION,
            'phpVersion' => PHP_VERSION,
        ]);
    });

Route::prefix('/')
    ->group(function () {

        Route::get('lang', LangController::class)
            ->name('lang');
        Route::put('lang', LangUpdateController::class)
            ->name('lang-put');

        Route::get('timezone', TimezoneController::class)
            ->name('timezone');
        Route::put('timezone', TimezoneUpdateController::class)
            ->name('timezone-put');

    });
