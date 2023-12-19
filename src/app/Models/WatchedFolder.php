<?php

namespace App\Models;

use App\Models\Trait\Timezone;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WatchedFolder extends Model
{
    use HasFactory,
        Timezone,
        SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'storage',
        'folder_path',
        'is_active',
    ];

    /**
     * ocrResults function
     *
     * @return HasMany
     */
    public function ocrResults(): HasMany
    {
        return $this->hasMany(OcrResult::class);
    }

}
