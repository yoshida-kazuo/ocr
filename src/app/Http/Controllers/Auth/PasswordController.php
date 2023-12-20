<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\UpadatePasswordRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;

class PasswordController extends Controller
{
    /**
     * Update the user's password.
     */
    public function update(UpadatePasswordRequest $request): RedirectResponse
    {
        $request->user()->update([
            'password'  => Hash::make($request->password),
        ]);

        return back();
    }
}
