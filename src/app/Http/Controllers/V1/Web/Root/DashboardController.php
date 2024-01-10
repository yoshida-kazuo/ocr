<?php

namespace App\Http\Controllers\V1\Web\Root;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{

    /**
     * Handle the incoming request.
     *
     * @param Request $request
     *
     * @return Inertia\Response
     */
    public function __invoke(Request $request): \Inertia\Response
    {
        //

        return Inertia::render('Root/Dashboard');
    }

}
