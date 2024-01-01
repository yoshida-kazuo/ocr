<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\V1\Web\Guest\Env\LangController;
use App\Http\Controllers\V1\Web\Guest\Env\LangUpdateController;
use App\Http\Controllers\V1\Web\Guest\Env\TimezoneController;
use App\Http\Controllers\V1\Web\Guest\Env\TimezoneUpdateController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

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
            ->name('guest-lang');
        Route::put('lang', LangUpdateController::class)
            ->name('guest-lang-put');

        Route::get('timezone', TimezoneController::class)
            ->name('guest-timezone');
        Route::put('timezone', TimezoneUpdateController::class)
            ->name('guest-timezone-put');

    });

require __DIR__.'/web-user.php';
require __DIR__.'/web-admin.php';
require __DIR__.'/web-root.php';

require __DIR__.'/auth.php';
