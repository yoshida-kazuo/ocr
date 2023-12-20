<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
        return Inertia::render('Welcome', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'laravelVersion' => Application::VERSION,
            'phpVersion' => PHP_VERSION,
        ]);
    });

Route::middleware([
        'auth',
    ])
    ->group(function() {

        Route::get('/profile', [
                \App\Http\Controllers\V1\Web\User\ProfileController::class,
                'edit'
            ])
            ->name('profile.edit');

        Route::patch('/profile', [
                \App\Http\Controllers\V1\Web\User\ProfileController::class,
                'update'
            ])
            ->name('profile.update');

        Route::delete('/profile', [
                \App\Http\Controllers\V1\Web\User\ProfileController::class,
                'destroy'
            ])
            ->name('profile.destroy');

    });

Route::middleware([
        'auth',
        'auth.role:user',
        'verified',
    ])
    ->group(function() {

        Route::get('/dashboard', function () {
                return Inertia::render('Dashboard');
            })
            ->name('dashboard');

    });

Route::middleware([
        'auth',
        'auth.role:admin',
        'verified',
    ])
    ->group(function() {

        //

    });

Route::middleware([
        'auth',
        'auth.role:root',
        'verified',
    ])
    ->group(function() {

        //

    });

require __DIR__.'/auth.php';
