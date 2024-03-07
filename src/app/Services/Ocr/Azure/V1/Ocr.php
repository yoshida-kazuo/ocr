<?php

namespace App\Services\Ocr\Azure\V1;

use App\Services\Ocr\Azure\V1\JsonParser;
use App\Services\Ocr\Utility;
use App\Services\Ocr\OcrInterface;
use Illuminate\Support\Facades\Http;
use Exception;

/**
 * Ocr class
 *
 * Form Recognizer 2023-07-31
 * Model ID                         Description
 * ---------------------------------------------------------------------------------------------------------------------------------
 * prebuilt-read                    Extract text from documents.
 * prebuilt-layout                  Extract text and layout information from documents.
 * prebuilt-document                Extract text, layout, entities, and general key-value pairs from documents.
 * prebuilt-businessCard            Extract key information from business cards.
 * prebuilt-idDocument              Extract key information from passports and ID cards.
 * prebuilt-invoice                 Extract key information from invoices.
 * prebuilt-receipt                 Extract key information from receipts.
 * prebuilt-healthInsuranceCard.us  Extract key information from US health insurance cards.
 * prebuilt-tax.us.w2               Extract key information from IRS US W2 tax forms (year 2018-current).
 * prebuilt-tax.us.1098             Extract key information from United States Internal Revenue Service Form 1098 (2021-current).
 * prebuilt-tax.us.1098E            Extract key information from United States Internal Revenue Service Form 1098-E (2021-current).
 * prebuilt-tax.us.1098T            Extract key information from United States Internal Revenue Service Form 1098-T (2021-current).
 * prebuilt-contract                Extract key information from legal contracts.
 */
readonly class Ocr implements OcrInterface
{
    use JsonParser,
        Utility;

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

        try {
            $response = Http::withHeaders([
                    'Content-Type'              => 'application/json',
                    'Ocp-Apim-Subscription-Key' => $this->key,
                ])
                ->withUrlParameters([
                    'endpoint'  => $this->endpoint,
                    'urn'       => 'formrecognizer/documentModels/',
                    'model'     => "{$this->model}:analyze",
                ])
                ->withQueryParameters([
                    'api-version'   => '2023-07-31',
                    'page'          => $pages,
                    'locale'        => $locale,
                ])
                ->withBody(
                    file_get_contents($filepath), 'application/pdf'
                )
                ->post('{+endpoint}{+urn}{+model}');

            if ($response->successful()) {
                $analyze = $response->header('Operation-Location');
            } else {
                throw new Exception($response->body());
            }
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
            $response = Http::withHeaders([
                    'Ocp-Apim-Subscription-Key' => $this->key,
                ])
                ->get($url);

            switch($response->json('status')) {
                case 'running':
                    sleep(5);
                    $analyzeResult = $this->analyzeResult($url);
                    break;
                case 'succeeded':
                    $analyzeResult = $response->body();
                    break;
                default:
                    throw new Exception($response->body());
            }
        } catch(Exception $e) {
            activity($e->getMessage(), 'error');
        }

        return $analyzeResult;
    }

}
