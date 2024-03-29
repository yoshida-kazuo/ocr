<?php

namespace App\Http\Controllers\V1\Web\User\Ocr\AnalyzePagePdf;

use App\Lib\Support\OcrResult\OcrResultSupport;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

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
     * @return \Illuminate\Http\Response
     */
    public function __invoke(
        Request $request,
        OcrResultSupport $ocrResultSupport,
        string $documentId,
        int $pageNumber
    ): \Illuminate\Http\Response {
        $pdfBlob = null;
        $ocrResult = $ocrResultSupport->findDocumentById(
            documentId: $documentId,
            userId: user('id'),
            pagesResultPageNumber: $pageNumber
        );

        $dir = config('ocr.workDir');
        if ($ocrResult->watched_folder_id) {
            $dir = config('ocr.batchDir');
        }

        $ocrDisk = Storage::disk($ocrResult->storage);
        $pdfPath = "{$dir}/{$ocrResult->document_id}/{$ocrResult?->ocrPagesResults?->first()?->page_number}.pdf";

        if ($ocrResult?->ocrPagesResults
            && $ocrDisk->exists($pdfPath)
        ) {
            $pdfBlob = $ocrDisk->get($pdfPath);
        }

        return response(
            content: $pdfBlob,
            status: 200,
            headers: [
                'Content-Type'          => 'application/pdf',
                'Content-Disposition'   => "attachment; filename=\"{$documentId}-{$pageNumber}.pdf\"",
            ]
        );
    }

}
