<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AccountBan
{

    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (user('login_ban_at')) {
            activity()
                ->info(__(':userId : :email : :name : This account has been banned from logging in.', [
                    'userId'    => user('id'),
                    'email'     => user('email'),
                    'name'      => user('name'),
                ]));

            auth('web')
                ->logout();

            $request->session()
                ->invalidate();
            $request->session()
                ->regenerateToken();

            return to_route(route: 'login')
                ->withErrors(['email' => __('This account has been banned from logging in.')]);
        }

        return $next($request);
    }

}
