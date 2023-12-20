<?php

namespace App\Providers;

use Laravel\Sanctum\Sanctum;
use Illuminate\Support\ServiceProvider;
use App\Models\PersonalAccessToken;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot(): void
    {
        Sanctum::usePersonalAccessTokenModel(
            PersonalAccessToken::class
        );

        $viewTimezone = config('app.timezone_view');
        $timezone = request()
            ->cookie('timezone');

        if (! $timezone) {
            $timezone = $viewTimezone;
        } else {
            $timezone = explode('|', decrypt($timezone, false))[1] ?? $viewTimezone;
        }

        $lang = request()
            ->cookie('lang');

        if (! $lang) {
            $lang = config('app.locale');
        } else {
            $lang = explode('|', decrypt($lang, false))[1] ?? config('app.locale');
        }

        $timezone = config("timezone.{$timezone}") ? $timezone : config('app.timezone');
        $lang = config("locale.{$lang}") ? $lang : config('app.locale');

        config([
            'app' => array_merge(
                config('app'), [
                    'timezone_view' => $timezone,
                    'locale'        => $lang,
                ]
            )
        ]);

        unset(
            $viewTimezone,
            $timezone,
            $lang
        );
    }
}
