<?php

namespace App\Http\Controllers\V1\Web\Guest\Env;

use Illuminate\Support\Facades\Cookie;
use App\Http\Controllers\Controller;
use App\Http\Requests\V1\Web\Guest\Env\TimezoneUpdateRequest as Request;

class TimezoneUpdateController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(
        Request $request,
        string $timezone
    ): array {
        Cookie::queue('timezone', $timezone);

        return [
            'result'    => 'ok',
            'data'      => null,
            'errors'    => null,
        ];
    }
}
