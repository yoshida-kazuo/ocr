<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Symfony\Component\HttpFoundation\Response;

class ApplicationManager
{

    /**
     * Handle an incoming request.
     *
     * @param Request $request
     * @param Closure $next
     *
     * @return Response
     */
    public function handle(
        Request $request,
        Closure $next
    ): Response {
        if (Route::currentRouteName() === 'register'
            && config('app.enable_registration') === false
        ) {
            return to_route('login')
                ->withErrors([
                    'registration' => __('Currently, account registration is not available. Please try again later.'),
                ]);
        }

        return $next($request);
    }

}
