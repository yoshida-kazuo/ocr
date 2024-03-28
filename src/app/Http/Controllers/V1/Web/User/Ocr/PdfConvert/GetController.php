<?php

namespace App\Http\Controllers\V1\Web\User\Ocr\PdfConvert;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class GetController extends Controller
{

    /**
     * Handle the incoming request.
     *
     * @param Request $request
     * @param string $convertFile
     *
     * @return \Illuminate\Http\Response
     */
    public function __invoke(
        Request $request,
        string $convertFile
    ): \Illuminate\Http\Response {
        $pdfFilepath = config('ocr.tmpDir') . "/{$convertFile}";
        $disk = Storage::disk(config('ocr.storageDriver'));

        return response(
            content: $disk->get($pdfFilepath),
            status: 200,
            headers: [
                'Content-Type' => 'application/pdf',
            ]
        );
    }

}
