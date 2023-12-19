<?php

namespace App\Exceptions;

use Illuminate\Support\Arr;
use Illuminate\Validation\ValidationException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     *
     * @return void
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    /**
     * Convert a validation exception into a JSON response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Illuminate\Validation\ValidationException  $exception
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function invalidJson(
        $request,
        ValidationException $exception
    ): \Illuminate\Http\JsonResponse {
        if ($exception instanceof ApiValidationException) {
            $responseData = $exception->responseData($request);
        } else {
            $responseData = [
                'message'   => $exception->getMessage(),
                'errors'    => $exception->errors(),
            ];
        }

        return response()
            ->json(
                $responseData,
                $exception->status
            );
    }

}
