<?php

namespace App\Http\Controllers\V1\Web\User\Ocr\AnalyzePageImage;

use App\Lib\Support\OcrResult\OcrResultSupport;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Cache;
use Imagick;

class IndexController extends Controller
{

    /**
     * cacheExpire
     *
     * @var int
     */
    protected int $cacheExpire = 86400;

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
        $imageBlob = null;
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
            $imageSize = strtolower('300x200');
            [$w, $h] = explode('x', $imageSize);
            $cacheName = "analyze-page-image-{$ocrResult->document_id}-{$ocrResult->ocrPagesResults->first()->page_number}-{$w}-{$h}";

            if (! $imageBlob = Cache::get($cacheName)) {
                $imagick = new Imagick;
                $imagick->readImageBlob($ocrDisk->get($pdfPath));
                $imagick->setIteratorIndex(0);
                $imagick->setImageFormat('jpg');
                $imagick->thumbnailImage($w, $h, true, true);
                $imageBlob = $imagick->getImageBlob();
                $imagick->clear();
                $imagick->destroy();

                Cache::put($cacheName, $imageBlob, $this->cacheExpire);
            }
        }

        return response(
            content: $imageBlob,
            status: 200,
            headers: [
                'Content-Type' => 'image/jpeg',
            ]
        );
    }

}
