<?php

namespace App\Http\Middleware;

use Closure;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AuthenticateRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(
        Request $request,
        Closure $next,
        string $role
    ): Response {
        if (! auth()
            ->user()
            ?->authorizeUser($role)
        ) {
            if (! Auth::check()) {
                return redirect()
                    ->route('login', [
                        'auth' => $role,
                    ]);
            }

            abort(403);
        }

        return $next($request);
    }
}
