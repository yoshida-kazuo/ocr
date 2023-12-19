<?php

namespace App\Services\Ocr;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Collection;
use Exception;

trait Utility
{

    /**
     * PAPERSIZE
     *
     * @var array
     */
    const PAPERSIZE = [
        'DPI' => [
            300 => [
                'A3' => [
                    'PORTRAIT' => [
                        'width'     => 3508,
                        'height'    => 4961,
                    ],
                    'LANDSCAPE' => [
                        'width'     => 4961,
                        'height'    => 3508,
                    ],
                ],
                'A4' => [
                    'PORTRAIT' => [
                        'width'     => 2480,
                        'height'    => 3508,
                    ],
                    'LANDSCAPE' => [
                        'width'     => 3508,
                        'height'    => 2480,
                    ],
                ],
            ],
        ],
    ];

    /**
     * pdfMimes
     *
     * @var array
     */
    protected array $pdfMimeTypees = [
        'application/pdf',
    ];

    /**
     * imageMimes
     *
     * @var array
     */
    protected array $imageMimeTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/bmp',
        'image/tiff',
        'image/svg+xml',
        'image/webp',
        'image/jp2',
        'image/x-portable-anymap',
        'image/x-portable-bitmap',
        'image/x-portable-graymap',
        'image/x-portable-pixmap',
        'image/pcx',
        'image/vnd.microsoft.icon',
    ];

    /**
     * pdfinfo function
     *
     * @param string $filepath
     *
     * @return array
     */
    public function pdfinfo(string $filepath): array
    {
        $exec = escapeshellcmd(
            Storage::disk('local')->path('bin/pdfinfo.sh') . " {$filepath}"
        );
        $output = [];
        $resultCode = 1;
        exec($exec, $output, $resultCode);
        if (0 !== $resultCode) {
            throw new Exception(__(':filepath : PDFINFO Error', [
                'filepath'  => $filepath,
            ]));
        }

        $pdfinfo = json_decode(implode('', $output), true);

        return $pdfinfo;
    }

    /**
     * pdf2image function
     *
     * @param string $filepath
     * @param string $resizeFilepath
     * @param string $series
     * @param integer $dpi
     *
     * @return string
     * @throws Exception
     */
    public function pdf2image(
        string $filepath,
        string $resizeFilepath,
        string $series = 'A4',
        int $dpi = 300
    ): Collection {
        $series = strtoupper($series);

        if (! $pdfinfo = $this->pdfinfo($filepath)) {
            throw new Exception(__(':filepath : :resizeFilepath : :series : :dpi : PDFINFO Get Failed.', [
                'filepath'          => $filepath,
                'resizeFilepath'    => $resizeFilepath,
                'series'            => $series,
                'dpi'               => $dpi,
            ]));
        }

        $pdfinfo = collect($pdfinfo);
        $orientation = strtoupper($pdfinfo->get('orientation'));
        $size = collect(
            data_get(self::PAPERSIZE, "DPI.{$dpi}.{$series}.{$orientation}")
        );
        $pathinfo = pathinfo($resizeFilepath);
        $toFilepath = "{$pathinfo['dirname']}/{$pathinfo['filename']}";
        $ratioHeight = (int) round(
            ($size->get('width') / $pdfinfo->get('width')) * $pdfinfo->get('height')
        );

        exec(escapeshellcmd("pdftoppm -png -singlefile -scale-dimension-before-rotation -r {$dpi} -scale-to-x {$size->get('width')} -scale-to-y {$ratioHeight} -x 0 -y 0 {$filepath} {$toFilepath}"), $convert, $resultCode);
        if ($resultCode !== 0) {
            throw new Exception(__(':filepath : :resizeFilepath : :series : :dpi : Convert Error.', [
                'filepath'          => $filepath,
                'resizeFilepath'    => $resizeFilepath,
                'series'            => $series,
                'dpi'               => $dpi,
            ]));
        }

        return $pdfinfo;
    }

    /**
     * image2pdf function
     *
     * @param string $imagepath
     * @param string $pdfpath
     *
     * @return boolean
     * @throws Exception
     */
    public function image2pdf(
        string $imagepath,
        string $pdffilepath
    ): bool {
        $cmd = [
            'convert',
            $imagepath,
            $pdffilepath,
        ];
        exec(escapeshellcmd(implode(' ', $cmd)), $convert, $resultCode);
        if ($resultCode !== 0) {
            throw new Exception(__(':imagepath : :pdffilepath : Convert command failed.', [
                'imagepath' => $imagepath,
                'pdffilepath'   => $pdffilepath,
            ]));
        }

        return true;
    }

    /**
     * pdf2text function
     *
     * @param string $pdffilepath
     *
     * @return array
     * @throws Exception
     */
    public function pdf2text(string $pdffilepath): array {
        $pythonResult = [];
        exec(escapeshellcmd("python /opt/data/src/main.py ocr extract_text_and_coordinates --pdf_filepath={$pdffilepath}"), $pythonResult, $resultCode);
        if ($resultCode !== 0) {
            throw new Exception(__(':pdffilepath : Failed to retrieve text and coordinates from the PDF.', [
                'pdffilepath' => $pdffilepath,
            ]));
        }

        return $pythonResult;
    }

    /**
     * lineDetect function
     *
     * @param string $imagefilepath
     *
     * @return array
     * @throws Exception
     */
    public function lineDetect(string $imagefilepath): array {
        $pythonResult = [];
        exec(escapeshellcmd("python /opt/data/src/main.py ocr line_detection --image_path={$imagefilepath}"), $pythonResult, $resultCode);
        if ($resultCode !== 0) {
            throw new Exception(__(':imagefilepath : Failed to line detection.', [
                'imagefilepath' => $imagefilepath,
            ]));
        }

        return $pythonResult;
    }

    /**
     * imageRotate function
     *
     * @param string $imagepath
     * @param integer $rotate
     *
     * @return bool
     * @throws Exception
     */
    public function imageRotate(
        string $imagepath,
        int $rotate
    ): bool {
        exec(escapeshellcmd("convert {$imagepath} -rotate {$rotate} {$imagepath}"), $convert, $resultCode);
        if ($resultCode !== 0) {
            throw new Exception(__(':file : Image flip failed.', [
                'file' => $imagepath,
            ]));
        }

        return true;
    }

    /**
     * pdfSplit function
     *
     * @param string $pdffilepath
     * @param string $outputpath
     *
     * @return boolean
     */
    public function pdfSplit(
        string $pdffilepath,
        string $outputpath,
    ): bool {
        exec(escapeshellcmd("pdftk {$pdffilepath} burst output {$outputpath}"), $pdftk, $resultCode);
        if ($resultCode !== 0) {
            throw new Exception(__(':pdffilepath : :outputpath : Failed to split PDF.', [
                'pdffilepath'   => $pdffilepath,
                'outputpath'    => $outputpath,
            ]));
        }

        return true;
    }

    /**
     * trapezoidalCorrection function
     *
     * @param string $imagefilepath
     * @param string $outputdir
     * @param string $filename
     *
     * @return boolean
     * @throws Exception
     */
    public function trapezoidalCorrection(
        string $imagefilepath,
        string $outputdir,
        string $filename,
        int $dpi = 300
    ): bool {
        exec(escapeshellcmd("python /opt/data/src/main.py ocr image_correction --file_path={$imagefilepath} --output_file={$filename} --output_dir={$outputdir} --dpi={$dpi}"), $pythonResult, $resultCode);
        if ($resultCode !== 0) {
            throw new Exception(__(':imagefilepath : :outputdir : :filename : Failed trapezoida correction.', [
                'imagefilepath' => $imagefilepath,
                'outputdir'     => $outputdir,
                'filename'      => $filename,
            ]));
        }

        return true;
    }

    /**
     * parsePdftotext function
     *
     * @param array $pdftotext
     * @param integer $dpi
     *
     * @return array
     */
    public function parsePdftotext(
        array $pdftotext,
        array $pdflines = [],
        int $dpi = 300
    ): array {
        $pdftotext = collect($pdftotext);
        $pt2pixel = fn(int $pt): int => round($pt / 72 * $dpi);
        $bbox2polygon = fn(array $bbox): array => [
            $pt2pixel($bbox[0]), $pt2pixel($bbox[1]),
            $pt2pixel($bbox[2]), $pt2pixel($bbox[1]),
            $pt2pixel($bbox[2]), $pt2pixel($bbox[3]),
            $pt2pixel($bbox[0]), $pt2pixel($bbox[3]),
        ];

        $words = [];
        foreach ($pdftotext->get('blocks') as $block) {
            foreach ($block['lines'] ?? [] as $line) {
                foreach ($line['spans'] ?? [] as $span) {
                    $span = (object) $span;
                    $words[] = [
                        'polygon'       => $bbox2polygon($span->bbox),
                        'content'       => $span->text,
                        'confidence'    => 99.999999,
                    ];
                }
            }
        }

        $lines = [];
        foreach ($pdflines as $area) {
            $x = (int) $area['x'];
            $y = (int) $area['y'];
            $w = (int) $area['width'];
            $h = (int) $area['height'];

            $lines[] = [
                'polygon' => [
                    $x, $y,
                    $x+$w, $y,
                    $x+$w, $y+$h,
                    $x, $y+$h,
                ],
            ];
        }

        return  [
            'analyzeResult' => [
                'pages' => [
                    [
                        'unit'  => 'pixel',
                        'lines' => $lines,
                        'words' => $words,
                    ],
                ],
            ],
        ];
    }

    /**
     * isPdf function
     *
     * @param string $mimeType
     *
     * @return boolean
     */
    public function isPdf(string $mimeType): bool {
        return array_search($mimeType, $this->pdfMimeTypees) !== false;
    }

    /**
     * isImage function
     *
     * @param string $mimeType
     *
     * @return boolean
     */
    public function isImage(string $mimeType): bool {
        return array_search($mimeType, $this->imageMimeTypes) !== false;
    }

}
