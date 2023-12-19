<?php

namespace App\Http\Requests\V1\Web;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;

class AjaxRequest extends FormRequest
{

    /**
     * Determine if the user is authorized to make this request.
     *
     * @return boolean
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Prepare the data for validation.
     *
     * @return void
     */
    public function prepareForValidation(): void
    {
        $this->merge($this->route()->parameters);
    }

    /**
     * Handle a failed validation attempt.
     *
     * @param  \Illuminate\Contracts\Validation\Validator  $validator
     *
     * @return void
     */
    protected function failedValidation(Validator $validator)
    {
        $exception = $validator->getException();
        $errors = (new $exception($validator))
            ->errorBag($this->errorBag)
            ->errors();
        $statusCode = 400;

        throw new \App\Exceptions\AppAjaxException(
            json_encode($errors),
            $statusCode
        );
    }

}
