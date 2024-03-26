<?php

namespace App\Http\Controllers\V1\Web\User\Ocr\AnalyzeResultReview;

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
     * @param integer $pageNumber
     *
     * @return \Illuminate\Http\Response
     */
    public function __invoke(
        Request $request,
        OcrResultSupport $ocrResultSupport,
        string $documentId,
        int $pageNumber
    ): \Illuminate\Http\Response {
        $status = 'ng';
        $statusCode = 400;

        try {
            $ocrResult = $ocrResultSupport->findDocumentById(
                documentId: $documentId,
                userId: user('id'),
                pagesResultPageNumber: $pageNumber
            );
            $service = $ocrResult->service;
            if ($ocrResult->service === 'pdf-text') {
                $service = 'tesseract-v1';
            }
            $ocrClass = config("ocr.{$service}.class");

            $ocrPagesResult = data_get($ocrResult,'ocrPagesResults.0');
            $extractedText = json_decode($ocrPagesResult->extracted_text, true);
            data_set(
                $extractedText,
                'analyzeResult.pages.0.words',
                $request->post('extractedText')
            );

            $ocrPagesResult->extracted_text = json_encode($extractedText);
            $ocrPagesResult->full_text = (new $ocrClass)
                    ->extractWords($ocrPagesResult->extracted_text);
            $ocrPagesResult->save();

            $status = 'ok';
            $statusCode = 200;
        } catch (Exception $e) {
            //
        }

        return response([
                'status'    => $status,
                'content'   => $ocrResult,
                'errors'    => [],
            ],
            $statusCode);
    }

}
