<?php

namespace App\Http\Controllers\V1\Web\Root\User\Manager;

use App\Http\Controllers\Controller;
use App\Lib\Support\User\UserSupport;
use Illuminate\Http\Request;

class IndexController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(
        Request $request,
        UserSupport $userSupport
    ) {
    }
}
