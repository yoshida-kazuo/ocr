<?php

namespace App\Models\Trait;

use Illuminate\Database\Eloquent\Casts\Attribute;
use App\Lib\Timezone as LibTimezone;

trait Timezone
{

    /**
     * createdAt function
     *
     * @return Attribute
     */
    protected function createdAt(): Attribute
    {
        return Attribute::make(
            get: fn($value) => app(LibTimezone::class)
                ->app($value)
        );
    }

    /**
     * updatedAt function
     *
     * @return Attribute
     */
    protected function updatedAt(): Attribute
    {
        return Attribute::make(
            get: fn($value) => app(LibTimezone::class)
                ->app($value)
        );
    }

    /**
     * deletedAt function
     *
     * @return Attribute
     */
    protected function deletedAt(): Attribute
    {
        return Attribute::make(
            get: fn($value) => app(LibTimezone::class)
                ->app($value)
        );
    }

    /**
     * emailVerifiedAt function
     *
     * @return Attribute
     */
    protected function emailVerifiedAt(): Attribute
    {
        return Attribute::make(
            get: fn($value) => app(LibTimezone::class)
                ->app($value)
        );
    }

    /**
     * lastUsedAt function
     *
     * @return Attribute
     */
    protected function lastUsedAt(): Attribute
    {
        return Attribute::make(
            get: fn($value) => app(LibTimezone::class)
                ->app($value)
        );
    }

    /**
     * expiresAt function
     *
     * @return Attribute
     */
    protected function expiresAt(): Attribute
    {
        return Attribute::make(
            get: fn($value) => app(LibTimezone::class)
                ->app($value)
        );
    }

    /**
     * failedAt function
     *
     * @return Attribute
     */
    protected function failedAt(): Attribute
    {
        return Attribute::make(
            get: fn($value) => app(LibTimezone::class)
                ->app($value)
        );
    }

    /**
     * loginBanAt function
     *
     * @return Attribute
     */
    protected function loginBanAt(): Attribute
    {
        return Attribute::make(
            get: fn($value) => app(LibTimezone::class)
                ->app($value)
        );
    }

}
