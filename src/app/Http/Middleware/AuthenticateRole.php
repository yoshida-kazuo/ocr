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
     * @param Request $request
     * @param Closure $next
     * @param string $role
     *
     * @return Response
     */
    public function handle(
        Request $request,
        Closure $next,
        string $role
    ): Response {
        if (! auth()
            ->user()
            ?->isAuthorizeUser($role)
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
