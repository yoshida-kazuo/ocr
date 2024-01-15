<?php

namespace App\Http\Controllers\V1\Web\Admin\User\Manager;

use App\Http\Controllers\Controller;
use App\Http\Requests\V1\Web\Admin\User\Manager\StoreRequest;
use App\Lib\Support\User\UserSupport;

class StoreController extends Controller
{

    /**
     * Handle the incoming request.
     *
     * @param StoreRequest $request
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function __invoke(
        StoreRequest $request,
        UserSupport $userSupport
    ): \Illuminate\Http\RedirectResponse {
        $user = $userSupport->store(
            values: [
                'name'      => $request->post('name'),
                'email'     => $request->post('email'),
                'password'  => bcrypt($request->post('password')),
            ],
            emailVerified: true
        );

        return to_route('admin.user.manager.edit', [
            'id' => $user->id,
        ]);
    }

}
