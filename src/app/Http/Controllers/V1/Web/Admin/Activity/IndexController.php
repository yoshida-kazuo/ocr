<?php

namespace App\Http\Controllers\V1\Web\Admin\Activity;

use App\Models\Activity;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class IndexController extends Controller
{

    /**
     * Handle the incoming request.
     *
     * @param Request $request
     *
     * @return \Inertia\Response
     */
    public function __invoke(Request $request): \Inertia\Response
    {
        $activities = Activity::orderBy('id', 'desc')
            ->paginate(15)
            ->onEachSide(1);

        return Inertia::render(
            'Admin/Activity/Index', compact(
                'activities'
            )
        );
    }

}
