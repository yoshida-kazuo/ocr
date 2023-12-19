<?php

namespace App\Lib\Support\OcrResult;

use App\Models\OcrPagesResult;
use Illuminate\Contracts\Database\Eloquent\Builder;

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

    /**
     * catalog function
     *
     * @param array $conditions
     * @param integer $perPage
     * @param string $catalogName
     * @param integer $onEachSide
     *
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function catalog(
        array $conditions = [],
        int $perPage = 15,
        string $catalogName = 'ocr-pages-result-catalog',
        int $onEachSide = 1
    ): \Illuminate\Contracts\Pagination\LengthAwarePaginator {
        $conditions = collect($conditions);
        $ocrPagesResult = OcrPagesResult::withWhereHas(
            'ocrResult',
            function(Builder $query) use($conditions) {
                if ($conditions->get('document_id')) {
                    $query->where('document_id', $conditions->get('document_id'));
                }
            }
        );

        if ($conditions->get('user_id')) {
            $ocrPagesResult->where('user_id', $conditions->get('user_id'));
        }

        if ($conditions->get('ocr_result_id')) {
            $ocrPagesResult->where('ocr_result_id', $conditions->get('ocr_result_id'));
        }

        if (! $conditions->get('order')) {
            $conditions->put('order', [
                'id' => 'desc',
            ]);
        }

        foreach ($conditions->get('order') as $col => $order) {
            $ocrPagesResult->orderBy($col, $order);
        }

        return $ocrPagesResult->paginate(
                $perPage,
                ['*'],
                $catalogName
            )
            ->onEachSide($onEachSide);
    }

}
