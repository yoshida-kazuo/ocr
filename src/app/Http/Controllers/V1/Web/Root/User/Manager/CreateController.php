<?php

namespace App\Http\Controllers\V1\Web\Root\User\Manager;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CreateController extends Controller
{

    /**
     * Handle the incoming request.
     *
     * @param Request $request
     *
     * @return \Inertia\Response
     */
    public function __invoke(Request $request): \Inertia\Response
    {
        $roles = collect(user()->roles())
            ->map(fn($key, $value) => ['value' => $value, 'label' => $key])
            ->values()
            ->toArray();

        return Inertia::render('Root/User/Manager/Create', compact(
            'roles'
        ));
    }

}
