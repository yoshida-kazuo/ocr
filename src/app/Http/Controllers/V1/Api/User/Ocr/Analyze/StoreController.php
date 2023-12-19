<?php

namespace App\Http\Controllers\V1\Api\User\Ocr\Analyze;

use App\Jobs\ProcessOcr;
use App\Lib\Support\OcrResult\OcrResultSupport;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Exception;

class StoreController extends Controller
{

    /**
     * Handle the incoming request.
     * 解析テスト
     *
     * @param Request $request
     * @param ProcessOcr $processOcr
     * @param OcrResultSupport $ocrResultSupport
     *
     * @return array
     */
    public function __invoke(
        Request $request,
        ProcessOcr $processOcr,
        OcrResultSupport $ocrResultSupport
    ): array {
        $status = 'ng';
        $ocrResult = null;
        $errors = null;

        try {
            $pdf = $request->post('pdf');
            $pageNumber = $request->post('pageNumber');
            $service = $request->post('engine');
            $storage = config('ocr.storageDriver');
            $ocrDisk = Storage::disk($storage);

            $documentId = uuid();
            $workDir = config('ocr.workDir') . "/{$documentId}";

            $pdfData = base64_decode(
                explode(',', $pdf)[1]
            );
            unset($pdf);

            if (! $ocrDisk->exists($workDir)) {
                $ocrDisk->makeDirectory($workDir);
            }

            $pdfFilepath = "{$workDir}/ocr.pdf";
            $ocrDisk->put($pdfFilepath, $pdfData);

            if ($ocrResult = $ocrResultSupport->store([
                'user_id'       => user('id'),
                'document_id'   => $documentId,
                'service'       => $service,
                'storage'       => $storage,
                'page_number'   => $pageNumber,
            ])) {
                $processOcr::dispatch([
                        'filepath'      => $pdfFilepath,
                        '--service'     => $service,
                        '--document-id' => $documentId,
                        '--user-id'     => user('id'),
                        '--pages'       => $pageNumber,
                        '--storage'     => $storage,
                    ])
                    ->onQueue('ocr');
            }

            $status = 'ok';
        } catch(Exception $e) {
            activity()
                ->error($errors = __('A fatal error has occurred.'));
            logger()
                ->error(__(':activity : :trace', [
                    'activity'  => $errors,
                    'trace'     => print_r($e->getTrace(), true),
                ]));
        }

        return [
            'status'    => $status,
            'content'   => $ocrResult,
            'errors'    => $errors,
        ];
    }

}
