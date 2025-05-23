<?php

namespace App\Http\Requests\Admin;

use App\Models\CustomWebPage;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CustomWebPageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $unique = Rule::unique(CustomWebPage::class);
        if ($this->method() != 'POST') {
            $unique = $unique->ignore($this->route('custom_web_page')->id);
        }

        return [
            'pathname' => ['required', 'string', 'max:768', 'regex:/^[A-Za-z0-9-\/]+$/', $unique],
            'title' => 'required|string|max:60',
            'og_image_url' => 'nullable|string|max:8000|active_url',
            'description' => 'required|string|max:65',
            'content' => 'nullable|string|max:4194303',
        ];
    }

    public function messages(): array
    {
        return [
            'pathname.regex' => 'The pathname field must only contain letters, numbers, dashes and slash.',
            'og_image_url.string' => 'The open graph image url field must be a string.',
            'og_image_url.max' => 'The open graph image url field must not be greater than 8000 characters.',
            'og_image_url.active_url' => 'The open graph image url field is not a valid URL.',
        ];
    }
}
