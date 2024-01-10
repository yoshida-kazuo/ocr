<?php

use Illuminate\Support\Str;
use App\Lib\Support\Activity\ActivitySupport;

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
        $activity = app(ActivitySupport::class);

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

if (! function_exists('sortable')) {
    /**
     * sortable function
     *
     * @param string $title
     * @param string $column
     * @return string
     */
    function sortable(
        string $title,
        string $column
    ): string {
        $sort = 'asc';
        $active = null;

        if (request("order.{$column}")) {
            $active = strtolower(
                request("order.{$column}")
            );
        }

        if ($active === $sort) {
            $sort = 'desc';
        }

        $url = request()
            ->fullUrlWithQuery([
                'order' => [
                    $column => $sort,
                ]
            ]);

        $sortClass = null;
        if ($active) {
            $sortClass = 'caret down icon';

            if ($sort === 'desc') {
                $sortClass = 'caret up icon';
            }
        }

        $sortable = view()
            ->make('vendor.sortable.semantic-ui', [
                'title'     => $title,
                'url'       => $url,
                'sortClass' => $sortClass,
            ])
            ->render();

        return $sortable;
    }
}
