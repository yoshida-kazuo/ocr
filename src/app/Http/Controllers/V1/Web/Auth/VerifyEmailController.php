<?php

namespace App\Http\Controllers\V1\Web\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;

class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     *
     * @param EmailVerificationRequest $request
     *
     * @return RedirectResponse
     */
    public function __invoke(EmailVerificationRequest $request): RedirectResponse
    {
        if ($request->user()
            ->hasVerifiedEmail()
        ) {
            return redirect()
                ->intended(route(user()->dashboardRoute()).'?verified=1');
        }

        if ($request->user()
            ->markEmailAsVerified()
        ) {
            event(new Verified($request->user()));
        }

        return redirect()
            ->intended(route(user()->dashboardRoute()).'?verified=1');
    }
}
