<?php

namespace App\Http\Controllers\V1\Web\Guest\Env;

use App\Http\Controllers\Controller;
use App\Http\Requests\V1\Web\Guest\Env\LangRequest as Request;

class LangController extends Controller
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
            'data'      => config('locale'),
            'errors'    => null,
        ];
    }

}
