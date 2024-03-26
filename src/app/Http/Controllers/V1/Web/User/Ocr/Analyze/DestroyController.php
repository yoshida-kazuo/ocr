<?php

namespace App\Http\Controllers\V1\Web\User\Ocr\Analyze;

use App\Lib\Support\OcrResult\OcrResultSupport;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Exception;
use Throwable;

class DestroyController extends Controller
{

    /**
     * Handle the incoming request.
     */
    public function __invoke(
        Request $request,
        OcrResultSupport $ocrResultSupport
    ) {
        $statusCode = 400;

        try {
            foreach ($request->post('documentIds') as $documentId) {
                DB::beginTransaction();

                try {
                    $ocrResult = $ocrResultSupport->findDocumentById(
                        documentId: $documentId,
                        userId: user('id')
                    );
                    $workDir = config('ocr.workDir');
                    $disk = Storage::disk(config('ocr.storageDriver'));
                    $targetDir = "{$workDir}/{$ocrResult->document_id}";

                    if ($ocrResult->delete()) {
                        $disk->deleteDirectory($targetDir);
                    }

                    DB::commit();
                    activity()
                        ->info(__(':targetDir : Deleted the target file.', [
                            'targetDir' => $targetDir,
                        ]));
                } catch (Exception $e) {
                    DB::rollBack();
                    activity()
                        ->error(__(':documentId : Failed to delete.', [
                            'documentId' => $documentId,
                        ]));
                    activity()
                        ->dev(__(':documentId : :error', [
                            'documentId'    => $documentId,
                            'error'         => $e->getMessage(),
                        ]));

                    throw $e;
                }
            }

            $statusCode = 203;
        } catch (Exception $e) {
            activity()
                ->error(__('Deletion stopped due to a fatal error. Some files may have been deleted. : :error', [
                    'error' => $e->getMessage(),
                ]));
        }

        return response(
            status: $statusCode
        );
    }

}
