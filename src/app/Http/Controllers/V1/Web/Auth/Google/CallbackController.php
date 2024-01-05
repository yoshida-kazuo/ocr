<?php

namespace App\Http\Controllers\V1\Web\Auth\Google;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use App\Http\Controllers\Controller;
use App\Models\User;

class CallbackController extends Controller
{

    /**
     * Handle the incoming request.
     *
     * @param Request $request
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function __invoke(Request $request): \Illuminate\Http\RedirectResponse
    {
        $googleUser = Socialite::driver('google')
            ->user();

        $user = User::firstOrCreate([
            'email'             => $googleUser->getEmail()
        ], [
            'name'              => $googleUser->getName(),
            'password'          => 'no-login-' . Str::random(60),
            'email_verified_at' => now(),
        ]);

        if ($user->wasRecentlyCreated) {
            $user->refresh();
        }

        Auth::login($user);

        return redirect()
            ->intended(
                route(user()->dashboardRoute())
            );
    }

}
