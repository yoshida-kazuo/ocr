<?php

namespace App\Http\Requests\V1\Web\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules;

class UpadatePasswordRequest extends FormRequest
{

    /**
     * authorize function
     *
     * @return boolean
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * rules function
     *
     * @return array
     */
    public function rules(): array
    {
        return [
            'current_password'  => [
                'required',
                'current_password',
            ],
            'password' => [
                'required',
                Rules\Password::defaults(),
                'confirmed',
            ],
        ];
    }

}
