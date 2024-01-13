<?php

namespace App\Http\Controllers\V1\Web\Root\User\Manager;

use App\Http\Controllers\Controller;
use App\Lib\Support\User\UserSupport;
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
     * @param UserSupport $userSupport
     *
     * @return \Inertia\Response
     */
    public function __invoke(
        Request $request,
        UserSupport $userSupport
    ): \Inertia\Response {
        $users = $userSupport->catalog(
            conditions: $request->all(),
            perPage: $this->perPage,
            excludeUserIds: [user('id')],
            withTrashed: true
        );

        return Inertia::render('Root/User/Manager/Index', compact(
            'users'
        ));
    }

}
