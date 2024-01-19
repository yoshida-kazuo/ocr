<?php

namespace App\Lib\Support\User;

use App\Models\AuthProvider as AuthProviderModel;

class AuthProviderSupport
{

    /**
     * model function
     *
     * @return AuthProviderModel
     */
    public function model(): AuthProviderModel
    {
        return app(AuthProviderModel::class);
    }

}
