<?php

namespace App\Http\Controllers\V1\Web\User\Ocr\Analyze;

use App\Lib\Support\OcrResult\OcrResultSupport;
use App\Http\Controllers\Controller;
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
     * @param OcrResultSupport $ocrResultSupport
     *
     * @return \Inertia\Response
     */
    public function __invoke(
        Request $request,
        OcrResultSupport $ocrResultSupport
    ): \Inertia\Response {
        $ocrResults = $ocrResultSupport->catalog(
            conditions: [
                'user_id'   => user('id'),
            ],
            perPage: $this->perPage,
            onEachSide: $this->onEachSide
        );

        return Inertia::render('User/Ocr/Analyze/Index', compact(
            'ocrResults'
        ));
    }

}
