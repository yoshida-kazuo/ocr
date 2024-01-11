<?php

namespace App\Http\Controllers\V1\Web\Root\Activity;

use App\Http\Controllers\Controller;
use App\Lib\Support\Activity\ActivitySupport;
use Illuminate\Http\Request;
use Inertia\Inertia;

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
     * @param ActivitySupport $activitySupport
     *
     * @return \Inertia\Response
     */
    public function __invoke(
        Request $request,
        ActivitySupport $activitySupport
    ): \Inertia\Response {
        $activities = $activitySupport->catalog(
            conditions: $request->all(),
            perPage: $this->perPage
        );

        return Inertia::render(
            'Root/Activity/Index', compact(
                'activities'
            )
        );
    }

}
