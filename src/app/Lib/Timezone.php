<?php

namespace App\Lib;

use Carbon\Carbon;

class Timezone
{

    /**
     * app function
     *
     * @param mixed $time
     * @return Carbon|null
     */
    public function app(mixed $time): Carbon|null
    {
        return ! is_null($time) ? Carbon::parse($time)
            ->setTimezone(
                config('app.timezone')
            ) : null;
    }

}
