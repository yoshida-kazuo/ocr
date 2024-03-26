<?php

namespace App\Http\Controllers\V1\Web\User\Ocr\AnalyzeResult;

use App\Lib\Support\OcrResult\OcrResultSupport;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Exception;

class UpdateController extends Controller
{

    /**
     * Handle the incoming request.
     *
     * @param Request $request
     * @param OcrResultSupport $ocrResultSupport
     * @param string $documentId
     *
     * @return void
     */
    public function __invoke(
        Request $request,
        OcrResultSupport $ocrResultSupport,
        string $documentId
    ) {
        $statusCode = 400;

        try {
            $ocrResult = $ocrResultSupport->findDocumentById(
                documentId: $documentId,
                userId: user('id')
            );
            $ocrResult->document_name = $request->post('document_name');
            $ocrResult->save();

            $statusCode = 203;
        } catch (Exception $e) {
            //
        }

        return response(
            status: $statusCode
        );
    }

}
