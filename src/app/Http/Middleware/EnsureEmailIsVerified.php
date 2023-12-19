<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Auth\Middleware\EnsureEmailIsVerified as VendorEnsureEmailIsVerified;
use Carbon\Carbon;
use Inertia\Inertia;

class EnsureEmailIsVerified extends VendorEnsureEmailIsVerified
{

    /**
     * Specify the redirect route for the middleware.
     *
     * @param  string  $route
     *
     * @return string
     */
    public static function redirectTo($route)
    {
        return parent::redirectTo($route);
    }

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string|null  $redirectToRoute
     *
     * @return Illuminate\Http\Response\Response|\Illuminate\Http\RedirectResponse|null
     */
    public function handle(
        $request,
        Closure $next,
        $redirectToRoute = null
    ) {
        if (! $request->user()
            || ($request->user() instanceof MustVerifyEmail
                && ! $request->user()->hasVerifiedEmail())
        ) {
            if ($request->expectsJson()) {
                abort(403, 'Your email address is not verified.');
            }

            $now = Carbon::now(config('app.timezone_view'));
            $createdAt = Carbon::make(user('created_at'));

            if ($now->diffInHours($createdAt) >= 24) {
                return to_route('verification.notice', [
                    'requests' => 'email-authentication-required'
                ]);
            } else {
                Inertia::share(
                    'requests',
                    'complete-email-verification'
                );
            }

            unset($now,
                $createdAt);
        }

        return $next($request);
    }

}
