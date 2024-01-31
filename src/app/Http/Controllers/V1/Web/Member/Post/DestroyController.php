<?php

namespace App\Http\Controllers\V1\Web\Member\Post;

use App\Http\Controllers\Controller;
use App\Http\Requests\V1\Web\Member\Post\DestroyRequest;
use App\Lib\Support\User\PostSupport;

class DestroyController extends Controller
{

    /**
     * Handle the incoming request.
     *
     * @param DestroyRequest $request
     * @param PostSupport $postSupport
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function __invoke(
        DestroyRequest $request,
        PostSupport $postSupport
    ): \Illuminate\Http\RedirectResponse {
        $postSupport->delete(
            id: $request->post('id')
        );

        return to_route(
            route: 'home'
        );
    }

}
