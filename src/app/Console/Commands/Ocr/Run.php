<?php

namespace App\Console\Commands\Ocr;

use App\Lib\Support\OcrResult\OcrPagesResultSupport;
use App\Lib\Support\OcrResult\OcrResultSupport;
use App\Console\Command;
use Illuminate\Support\Facades\Storage;
use Exception;

class Run extends Command
{

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'ocr:run {filepath : 解析対象ファイル}
        {--service=tesseract-v1 : config/ocrのキー}
        {--storage=local : ファイルストレージ設定}
        {--pages=1 : 対象ページ [List of 1-based page numbers to analyze. Ex. "1-3,5,7-9"]}
        {--dpi=300 : 解析解像度 }
        {--image-correction : 画像補正を行う}
        {--document-id= : ドキュメント識別ID }
        {--user-id= : 登録者ID }
    ';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'OCRページ解析';

    /**
     * Execute the console command.
     *
     * @param OcrResultSupport $ocrResultSupport
     * @param OcrPagesResultSupport $ocrPagesResultSupport
     *
     * @return integer
     */
    public function handle(
        OcrResultSupport $ocrResultSupport,
        OcrPagesResultSupport $ocrPagesResultSupport
    ): int {
        $this->memoryLimit(-1);

        $result = 0;
        $handleId = uuid();
        $prioritizeEmbeddedFonts = config('ocr.prioritize_embedded_fonts');

        $this->info(__(':handleId : We have initiated OCR.', [
            'handleId' => $handleId,
        ]));

        try {
            $ocrDisk = Storage::disk($this->option('storage'));
            $localDisk = Storage::disk('local');

            if (! $userId = $this->option('user-id')) {
                $userId = user('id');
            }

            if (! $documentId = $this->option('document-id')) {
                $documentId = $handleId;
            }
            $this->info(__(':handleId : :documentId : :filepath : Initial information', [
                'handleId'      => $handleId,
                'documentId'    => $documentId,
                'filepath'      => $this->argument('filepath'),
            ]));

            $ocrFilepath = $this->argument('filepath');

            $fileExt = pathinfo($ocrFilepath, PATHINFO_EXTENSION);
            $workDir = config('ocr.workDir') . "/{$documentId}";
            $filepath = "{$workDir}/tmp.{$fileExt}";
            if (! $localDisk->exists($workDir)) {
                if (! $localDisk->makeDirectory($workDir)) {
                    throw new Exception(__("{$workDir} : Failed to create directory."));
                }
            }

            $result = $localDisk->put(
                $filepath,
                $ocrDisk->get($ocrFilepath)
            );
            $filepath = $localDisk->path($filepath);

            if (! $pages = $this->option('pages')) {
                throw new Exception(__(":handleId : Page is not specified.", [
                    'handleId' => $handleId,
                ]));
            } else {
                $pages = str_replace([' ', '　'], '', $pages);
            }

            if (! $dpi = $this->option('dpi')) {
                throw new Exception(__(':handleId : The DPI setting is mandatory.', [
                    'handleId' => $handleId,
                ]));
            }

            $this->info(__(':handleId : The PDF file for analysis is :filepath, and the target page is :pages.', [
                'handleId'  => $handleId,
                'filepath'  => $filepath,
                'pages'     => $pages,
            ]));

            if (! $ocrService = $this->option('service')) {
                $ocrService = config('ocr.service');
            }

            $this->info(__(':handleId : :ocrService : OCR Service', [
                'handleId'      => $handleId,
                'ocrService'    => $ocrService,
            ]));

            if (! config("ocr.{$ocrService}")) {
                throw new Exception(__(':handleId : :ocrService : OCR service does not exist.', [
                    'handleId'      => $handleId,
                    'ocrService'    => $ocrService,
                ]));
            }

            $ocrClass = config("ocr.{$ocrService}.class");
            $ocr = (new $ocrClass)
                ->credential(
                    endpoint: config("ocr.{$ocrService}.endpoint"),
                    key: config("ocr.{$ocrService}.key")
                );

            // PDF splitting
            $analyzeFilepath = $localDisk->path("{$workDir}/%d.pdf");
            $ocr->pdfSplit($filepath, $analyzeFilepath);

            $extractPages = $this->parsePages($pages);
            $analyzeFiles = glob(
                $localDisk->path("{$workDir}/*.pdf")
            );

            foreach ($analyzeFiles as $key => $analyzeFile) {
                $file = pathinfo(
                    basename($analyzeFile),
                    PATHINFO_FILENAME
                );

                if (! in_array($file, $extractPages)) {
                    unlink($analyzeFile);
                    unset($analyzeFiles[$key]);
                }
            }

            $analyzeFiles = array_values($analyzeFiles);
            unset($execPages,
                $analyzeFilepath,
                $analyzeFile,
                $file);

            if (empty($analyzeFiles)) {
                throw new Exception(__(':handleId : :pages : pdftk failed.', [
                    'handleId'  => $handleId,
                    'pages'     => $pages,
                ]));
            }

            if (! $ocrResult = $ocrResultSupport->model()->updateOrCreate([
                'document_id'       => $documentId,
            ], [
                'user_id'           => $userId,
                'service'           => $ocrService,
                'page_number'       => $pages,
            ])) {
                throw new Exception(__(':handleId : :documentId : Failed to retrieve data from ocr_results.', [
                    'handleId'      => $handleId,
                    'documentId'    => $documentId,
                ]));
            }

            // Process PDF page by page
            foreach ($analyzeFiles as $analyzeFile) {
                // Text and coordinate data extracted from the PDF.
                $analyzeResult = null;

                // Get page number
                $pageNumber = (int) pathinfo(
                    basename($analyzeFile),
                    PATHINFO_FILENAME
                );

                // Check if the target page contains embedded text
                $pdftotext = [];
                exec(escapeshellcmd("pdftotext '{$analyzeFile}' -"), $pdftotext, $resultCode);
                if ($resultCode !== 0) {
                    throw new Exception(__(':handleId : :analyzeFile : Failed to extract text from PDF.', [
                        'handleId'      => $handleId,
                        'analyzeFile'   => $analyzeFile,
                    ]));
                }

                // If the page contains only images
                if (is_array($pdftotext)
                    && array_filter($pdftotext) === []
                ) {
                    $this->info(__(':handleId : :analyzeFile : Image adjustment executed.', [
                        'handleId'      => $handleId,
                        'analyzeFile'   => $analyzeFile,
                    ]));

                    // Convert the target page to an image
                    $imageAnalyzeFile = dirname($analyzeFile) . "/analyze.png";
                    $pdfinfo = $ocr->pdf2image($analyzeFile, $imageAnalyzeFile);

                    if ($resultCode !== 0) {
                        throw new Exception(__(':handleId : :analyzeFile : Failed to convert PDF to image.', [
                            'handleId'      => $handleId,
                            'analyzeFile'   => $analyzeFile,
                        ]));
                    }

                    // Check if the extracted page image needs to be inverted
                    if (($pdfinfo->get('width') > $pdfinfo->get('height') && $pdfinfo->get('orientation') === 'portrait')
                        || ($pdfinfo->get('height') > $pdfinfo->get('width') && $pdfinfo->get('orientation') === 'landscape')
                    ) {
                        $ocr->imageRotate($imageAnalyzeFile, -90);
                    }
                    unset($resultCode,
                        $files);

                    // Resize to 300dpi and perform trapezoid correction and rotation correction.
                    if ($this->option('image-correction')) {
                        $basename = basename($imageAnalyzeFile);
                        $ocr->trapezoidalCorrection(
                            $imageAnalyzeFile,
                            $localDisk->path($workDir),
                            $basename
                        );
                    }

                    // Create a PDF from a single image
                    $ocr->image2pdf($imageAnalyzeFile, $analyzeFile);

                    unlink($imageAnalyzeFile);
                    unset($convert,
                        $imageAnalyzeFile);
                } else
                if ($prioritizeEmbeddedFonts === 'yes') {
                    $this->info(__(':handleId : :analyzeFile : Extracting embedded text and coordinates.', [
                        'handleId'      => $handleId,
                        'analyzeFile'   => $analyzeFile,
                    ]));

                    $textdata = $ocr->pdf2text($analyzeFile);
                    $pdftotext = json_decode(
                        implode('', $textdata),
                        true
                    ) ?: [];
                    unset($textdata);

                    $imageAnalyzeFile = dirname($analyzeFile) . "/analyze.png";
                    $pdfinfo = $ocr->pdf2image($analyzeFile, $imageAnalyzeFile);
                    $linedata = $ocr->lineDetect($imageAnalyzeFile);
                    $lines = json_decode(
                        implode('', $linedata),
                        true
                    ) ?: [];
                    unset($linedata);

                    if (method_exists($ocr, 'parsePdftotext')) {
                        $pdftotext = $ocr->parsePdftotext(
                            pdftotext: $pdftotext,
                            pdflines: $lines,
                            dpi: $dpi
                        );
                    }

                    $analyzeResult = json_encode($pdftotext);

                    $ocrResult->service = 'pdf-text';
                    $ocrResult->save();
                }

                if (! isset($analyzeResult)) {
                    // Perform OCR
                    if (! $operationLocation = $ocr->analyze(
                        filepath: $analyzeFile,
                        pages: '1'
                    )) {
                        throw new Exception(__(':handleId : Failed to send data.', [
                            'handleId'  => $handleId,
                        ]));
                    } else {
                        // Retrieve analysis results
                        $analyzeResult = $ocr->analyzeResult($operationLocation);
                    }
                }

                if (! $ocrDisk->put(
                    dirname($ocrFilepath) . '/' . basename($analyzeFile),
                    $localDisk->get($workDir . '/' . basename($analyzeFile))
                )) {
                    throw new Exception(__(':handleId : :workDir : Failed to generate PDF file.', [
                        'handleId'  => $handleId,
                        'workDir'   => $workDir,
                    ]));
                }

                $fullText = null;
                if (method_exists($ocr, 'extractWords')) {
                    $fullText = $ocr->extractWords($analyzeResult);
                }

                if (! $ocrPagesResultSupport->store([
                    'ocr_result_id'     => $ocrResult->id,
                    'user_id'           => $ocrResult->user_id,
                    'page_number'       => $pageNumber,
                    'extracted_text'    => $analyzeResult,
                    'full_text'         => $fullText,
                ])) {
                    throw new Exception(__(':handleId : :ocrResultId : :pageNumber : :analyzeResult : Failed to register in the database.', [
                        'handleId'      => $handleId,
                        'ocrResultId'   => $ocrResult->id,
                        'pageNumber'    => $pageNumber,
                        'analyzeResult' => $analyzeResult,
                    ]));
                }

                unset($operationLocation,
                    $analyzeResult,
                    $pdftotext);
            }
        } catch(Exception $e) {
            $this->error(__(':file : :message : :line : :code', [
                'message'   => $e->getMessage(),
                'line'      => $e->getLine(),
                'code'      => $e->getCode(),
                'file'      => $e->getFile(),
            ]));

            $result = 1;
        }

        $this->info(__(':handleId : The OCR command has terminated successfully.', [
            'handleId' => $handleId,
        ]));

        return $result;
    }

    /**
     * Parse the given page ranges into an array of page numbers.
     *
     * @param string $pages
     *
     * @return array
     */
    protected function parsePages(string $pages): array
    {
        $parsePages = [];

        $ranges = explode(',', $pages);
        foreach ($ranges as $range) {
            $rangeParts = explode('-', $range);
            if (count($rangeParts) === 1) {
                $parsePages[] = (int) $rangeParts[0];
            } else
            if (count($rangeParts) === 2) {
                for ($i = (int) $rangeParts[0]; $i <= (int) $rangeParts[1]; $i++) {
                    $parsePages[] = $i;
                }
            }
        }

        return $parsePages;
    }

}
