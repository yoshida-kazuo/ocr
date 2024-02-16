<?php

namespace App\Http\Controllers\V1\Api\User\Ocr\Analyze;

use App\Jobs\ProcessOcr;
use App\Lib\Support\OcrResult\OcrResultSupport;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Imagick;
use Exception;

class StoreController extends Controller
{

    /**
     * Handle the incoming request.
     * 解析テスト
     *
     * @param Request $request
     *
     * @return array
     */
    public function __invoke(
        Request $request,
        ProcessOcr $processOcr,
        OcrResultSupport $ocrResultSupport
    ) {
        $status = 'ng';
        $ocrResult = null;
        $errors = null;

        try {
            $pdf = $request->post('pdf');
            $service = config('ocr.service');
            $ocrDisk = Storage::disk(config('ocr.storageDriver'));
            $documentId = uuid();
            $workDir = config('ocr.workDir') . "/{$documentId}";

            $canvas = base64_decode(
                explode(',', $request->post('canvas'))[1]
            );

            if (! $ocrDisk->exists($workDir)) {
                $ocrDisk->makeDirectory($workDir);
            }

            $buffFilepath = "{$workDir}/buff.png";
            $ocrDisk->put($buffFilepath, $canvas);
            unset($canvas);

            $filepath = "{$workDir}/ocr.pdf";
            $image = new Imagick($ocrDisk->path($buffFilepath));
            $image->setImageFormat('pdf');
            $image->writeImage($ocrDisk->path($filepath));
            $image->destroy();
            $ocrDisk->delete($buffFilepath);

            if ($ocrResult = $ocrResultSupport->store([
                'user_id'       => user('id'),
                'document_id'   => $documentId,
                'service'       => $service,
                'page_number'   => $request->post('pageNumber'),
            ])) {
                $processOcr::dispatch([
                    'filepath'      => $ocrDisk->path($filepath),
                    '--service'     => $service,
                    '--document-id' => $documentId,
                    '--user-id'     => user('id'),
                ]);
            }

            $status = 'ok';
        } catch(Exception $e) {
            activity()
                ->error($errors = __('A fatal error has occurred.'));
        }

        return [
            'status'    => $status,
            'content'   => $ocrResult,
            'errors'    => $errors,
        ];
    }

}
