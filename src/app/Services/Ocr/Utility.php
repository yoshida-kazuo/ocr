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

        $pdfinfo = collect(reset($pdfinfo));
        $orientation = strtoupper($pdfinfo->get('orientation'));
        $size = collect(
            data_get(self::PAPERSIZE, "DPI.{$dpi}.{$series}.{$orientation}")
        );
        $pathinfo = pathinfo($resizeFilepath);
        $toFilepath = "{$pathinfo['dirname']}/{$pathinfo['filename']}";
        $ratioHeight = (int) round(
            ($size->get('width') / $pdfinfo->get('width')) * $pdfinfo->get('height')
        );

        exec("pdftoppm -png -singlefile -scale-dimension-before-rotation -r {$dpi} -scale-to-x {$size->get('width')} -scale-to-y {$ratioHeight} -x 0 -y 0 {$filepath} {$toFilepath}", $convert, $resultCode);
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

    public function parsePdftotext(
        array $pdftotext,
        int $dpi = 300
    ) {
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

        return  [
            'analyzeResult' => [
                'pages' => [
                    [
                        'unit'  => 'pixel',
                        'lines' => [],
                        'words' => $words,
                    ],
                ],
            ],
        ];
    }

}
