<?php

namespace App\Http\Controllers\V1\Web\Guest\Env;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class TimezoneController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param Request $request
     *
     * @return array
     */
    public function __invoke(Request $request): array
    {
        return [
            'result'    => 'ok',
            'data'      => config('timezone'),
            'errors'    => null,
        ];
    }
}
