<?php

namespace App\Http\Controllers\V1\Web\Admin\User\Manager;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CreateController extends Controller
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
        //

        return Inertia::render('Admin/User/Manager/Create');
    }

}
