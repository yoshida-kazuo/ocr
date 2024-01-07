<?php

namespace App\Http\Controllers\V1\Web\Auth\Google;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;
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

        $validator = Validator::make([
            'google_auth' => $googleUser->getEmail(),
        ], [
            'google_auth' => [
                'unique:App\Models\User,email',
            ],
        ], [
            'google_auth.unique'  => __('auth.failed'),
        ]);

        if ($validator->fails()) {
            activity(__(':id : :email : Google authentication failed. The email is already registered.', [
                    'id'    => $googleUser->id,
                    'name'  => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                ]),
                'info');

            return to_route('login')
                ->withErrors($validator);
        }

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

        activity()
            ->info(__(':id : :email : :name : has logged in with Google authentication.', [
                'id'    => $googleUser->id,
                'name'  => user('name'),
                'email' => user('email'),
            ]));

        return redirect()
            ->intended(
                route(user()->dashboardRoute())
            );
    }

}
