<?php

namespace App\Http\Requests\V1\Web\Admin\User\Manager;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Database\Query\Builder;
use Illuminate\Validation\Rule;

class DeleteRequest extends FormRequest
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
            'id' => [
                'required',
                Rule::prohibitedIf((int) $this->id === user('id')),
                Rule::exists(\App\Models\User::class)
                    ->where(function(Builder $query) {
                        return $query->where('role_id', '>=', user('role_id'));
                    }),
            ],
        ];
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
     * Get custom messages for validator errors.
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            'id.prohibited' => __('You cannot choose yourself.'),
        ];
    }
}
