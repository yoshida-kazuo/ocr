<?php

namespace App\Http\Controllers\V1\Web\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\V1\Web\Auth\UpadatePasswordRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;

class PasswordController extends Controller
{
    /**
     * Update the user's password.
     *
     * @param UpadatePasswordRequest $request
     *
     * @return RedirectResponse
     */
    public function update(UpadatePasswordRequest $request): RedirectResponse
    {
        $request->user()
            ->update([
                'password' => Hash::make($request->password),
            ]);

        return back();
    }
}
