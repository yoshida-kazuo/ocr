<?php

namespace App\Exceptions;

use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Validator as ValidatorFacade;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Request;

class ApiValidationException extends ValidationException
{

    /**
     * responseData function
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return array
     */
    public function responseData(Request $request): array
    {
        //

        return [
            'message'   => 'ng',
            'errors'    => Arr::map(
                $this->errors(),
                fn(array $value, string $key): string => reset($value)
            ),
        ];
    }

}
