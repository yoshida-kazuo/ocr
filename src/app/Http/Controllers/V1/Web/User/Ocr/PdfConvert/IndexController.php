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
    public function __invoke(Request $request): \Illuminate\Http\Response
    {
        $pdfFilename = uuid() . '.pdf';
        $ocrService = config('ocr.service');
        $ocrClass = config("ocr.{$ocrService}.class");
        $file = $request->file('file');

        $imageFilepath = $file->getPathname();
        $newImageFilepath = "{$imageFilepath}.{$file->getClientOriginalExtension()}";
        rename($imageFilepath, $newImageFilepath);
        $pdfFilepath = "{$imageFilepath}.pdf";
        $ocr = new $ocrClass;
        $basename = basename($newImageFilepath);
        $workDir = dirname($newImageFilepath);
        $ocr->trapezoidalCorrection(
            $newImageFilepath,
            $workDir,
            $basename
        );
        $ocr->image2pdf($newImageFilepath, $pdfFilepath);
        $blob = File::get($pdfFilepath);

        Storage::delete([
            $imageFilepath,
            $pdfFilepath,
            $newImageFilepath,
        ]);

        return response(
            content: $blob,
            status: 200,
            headers: [
                'Content-Type'          => 'application/pdf',
                'Content-Disposition'   => "attachment; filename=\"{$pdfFilename}\"",
            ]
        );
    }

}
