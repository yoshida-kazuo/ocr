<?php

use Illuminate\Support\Str;
use App\Lib\Support\Activity;

if (! function_exists('activity')) {
    /**
     * activity function
     *
     * @param string|null $message
     * @param string|null $type
     *
     * @return mixed
     */
    function activity(
        ?string $message = null,
        ?string $type = null
    ) {
        $activity = app(Activity::class);

        if (isset($message)
            && isset($type)
        ) {
            $activity
                ->create($message, $type);
        }

        return $activity;
    }
}

if (! function_exists('uuid')) {
    /**
     * uuid function
     * Str::uuid wrapper
     *
     * @return string
     */
    function uuid(): string {
        return (string) Str::uuid();
    }
}

if (! function_exists('user')) {
    /**
     * user function
     *
     * @param string|null $key
     * @param string|null $guard
     *
     * @return \Illuminate\Contracts\Auth\Authenticatable|Carbon\Carbon|null
     */
    function user(
        ?string $key = null,
        ?string $guard = null
    ): mixed {
        $user = auth($guard)
            ->user();

        if (is_string($key)) {
            $user = $user?->{$key};
        }

        return $user;
    }
}
