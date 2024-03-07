<?php

namespace App\Models;

use App\Models\Trait\Timezone;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OcrResult extends Model
{
    use HasFactory,
        Timezone;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'document_id',
        'service',
        'page_number',
    ];

    /**
     * user function
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * ocrPagesResult function
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function ocrPagesResult(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(OcrPagesResult::class);
    }

}
