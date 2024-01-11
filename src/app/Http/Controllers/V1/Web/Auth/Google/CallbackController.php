<?php

namespace App\Http\Controllers\V1\Web\Auth\Google;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use App\Http\Controllers\Controller;
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
        $googleUser = Socialite::driver('google')
            ->user();
        $activityData = [
            'id'    => $googleUser->id,
            'name'  => $googleUser->getName(),
            'email' => $googleUser->getEmail(),
        ];

        try {
            $user = User::firstOrCreate([
                'email'             => $googleUser->getEmail()
            ], [
                'name'              => $googleUser->getName(),
                'password'          => 'no-login-' . Str::random(255),
                'email_verified_at' => now(),
            ]);

            if ($user->wasRecentlyCreated) {
                $user->refresh();

                activity()
                    ->info(__(':id : :email : :name : There was a new login with Google authentication.', $activityData));
            }
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
        }

        Auth::login($user);

        activity()
            ->info(__(':id : :email : :name : has logged in with Google authentication.', $activityData));

        return redirect()
            ->intended(route(user()->dashboardRoute()));
    }

}
