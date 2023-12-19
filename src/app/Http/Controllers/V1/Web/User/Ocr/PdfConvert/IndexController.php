<?php

namespace App\Http\Controllers\V1\Web\User\Ocr\PdfConvert;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class IndexController extends Controller
{

    /**
     * Handle the incoming request.
     * example image to pdf
     *
     * @param Request $request
     *
     * @return \Illuminate\Http\Response
     */
    public function __invoke(
        Request $request
    ): \Illuminate\Http\Response {
        $convertFile = uuid() . '.pdf';
        $ocrService = config('ocr.service');
        $ocrDisk = Storage::disk(config('ocr.storageDriver'));
        $ocrClass = config("ocr.{$ocrService}.class");
        $file = $request->file('file');

        $imageFilepath = $file->getPathname();
        $newImageFilepath = "{$imageFilepath}.{$file->getClientOriginalExtension()}";
        File::copy($imageFilepath, $newImageFilepath);
        $pdfFilepath = "{$imageFilepath}.pdf";
        $ocr = new $ocrClass;

        $ocr->image2pdf($newImageFilepath, $pdfFilepath);
        $blob = File::get($pdfFilepath);
        $appPdfFilepath = config('ocr.tmpDir') . "/{$convertFile}";
        $ocrDisk->put($appPdfFilepath, $blob);

        File::delete([
            $pdfFilepath,
            $imageFilepath,
            $newImageFilepath,
        ]);

        return response(
            content: [
                'url' => route('user.ocr.pdf-convert.get', [
                    $convertFile,
                ]),
            ],
            status: 200,
            headers: [
                'Content-Type' => 'application/json',
            ]
        );
    }

}
