<?php

namespace App\Http\Controllers\V1\Web\Auth\Twitch;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use App\Lib\Support\User\UserSupport;
use App\Lib\Support\User\AuthProviderSupport;
use Throwable;

class CallbackController extends Controller
{

    /**
     * Handle the incoming request.
     */
    public function __invoke(
        Request $request,
        UserSupport $userSupport,
        AuthProviderSupport $authProviderSupport
    ): \Illuminate\Http\RedirectResponse {
        $providerUser = Socialite::driver('twitch')
            ->user();
        $activityData = [
            'id'    => $providerUser->getId(),
            'name'  => $providerUser->getName(),
            'email' => $providerUser->getEmail(),
        ];

        DB::beginTransaction();

        try {
            $authProvider = $authProviderSupport->model()::firstOrNew(
                attributes: [
                    'provider_id'       => 2,
                    'provider_user_id'  => $providerUser->getId(),
                ]
            );

            if (! $authProvider?->user_id) {
                $user = $userSupport->model()::create(
                    attributes: [
                        'name'              => $providerUser->getName(),
                        'email'             => $userSupport->createUniqueColumn(
                            uniqueColumn: 'email',
                            suffix: '@' . config('app.user_dummy_email_domain')
                        ),
                        'password'          => 'no-login-' . Str::random(255),
                        'email_verified_at' => now(),
                    ]
                );
                $user->authProviders()
                    ->save($authProvider);
                $user->refresh();

                activity()
                    ->info(__(':id : :email : :name : There was a new login with Twitch authentication.', $activityData));
            } else {
                $user = $authProvider->user;
            }

            Auth::login($user);

            DB::commit();
        } catch(\Illuminate\Database\UniqueConstraintViolationException $e) {
            activity()
                ->info(__(':id : :email : Twitch authentication failed. The email is already registered.', $activityData));
        } catch(Throwable $e) {
            report($e);
            activity()
                ->error(__(':id : :email : Twitch authentication failed.', $activityData));
        } finally {
            if ($e ?? false) {
                DB::rollback();

                return to_route(route: 'login')
                    ->withErrors([
                        'google_auth'   => __('auth.failed'),
                    ]);
            }
        }

        activity()
            ->info(__(':id : :email : :name : has logged in with Twitch authentication.', $activityData));

        return redirect()
            ->intended(route(user()->dashboardRoute()));
    }

}
