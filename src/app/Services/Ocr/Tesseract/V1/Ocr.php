<?php

namespace App\Services\Ocr\Tesseract\V1;

use App\Services\Ocr\OcrInterface;
use Illuminate\Support\Facades\Storage;
use Exception;

/**
 * Ocr class
 *
 * ...
 */
class Ocr
{

    /**
     * endpoint
     *
     * @var string
     */
    protected string $endpoint;

    /**
     * key
     *
     * @var string
     */
    protected string $key;

    /**
     * model
     *
     * @var string
     */
    protected string $model;

    /**
     * Constructor
     *
     * @return void
     */
    public function __construct()
    {
        $this->model = 'jpn_seishin';
    }

    /**
     * model function
     *
     * @param string $model
     *
     * @return Ocr
     */
    public function model(string $model): Ocr
    {
        $this->model = $model;

        return $this;
    }

    /**
     * credential function
     *
     * @param string $endpoint
     * @param string $key
     *
     * @return Ocr
     */
    public function credential(
        string $endpoint,
        string $key
    ): Ocr {
        $this->endpoint = $endpoint;
        $this->key = $key;

        return $this;
    }

    /**
     * analyze function
     *
     * @param string $filepath
     * @param string $outputFilepath
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
    ): null|string {
        $analyze = null;

        try {
            $baseDirectory = dirname($filepath);
            $imageFilepath = "{$baseDirectory}/pdf";
            exec("pdfimages -png {$filepath} {$imageFilepath}", $pdfimage, $resultCode);

            if ($resultCode !== 0) {
                throw new Exception(__(':filepath : Failed to extract images from PDF.', [
                    'filepath'  => $filepath,
                ]));
            }

            $files = glob($imageFilepath . '-*.png');
            $file = reset($files);
            unset($files,
                $imageFilepath,
                $pdfimage,
                $resultCode);

            exec("python /opt/data/src/main.py ocr ocr --file_path={$file} --lang=\"jpn_custom+jpn\"", $pythonResult, $resultCode);

            if ($resultCode !== 0) {
                throw new Exception(__(':filepath : :file : OCR failed.', [
                    'filepath'  => $filepath,
                    'file'      => $file,
                ]));
            }

            $jsonText = reset($pythonResult);
            unset($file,
                $pythonResult,
                $resultCode);

            $jsonFile = 'tesseract.json';

            Storage::build([
                    'driver'    => 'local',
                    'root'      => $baseDirectory,
                ])
                ->put(
                    $jsonFile,
                    $jsonText
                );

            $analyze = "{$baseDirectory}/{$jsonFile}";
        } catch(Exception $e) {
            activity($e->getMessage(), 'error');
        }

        return $analyze;
    }

    /**
     * analyzeResult function
     *
     * @param string $url
     *
     * @return null|string
     */
    public function analyzeResult(
        string $url
    ): null|string {
        $analyzeResult = null;

        try {
            $analyzeResult = file_get_contents($url);
        } catch(Exception $e) {
            activity($e->getMessage(), 'error');
        }

        return $analyzeResult;
    }

}
