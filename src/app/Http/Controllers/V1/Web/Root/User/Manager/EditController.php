<?php

namespace App\Http\Controllers\V1\Web\Root\User\Manager;

use App\Http\Controllers\Controller;
use App\Lib\Support\User\UserSupport;
use App\Http\Requests\V1\Web\Root\User\Manager\EditRequest;
use Inertia\Inertia;

class EditController extends Controller
{

    /**
     * Handle the incoming request.
     *
     * @param EditRequest $request
     * @param UserSupport $userSupport
     *
     * @return \Inertia\Response
     */
    public function __invoke(
        EditRequest $request,
        UserSupport $userSupport,
        int $id
    ): \Inertia\Response {
        $user = $userSupport->find(
            id: $id,
            withTrashed: true
        );
        $roles = collect($user->roles())
            ->map(fn($key, $value) => ['value' => $value, 'label' => $key])
            ->values()
            ->toArray();

        return Inertia::render('Root/User/Manager/Edit', compact(
            'user',
            'roles'
        ));
    }

}
