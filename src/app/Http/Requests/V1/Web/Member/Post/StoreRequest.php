<?php

namespace App\Http\Requests\V1\Web\Member\Post;

use Illuminate\Foundation\Http\FormRequest;

class StoreRequest extends FormRequest
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
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'body' => [
                'required',
                'max:12000',
            ],
            'topic_type' => [
                'required',
                'max:64',
            ],
            'is_published' => [
                'required',
                'boolean',
            ],
        ];
    }

}
