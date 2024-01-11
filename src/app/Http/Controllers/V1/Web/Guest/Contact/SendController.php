<?php

namespace App\Http\Controllers\V1\Web\Guest\Contact;

use App\Http\Controllers\Controller;
use App\Http\Requests\V1\Web\Guest\Contact\SendRequest;
use App\Mail\V1\Guest\Contact\Send;
use App\Mail\V1\Guest\Contact\SendAdmin;
use Illuminate\Support\Facades\Mail;

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
        Mail::to($request->email)
            ->send(new Send($request->post()));
        Mail::to(config('mail.to.admin.address'))
            ->send(new SendAdmin($request->post()));

        activity()
            ->info(__(':action : :name : :email : :message', [
                'action'    => __('Your inquiry has been received'),
                'name'      => $request->post('name'),
                'email'     => $request->post('email'),
                'message'   => $request->post('message'),
            ]));

        return to_route(route: 'contact');
    }
}
