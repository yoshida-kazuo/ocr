<?php

namespace App\Http\Controllers\V1\Web\Guest;

use App\Lib\Support\User\PostSupport;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
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
     * @return \Inertia\Response
     */
    public function __invoke(
        Request $request,
        PostSupport $postSupport
    ): \Inertia\Response {
        $posts = $postSupport->catalog(
            conditions: [
                //
            ],
            perPage: $this->perPage,
            isPublished: true,
            allPublisheUserId: user('id')
        );

        return Inertia::render(
            component: 'Guest/Home',
            props: compact(
                'posts'
            )
        );
    }

}
