<?php

namespace App\Http\Controllers\V1\Web\Admin\User\Manager;

use App\Http\Controllers\Controller;
use App\Http\Requests\V1\Web\Admin\User\Manager\UpdateRequest;
use App\Lib\Support\User\UserSupport;

class UpdateController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param UpdateRequest $request
     * @param UserSupport $userSupport
     * @param integer $id
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function __invoke(
        UpdateRequest $request,
        UserSupport $userSupport,
        int $id
    ): \Illuminate\Http\RedirectResponse {
        $userSupport->update(
            id: $id,
            values: [
                'name'      => $request->post('name'),
                'email'     => $request->post('email'),
                'role_id'   => $request->post('role_id'),
            ],
            isLoginProhibited: (bool) $request->post('is_login_prohibited'),
            isRestore: (bool) $request->post('is_restore'),
            withTrashed: true
        );

        return to_route(
            route: 'admin.user.manager.edit',
            parameters: [
                $id,
            ]
        );
    }
}
