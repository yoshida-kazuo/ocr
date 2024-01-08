<?php

namespace App\Http\Controllers\V1\Web\Guest\Contact;

use App\Http\Controllers\Controller;
use App\Http\Requests\V1\Web\Guest\Contact\SendRequest;

class SendController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param SendRequest $request
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function __invoke(SendRequest $request): \Illuminate\Http\RedirectResponse
    {
        //

        return to_route('contact');
    }
}
