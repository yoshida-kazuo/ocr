<?php

namespace App\Exceptions;

use Exception;

class AppOcrException extends Exception
{

    /**
     * Create a new application error exception.
     *
     * @param  string  $message
     * @param integer $code
     *
     * @return void
     */
    public function __construct(
        string $message,
        int $code = 0
    ) {
        parent::__construct($message, $code);

        activity()
            ->error("Activity: {$message} : {$code}");
    }

}
