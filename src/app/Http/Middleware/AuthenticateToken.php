<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthenticateToken
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(
        Request $request,
        Closure $next
    ): Response {
        if (isset($request->token)) {
            $request->headers->set('Authorization', sprintf('%s %s', ...[
                'Bearer',
                $request->token,
            ]));
        }

        return $next($request);
    }
}
