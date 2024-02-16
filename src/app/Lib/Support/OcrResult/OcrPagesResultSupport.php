<?php

namespace App\Lib\Support\OcrResult;

use App\Models\OcrPagesResult;

class OcrPagesResultSupport
{

    /**
     * model function
     *
     * @return OcrPagesResult
     */
    public function model(): OcrPagesResult
    {
        return app(OcrPagesResult::class);
    }

    /**
     * store function
     *
     * @param array $values
     *
     * @return OcrPagesResult
     */
    public function store(array $values): OcrPagesResult
    {
        $ocrPageResult = new OcrPagesResult;

        foreach ($values as $column => $value) {
            $ocrPageResult->{$column} = $value;
        }

        $ocrPageResult->save();

        return $ocrPageResult;
    }

}
