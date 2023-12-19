<?php

namespace App\Http\Controllers\V1\Web\User\Ocr\AnalyzeResultReview;

use App\Lib\Support\OcrResult\OcrResultSupport;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class IndexController extends Controller
{

    /**
     * Handle the incoming request.
     *
     * @param Request $request
     * @param OcrResultSupport $ocrResultSupport
     * @param string $documentId
     * @param integer $pageNumber
     *
     * @return \Inertia\Response
     */
    public function __invoke(
        Request $request,
        OcrResultSupport $ocrResultSupport,
        string $documentId,
        int $pageNumber
    ): \Inertia\Response {
        $ocrResult = $ocrResultSupport->findDocumentById(
            documentId: $documentId,
            userId: user('id'),
            pagesResultPageNumber: $pageNumber
        );

        return Inertia::render('User/Ocr/AnalyzeResultReview/Index', compact(
            'ocrResult'
        ));
    }

}
