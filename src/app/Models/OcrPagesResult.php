<?php

namespace App\Models;

use App\Models\Trait\Timezone;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OcrPagesResult extends Model
{
    use HasFactory,
        Timezone;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'ocr_result_id',
        'page_number',
        'extracted_text',
    ];

    /**
     * user function
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function ocrResult(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(OcrResult::class);
    }

}
