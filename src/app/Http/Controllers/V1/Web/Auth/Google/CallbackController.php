<?php

namespace App\Http\Controllers\V1\Web\Auth\Google;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use App\Providers\RouteServiceProvider;
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

        $user = User::updateOrCreate([
            'email' => $googleUser->getEmail()
        ], [
            'name'  => $googleUser->getName(),
        ]);

        if (is_null($user->password)) {
            $user->password = 'no-login-' . Str::random(60);
            $user->save();
        }

        Auth::login($user);

        return redirect()
            ->intended(RouteServiceProvider::HOME);
    }

}
