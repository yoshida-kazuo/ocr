<?php

namespace App\Lib\Support\OcrResult;

use App\Models\OcrResult;
use Illuminate\Contracts\Database\Eloquent\Builder;

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
     * @param integer $userId
     *
     * @return OcrResult|null
     */
    public function findDocumentById(
        string $documentId,
        int $userId,
        ?int $pagesResultPageNumber = null
    ): OcrResult|null {
        $ocrResult = OcrResult::where('document_id', $documentId)
            ->where('user_id', $userId);

        if (is_numeric($pagesResultPageNumber)) {
            $ocrResult->with([
                'ocrPagesResults' => function(Builder $query) use($pagesResultPageNumber) {
                    $query->where('page_number', $pagesResultPageNumber);
                }
            ]);
        }

        return $ocrResult->first();
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
        string $catalogName = 'ocr-result-catalog',
        int $onEachSide = 1
    ): \Illuminate\Contracts\Pagination\LengthAwarePaginator {
        $conditions = collect($conditions);
        $ocrResult = OcrResult::withCount([
                'ocrPagesResults',
            ])
            ->with([
                'watchedFolder',
            ]);

        if ($conditions->get('user_id')) {
            $ocrResult->where('user_id', $conditions->get('user_id'));
        }

        if (! $conditions->get('order')) {
            $conditions->put('order', [
                'id' => 'desc',
            ]);
        }

        foreach ($conditions->get('order') as $col => $order) {
            $ocrResult->orderBy($col, $order);
        }

        return $ocrResult->paginate(
                $perPage,
                ['*'],
                $catalogName
            )
            ->onEachSide($onEachSide);
    }

}
