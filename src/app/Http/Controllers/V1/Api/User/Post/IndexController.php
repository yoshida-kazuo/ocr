<?php

namespace App\Http\Controllers\V1\Api\User\Post;

use App\Http\Controllers\Controller;
use App\Lib\Support\User\PostSupport;
use App\Http\Resources\V1\Api\PostCollection;
use Illuminate\Http\Request;

class IndexController extends Controller
{

    /**
     * perPage variable
     *
     * @var integer
     */
    protected $perPage = 15;

    /**
     * onEachSide variable
     *
     * @var integer
     */
    protected $onEachSide = 1;

    /**
     * Handle the incoming request.
     *
     * @param Request $request
     * @param PostSupport $postSupport
     *
     * @return \App\Http\Resources\V1\Api\PostCollection
     */
    public function __invoke(
        Request $request,
        PostSupport $postSupport
    ): \App\Http\Resources\V1\Api\PostCollection {
        $posts = $postSupport->catalog(
            conditions: $request->all(),
            perPage: $this->perPage,
            onEachSide: $this->onEachSide
        );

        return new PostCollection($posts);
    }

}
