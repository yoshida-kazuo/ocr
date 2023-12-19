<?php

namespace App\Http\Controllers\V1\Web\Admin\User\Manager;

use App\Http\Controllers\Controller;
use App\Lib\Support\User\UserSupport;
use App\Http\Requests\V1\Web\Admin\User\Manager\EdiRequest;
use Inertia\Inertia;

class EditController extends Controller
{

    /**
     * Handle the incoming request.
     *
     * @param EdiRequest $request
     * @param UserSupport $userSupport
     * @param integer $id
     *
     * @return \Inertia\Response
     */
    public function __invoke(
        EdiRequest $request,
        UserSupport $userSupport,
        int $id
    ): \Inertia\Response {
        $user = $userSupport->find(
            id: $id,
            withTrashed: true
        );
        $roles = collect($user->roles())
            ->filter(fn($value, $key) => $key >= user('role_id'))
            ->map(fn($key, $value) => ['value' => $value, 'label' => $key])
            ->values()
            ->toArray();

        return Inertia::render('Admin/User/Manager/Edit', compact(
            'user',
            'roles'
        ));
    }

}
