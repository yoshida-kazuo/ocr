<?php

namespace App\Services\Ocr;

interface OcrInterface
{

    /**
     * model function
     *
     * @param string $model
     *
     * @return OcrInterface
     */
    public function model(string $model): OcrInterface;

    /**
     * credential function
     *
     * @param string $endpoint
     * @param string $key
     *
     * @return OcrInterface
     */
    public function credential(
        string $endpoint,
        string $key
    ): OcrInterface;

    /**
     * analyze function
     *
     * @param string $filepath
     * @param string $pages
     * @param string $locale
     * @param integer $dpi
     *
     * @return null|string
     */
    public function analyze(
        string $filepath,
        string $pages,
        string $locale = 'ja',
        int $dpi = 300
    ): null|string;

    /**
     * analyzeResult function
     *
     * @param string $url
     *
     * @return null|string
     */
    public function analyzeResult(
        string $url
    ): null|string;

}
