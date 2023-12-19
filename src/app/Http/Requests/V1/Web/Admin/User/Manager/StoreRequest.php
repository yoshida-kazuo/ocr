<?php

namespace App\Http\Requests\V1\Web\Admin\User\Manager;

use App\Http\Requests\V1\Web\Auth\RegisterRequest;

class StoreRequest extends RegisterRequest
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
        return parent::rules();
    }

}
