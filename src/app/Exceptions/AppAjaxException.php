<?php

namespace App\Exceptions;

use Illuminate\Http\Request;
use Illuminate\Contracts\Validation\Validator;

class AppAjaxException extends AppErrorException
{

    /**
     * errors variable
     *
     * @var array
     */
    protected $errors = [];

    /**
     * statusCode variable
     *
     * @var integer
     */
    protected $statusCode = 400;

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
        int $code = 400
    ) {
        $this->errors = json_decode($message, true);
        $this->statusCode = $code;

        parent::__construct(print_r($this->errors, true), $code);
    }

    /**
     * render function
     *
     * @param Request $request
     *
     * @return array
     */
    public function render(Request $request)
    {
        return response([
                'result'    => 'ng',
                'data'      => null,
                'errors'    => $this->errors,
            ],
            $this->statusCode);
    }

}
