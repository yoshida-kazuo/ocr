<?php

namespace App\Http\Controllers\V1\Web\Member\Post;

use App\Lib\Support\User\PostSupport;
use App\Http\Controllers\Controller;
use App\Http\Requests\V1\Web\Member\Post\StoreRequest;

class StoreController extends Controller
{

    /**
     * Handle the incoming request.
     *
     * @param Request $request
     * @param PostSupport $postSupport
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function __invoke(
        StoreRequest $request,
        PostSupport $postSupport
    ): \Illuminate\Http\RedirectResponse {
        $postSupport->store([
            'user_id'       => user('id'),
            'body'          => $request->post('body'),
            'topic_type'    => $request->post('topic_type'),
            'is_published'  => $request->post('is_published'),
        ]);

        return to_route(route: 'home');
    }

}
