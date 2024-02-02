<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class InteriaRole extends HandleInertiaRequests
{

    /**
     * rootView variable
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     *
     * @param Request $request
     *
     * @return string|null
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @param Request $request
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return parent::share($request);
    }

    /**
     * Sets the root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @param Request $request
     *
     * @return string
     */
    public function rootView(Request $request): string
    {
        $rootView = parent::rootView($request);
        $roleName = collect(user()?->roles())
            ->get(user('role_id'));

        if (is_string($roleName)) {
            // $rootView = "{$rootView}-{$roleName}";
        }

        return $rootView;
    }

}
