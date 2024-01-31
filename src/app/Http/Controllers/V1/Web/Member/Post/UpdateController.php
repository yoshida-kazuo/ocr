<?php

namespace App\Http\Controllers\V1\Web\Member\Post;

use App\Http\Controllers\Controller;
use App\Http\Requests\V1\Web\Member\Post\UpdateRequest;
use App\Lib\Support\User\PostSupport;

class UpdateController extends Controller
{

    /**
     * Handle the incoming request.
     *
     * @param UpdateRequest $request
     * @param PostSupport $postSupport
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function __invoke(
        UpdateRequest $request,
        PostSupport $postSupport
    ): \Illuminate\Http\RedirectResponse {
        $postSupport->update(
            id: $request->post('id'),
            values: [
                'body'          => $request->post('body'),
                'topic_type'    => $request->post('topic_type'),
                'is_published'  => $request->post('is_published'),
            ]
        );

        return to_route(route: 'home');
    }

}
