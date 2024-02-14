<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Middleware;
use Inertia\Inertia;
use Tightenco\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        //

        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user(),
            ],
            'ziggy' => function () use ($request) {
                return array_merge((new Ziggy)->toArray(), [
                    'location'  => $request->url(),
                    'query'     => $request->query(),
                    'path'      => $request->getPathInfo(),
                ]);
            },
            'timezone'  => config('app.timezone_view'),
            'lang'      => config('app.locale'),
            'isProvider'=>
                ! (bool) Str::afterLast(
                    user('email'),
                    config('app.user_dummy_email_domain')
                )
        ]);
    }
}
