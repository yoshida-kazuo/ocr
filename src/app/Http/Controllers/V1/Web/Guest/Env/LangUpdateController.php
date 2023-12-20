<?php

namespace App\Http\Controllers\V1\Web\Guest\Env;

use Illuminate\Support\Facades\Cookie;
use App\Http\Controllers\Controller;
use App\Http\Requests\V1\Web\Guest\Env\LangUpdateRequest as Request;

class LangUpdateController extends Controller
{

    /**
     * Handle the incoming request.
     *
     * @param Request $request
     * @param string $lang
     *
     * @return array
     */
    public function __invoke(
        Request $request,
        string $lang
    ): array {
        Cookie::queue('lang', $lang);

        return [
            'result'    => 'ok',
            'data'      => null,
            'errors'    => null,
        ];
    }

}
