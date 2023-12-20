<?php

namespace App\Providers;

use Laravel\Sanctum\Sanctum;
use Illuminate\Support\ServiceProvider;
use App\Models\PersonalAccessToken;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Sanctum::usePersonalAccessTokenModel(
            PersonalAccessToken::class
        );

        $viewTimezoneDefault = config('app.view_timezone_default');
        $timezoneCookie = request()
            ->cookie('timezone');

        if (! $timezoneCookie) {
            $timezoneCookie = $viewTimezoneDefault;
        } else {
            $timezoneCookie = explode(
                '|',
                decrypt($timezoneCookie, false)[1] ?? $viewTimezoneDefault
            );
        }

        $timezone = collect(
            config("timezone.{$timezoneCookie}", [
                'name'  => 'UTC',
                'zone'  => 'UTC',
                'lang'  => 'en',
            ])
        );

        config([
            'app' => array_merge(
                config('app'), [
                    'timezone'  => $timezone->get('zone'),
                    'locale'    => $timezone->get('lang'),
                ]
            )
        ]);

        unset($viewTimezoneDefault,
            $timezoneCookie,
            $timezone);
    }
}
