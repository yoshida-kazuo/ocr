<?php

namespace App\Http\Controllers\V1\Api\User\Ocr\Analyze;

use App\Lib\Support\OcrResult\OcrResultSupport;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class IndexController extends Controller
{

    /**
     * Handle the incoming request.
     *
     * @param Request $request
     * @param OcrResultSupport $ocrResultSupport
     * @param string $documentId
     *
     * @return array
     */
    public function __invoke(
        Request $request,
        OcrResultSupport $ocrResultSupport,
        string $documentId
    ) {
        $status = 'running';

        $ocrPageResult = null;
        $ocrResult = $ocrResultSupport->findDocumentById(
            documentId: $documentId,
            userId: user('id')
        );
        if ($ocrResult->ocrPagesResults->count() > 0) {
            $ocrPageResult = $ocrResult->ocrPagesResults
                ->get(0);
            $status = 'ng';
            if ($ocrPageResult->extracted_text) {
                $status = 'ok';
            }
        }

        return [
            'status'    => $status,
            'content'   => $ocrPageResult,
        ];
    }

}
