<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Auth\Middleware\EnsureEmailIsVerified as VendorEnsureEmailIsVerified;

class EnsureEmailIsVerified extends VendorEnsureEmailIsVerified
{

    /**
     * Specify the redirect route for the middleware.
     *
     * @param  string  $route
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
        //

        return $next($request);
    }

}
