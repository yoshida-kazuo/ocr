<?php

namespace App\Http\Controllers\V1\Web\Guest;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TopController extends Controller
{

    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request): \Inertia\Response
    {
        //

        return Inertia::render('Guest/Top');
    }

}
