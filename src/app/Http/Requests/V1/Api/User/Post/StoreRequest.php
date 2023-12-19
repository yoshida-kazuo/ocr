<?php

namespace App\Http\Requests\V1\Api\User\Post;

use App\Http\Requests\V1\Api\ApiRequest;

class StoreRequest extends ApiRequest
{

    /**
     * Determine if the user is authorized to make this request.
     *
     * @return boolean
     */
    public function authorize(): bool
    {
        return parent::authorize();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'body' => [
                'required',
                'max:1000',
            ],
        ];
    }

}
