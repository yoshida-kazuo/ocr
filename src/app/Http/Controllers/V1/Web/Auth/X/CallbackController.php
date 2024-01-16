<?php

namespace App\Http\Controllers\V1\Web\Auth\X;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Throwable;

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
        $xUser = Socialite::driver('twitter-oauth-2')
            ->user();
        $activityData = [
            'id'    => $xUser->id,
            'name'  => $xUser->getName(),
            'email' => $xUser->getEmail(),
        ];

        try {
            $user = User::firstOrCreate(
                attributes: [
                    'email'             => $xUser->getEmail()
                ],
                values: [
                    'name'              => $xUser->getName(),
                    'password'          => 'no-login-' . Str::random(255),
                    'email_verified_at' => now(),
                ]
            );

            if ($user->wasRecentlyCreated) {
                $user->refresh();

                activity()
                    ->info(__(':id : :email : :name : There was a new login with X authentication.', $activityData));
            }
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
        }

        Auth::login($user);

        activity()
            ->info(__(':id : :email : :name : has logged in with X authentication.', $activityData));

        return redirect()
            ->intended(route(user()->dashboardRoute()));
    }
}
