<?php

namespace App\Services\Ocr\Clova\V1;

use App\Services\Ocr\OcrInterface;
use Illuminate\Support\Facades\Http;
use Exception;

/**
 * Ocr class
 *
 * ...
 */
class Ocr implements OcrInterface
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
        $this->model = 'prebuilt-layout';
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

        // try {
        //     $response = Http::withHeaders([
        //             'Content-Type'              => 'application/json',
        //             'Ocp-Apim-Subscription-Key' => $this->key,
        //         ])
        //         ->withUrlParameters([
        //             'endpoint'  => $this->endpoint,
        //             'urn'       => 'formrecognizer/documentModels/',
        //             'model'     => "{$this->model}:analyze",
        //         ])
        //         ->withQueryParameters([
        //             'api-version'   => '2023-07-31',
        //             'page'          => $pages,
        //             'locale'        => $locale,
        //         ])
        //         ->withBody(
        //             file_get_contents($filepath), 'application/pdf'
        //         )
        //         ->post('{+endpoint}{+urn}{+model}');

        //     if ($response->successful()) {
        //         $analyze = $response->header('Operation-Location');
        //     } else {
        //         throw new Exception($response->body());
        //     }
        // } catch(Exception $e) {
        //     activity($e->getMessage(), 'error');
        // }

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
            // $response = Http::withHeaders([
            //         'Ocp-Apim-Subscription-Key' => $this->key,
            //     ])
            //     ->get($url);

            // switch($response->json('status')) {
            //     case 'running':
            //         sleep(5);
            //         $analyzeResult = $this->analyzeResult($url);
            //         break;
            //     case 'succeeded':
            //         $analyzeResult = $response->body();
            //         break;
            //     default:
            //         throw new Exception($response->body());
            // }
        } catch(Exception $e) {
            activity($e->getMessage(), 'error');
        }

        return $analyzeResult;
    }

}
