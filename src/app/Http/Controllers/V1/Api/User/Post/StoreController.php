<?php

namespace App\Http\Controllers\V1\Api\User\Post;

use App\Lib\Support\User\PostSupport;
use App\Http\Controllers\Controller;
use App\Http\Requests\V1\Api\User\Post\StoreRequest;
use App\Http\Resources\PostResource;

class StoreController extends Controller
{

    /**
     * Handle the incoming request.
     *
     * @param StoreRequest $request
     * @param PostSupport $postSupport
     *
     * @return array
     */
    public function __invoke(
        StoreRequest $request,
        PostSupport $postSupport
    ) {
        $post = $postSupport->store([
            'user_id'   => user('id'),
            'body'      => $request->post('body'),
        ]);

        return new PostResource($post);
    }

}
