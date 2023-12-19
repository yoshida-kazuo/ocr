<?php

namespace App\Http\Controllers\V1\Web\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\V1\Web\Auth\RegisterRequest;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     *
     * @return Response
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @param RegisterRequest $request
     *
     * @return RedirectResponse
     */
    public function store(RegisterRequest $request): RedirectResponse
    {
        $activityData = [
            'name'  => $request->name,
            'email' => $request->email,
        ];

        $user = User::create([
            'name'      => $request->name,
            'email'     => $request->email,
            'password'  => Hash::make($request->password),
        ]);

        event(new Registered($user));

        $user->refresh();

        activity()
            ->info(__(':email : :name : New registration has been completed.', $activityData));

        Auth::login($user);

        return redirect(route(user()->dashboardRoute()));
    }
}
