<?php

namespace App\Lib\Support\OcrResult;

use App\Models\OcrResult;

class OcrResultSupport
{

    /**
     * model function
     *
     * @return OcrResult
     */
    public function model(): OcrResult
    {
        return app(OcrResult::class);
    }

    /**
     * findDocumentById function
     *
     * @param string $documentId
     *
     * @return OcrResult|null
     */
    public function findDocumentById(string $documentId): OcrResult|null
    {
        return OcrResult::where('document_id', $documentId)
            ->first();
    }

    /**
     * store function
     *
     * @param array $values
     *
     * @return OcrResult
     */
    public function store(array $values): OcrResult
    {
        $ocrResult = new OcrResult;

        foreach ($values as $column => $value) {
            $ocrResult->{$column} = $value;
        }

        $ocrResult->save();

        return $ocrResult;
    }

}
