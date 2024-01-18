<?php

namespace App\Http\Controllers\V1\Web\Auth\X;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use App\Lib\Support\User\UserSupport;
use Exception;
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
        $providerUser = Socialite::driver('twitter-oauth-2')
            ->user();
        $activityData = [
            'id'    => $providerUser->getId(),
            'name'  => $providerUser->getName(),
            'email' => $providerUser->getEmail(),
        ];

        try {
            $user = $userSupport->model()::firstOrNew(
                attributes: [
                    'provider'      => 'x',
                    'provider_id'   => $providerUser->getId(),
                ],
                values: [
                    'name'              => $providerUser->getName(),
                    'password'          => 'no-login-' . Str::random(255),
                    'email_verified_at' => now(),
                ]);

            if (! $user->id) {
                if (! $emailDummy = $userSupport
                    ->createUniqueColumn(
                        uniqueColumn: 'email',
                        suffix: '@' . config('app.user_dummy_email_domain')
                    )
                ) {
                    $errorMessage = __(':id : :email : X authentication failed. Failed to generate a dummy email.', $activityData);
                    report($errorMessage);
                    activity()
                        ->error($errorMessage);

                    throw new Exception;
                }

                $user->email = $emailDummy;
                $user->save();
                $user->refresh();

                activity()
                    ->info(__(':id : :email : :name : There was a new login with X authentication.', $activityData));
            }

            Auth::login($user);
        } catch(\Illuminate\Database\UniqueConstraintViolationException $e) {
            activity()
                ->info(__(':id : :email : X authentication failed. The email is already registered.', $activityData));

            return to_route(route: 'login')
                ->withErrors([
                    'x_auth'   => __('auth.failed'),
                ]);
        } catch(Throwable $e) {
            report($e);
            activity()
                ->error(__(':id : :email : X authentication failed.', $activityData));

            return to_route(route: 'login')
                ->withErrors([
                    'x_auth'   => __('auth.failed'),
                ]);
        }

        activity()
            ->info(__(':id : :email : :name : has logged in with X authentication.', $activityData));

        return redirect()
            ->intended(route(user()->dashboardRoute()));
    }

}
