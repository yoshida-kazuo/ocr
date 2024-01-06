<?php

namespace App\Lib;

use Carbon\Carbon;

class Timezone
{

    /**
     * app function
     *
     * @param mixed $time
     *
     * @return String|null
     */
    public function app(mixed $time): String|null
    {
        return ! is_null($time) ? Carbon::parse($time)
            ->setTimezone(config('app.timezone_view'))
            ->format('Y/m/d H:i:s') : null;
    }

}
