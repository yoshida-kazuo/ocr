<?php

namespace App\Http\Controllers\V1\Web\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmailVerificationPromptController extends Controller
{

    /**
     * Display the email verification prompt.
     *
     * @param Request $request
     *
     * @return RedirectResponse|Response
     */
    public function __invoke(Request $request): RedirectResponse|Response
    {
        return $request->user()->hasVerifiedEmail()
            ? redirect()->intended(route(user()->dashboardRoute()))
            : Inertia::render('Auth/VerifyEmail', [
                'status'    => session('status'),
                'requests'  => $request->query('requests', false),
            ]);
    }

}
