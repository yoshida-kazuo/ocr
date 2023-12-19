<?php

namespace App\Http\Controllers\V1\Web\User\Ocr\AnalyzeResult;

use App\Lib\Support\OcrResult\OcrResultSupport;
use App\Lib\Support\OcrResult\OcrPagesResultSupport;
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
    protected $perPage = 999;

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
     * @param OcrPagesResultSupport $ocrPagesResultSupport
     * @param string $documentId
     *
     * @return \Inertia\Response
     */
    public function __invoke(
        Request $request,
        OcrResultSupport $ocrResultSupport,
        OcrPagesResultSupport $ocrPagesResultSupport,
        string $documentId
    ): \Inertia\Response {
        $ocrResult = $ocrResultSupport->findDocumentById(
            documentId: $documentId,
            userId: user('id')
        );
        $ocrPagesResults = $ocrPagesResultSupport->catalog(
            conditions: [
                'user_id'       => user('id'),
                'document_id'   => $ocrResult->document_id,
                'order' => [
                    'page_number' => 'asc',
                ],
            ],
            perPage: $this->perPage,
            onEachSide: $this->onEachSide
        );

        return Inertia::render('User/Ocr/AnalyzeResult/Index', compact(
            'ocrResult',
            'ocrPagesResults'
        ));
    }

}
