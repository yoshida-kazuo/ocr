<?php

namespace App\Http\Controllers\V1\Web\Auth\Google;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use App\Http\Controllers\Controller;
use App\Lib\Support\User\UserSupport;
use Throwable;

class CallbackController extends Controller
{

    /**
     * Handle the incoming request.
     *
     * @param Request $request
     * @param UserSupport $userSupport
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function __invoke(
        Request $request,
        UserSupport $userSupport
    ): \Illuminate\Http\RedirectResponse {
        $providerUser = Socialite::driver('google')
            ->user();
        $activityData = [
            'id'    => $providerUser->getId(),
            'name'  => $providerUser->getName(),
            'email' => $providerUser->getEmail(),
        ];

        try {
            $user = $userSupport->model()::firstOrNew(
                attributes: [
                    'provider'      => 'google',
                    'provider_id'   => $providerUser->getId(),
                ],
                values: [
                    'name'              => $providerUser->getName(),
                    'email'             => $providerUser->getEmail(),
                    'password'          => 'no-login-' . Str::random(255),
                    'email_verified_at' => now(),
                ]);

            if (! $user->id) {
                $user->save();
                $user->refresh();

                activity()
                    ->info(__(':id : :email : :name : There was a new login with Google authentication.', $activityData));
            }

            Auth::login($user);
        } catch(\Illuminate\Database\UniqueConstraintViolationException $e) {
            activity()
                ->info(__(':id : :email : Google authentication failed. The email is already registered.', $activityData));

            return to_route(route: 'login')
                ->withErrors([
                    'google_auth'   => __('auth.failed'),
                ]);
        } catch(Throwable $e) {
            report($e);
            activity()
                ->error(__(':id : :email : Google authentication failed.', $activityData));

            return to_route(route: 'login')
                ->withErrors([
                    'google_auth'   => __('auth.failed'),
                ]);
        }

        activity()
            ->info(__(':id : :email : :name : has logged in with Google authentication.', $activityData));

        return redirect()
            ->intended(route(user()->dashboardRoute()));
    }

}
