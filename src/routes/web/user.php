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

                Route::post('pdf-convert', \App\Http\Controllers\V1\Web\User\Ocr\PdfConvert\IndexController::class)
                    ->name('user.ocr.pdf-convert');
                Route::get('pdf-convert/{convertFile}', \App\Http\Controllers\V1\Web\User\Ocr\PdfConvert\GetController::class)
                    ->name('user.ocr.pdf-convert.get');

                Route::get('monitoring-setup', \App\Http\Controllers\V1\Web\User\Ocr\MonitoringSetup\IndexController::class)
                    ->name('user.ocr.monitoring-setup');
                Route::post('monitoring-setup', \App\Http\Controllers\V1\Web\User\Ocr\MonitoringSetup\StoreController::class)
                    ->name('user.ocr.monitoring-setup.store');
                Route::put('monitoring-setup', \App\Http\Controllers\V1\Web\User\Ocr\MonitoringSetup\UpdateController::class)
                    ->name('user.ocr.monitoring-setup.update');
                Route::delete('monitoring-setup', \App\Http\Controllers\V1\Web\User\Ocr\MonitoringSetup\DestroyController::class)
                    ->name('user.ocr.monitoring-setup.delete');

                Route::get('analyze', \App\Http\Controllers\V1\Web\User\Ocr\Analyze\IndexController::class)
                    ->name('user.ocr.analyze');
                Route::delete('analyze/delete', \App\Http\Controllers\V1\Web\User\Ocr\Analyze\DestroyController::class)
                    ->name('user.ocr.analyze.destroy');

                Route::get('analyze-result/{documentId}', \App\Http\Controllers\V1\Web\User\Ocr\AnalyzeResult\IndexController::class)
                    ->name('user.ocr.analyze-result');
                Route::put('analyze-result/update/{documentId}', \App\Http\Controllers\V1\Web\User\Ocr\AnalyzeResult\UpdateController::class)
                    ->name('user.ocr.analyze-result.update');

                Route::get('analyze-result-review/{documentId}/{pageNumber}', \App\Http\Controllers\V1\Web\User\Ocr\AnalyzeResultReview\IndexController::class)
                    ->name('user.ocr.analyze-result-review');
                Route::put('analyze-result-review/update/{documentId}/{pageNumber}', \App\Http\Controllers\V1\Web\User\Ocr\AnalyzeResultReview\UpdateController::class)
                    ->name('user.ocr.analyze-result-review.update');

                Route::get('analyze-page-image/{documentId}/{pageNumber}', \App\Http\Controllers\V1\Web\User\Ocr\AnalyzePageImage\IndexController::class)
                    ->name('user.ocr.analyze-page-image');
                Route::get('analyze-page-pdf/{documentId}/{pageNumber}', \App\Http\Controllers\V1\Web\User\Ocr\AnalyzePagePdf\IndexController::class)
                    ->name('user.ocr.analyze-page-pdf');

            });

    });
