<?php

namespace App\Lib\Support\User;

use App\Models\Role as RoleModel;
use Illuminate\Database\Eloquent\Collection;

class RoleSupport
{

    /**
     * all function
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function all(): Collection
    {
        return RoleModel::all();
    }

}
