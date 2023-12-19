<?php

namespace App\Http\Controllers\V1\Web\Admin\User\Manager;

use App\Http\Controllers\Controller;
use App\Http\Requests\V1\Web\Admin\User\Manager\DeleteRequest;
use App\Lib\Support\User\UserSupport;

class DeleteController extends Controller
{

    /**
     * Handle the incoming request.
     *
     * @param DeleteRequest $request
     * @param UserSupport $userSupport
     * @param integer $id
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function __invoke(
        DeleteRequest $request,
        UserSupport $userSupport,
        int $id
    ): \Illuminate\Http\RedirectResponse {
        $userSupport->delete(id: $id);

        return to_route(
            route: 'admin.user.manager.edit',
            parameters: [
                $id,
            ]
        );
    }

}
