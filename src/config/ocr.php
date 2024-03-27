<?php

return [
    'service'                   => env('OCR_SERVICE'),
    'workDir'                   => env('OCR_WORK_DIR'),
    'batchDir'                  => env('OCR_BATCH_DIR'),
    'utilDir'                   => env('OCR_UTIL_DIR'),
    'tmpDir'                    => env('OCR_TMP_DIR'),
    'storageDriver'             => env('OCR_STORAGE_DRIVER', 'local'),
    'prioritize_embedded_fonts' => env('OCR_PRIORITIZE_EMBEDDED_FONTS', 'yes'),

    'azure-v1' => [
        'key'       => env('OCR_AZURE_V1_KEY'),
        'endpoint'  => env('OCR_AZURE_V1_ENDPOINT'),
        'class'     => \App\Services\Ocr\Azure\V1\Ocr::class,
    ],

    'clova-v1' => [
        'key'       => env('OCR_CLOVA_V1_KEY'),
        'endpoint'  => env('OCR_CLOVA_V1_ENDPOINT'),
        'class'     => \App\Services\Ocr\Clova\V1\Ocr::class,
    ],

    'tesseract-v1' => [
        'key'       => env('OCR_TESSERACT_V1_KEY'),
        'endpoint'  => env('OCR_TESSERACT_V1_ENDPOINT'),
        'class'     => \App\Services\Ocr\Tesseract\V1\Ocr::class,
    ],

    'tesseract-v2' => [
        'key'       => env('OCR_TESSERACT_V1_KEY'),
        'endpoint'  => env('OCR_TESSERACT_V1_ENDPOINT'),
        'class'     => \App\Services\Ocr\Tesseract\V2\Ocr::class,
    ],

    'easyocr-v1' => [
        'key'       => env('OCR_EASYOCR_V1_KEY'),
        'endpoint'  => env('OCR_EASYOCR_V1_ENDPOINT'),
        'class'     => \App\Services\Ocr\EasyOCR\V1\Ocr::class,
    ],

    'paddleocr-v1' => [
        'key'       => env('OCR_PADDLEOCR_V1_KEY'),
        'endpoint'  => env('OCR_PADDLEOCR_V1_ENDPOINT'),
        'class'     => \App\Services\Ocr\PaddleOCR\V1\Ocr::class,
    ],
];
