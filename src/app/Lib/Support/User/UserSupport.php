<?php

namespace App\Lib\Support\User;

use App\Models\User as UserModel;

class UserSupport
{

    /**
     * catalog function
     *
     * @param array $conditions
     * @param integer $perPage
     * @param string $catalogName
     * @param integer $onEachSide
     *
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function catalog(
        array $conditions = [],
        int $perPage = 15,
        string $catalogName = 'user-catalog',
        int $onEachSide = 1
    ): \Illuminate\Contracts\Pagination\LengthAwarePaginator {
        $conditions = collect($conditions);
        $users = UserModel::on();

        if ($conditions->get('role_id')) {
            $users->where('role_id', $conditions->get('role_id'));
        }

        if ($conditions->get('name')) {
            $users->where('name', 'like', "%{$conditions->get('name')}%");
        }

        if ($conditions->get('email')) {
            $users->where('email', 'like', "{$conditions->get('email')}%");
        }

        if (! $conditions->get('order')) {
            $conditions->put('order', [
                'id' => 'desc',
            ]);
        }

        foreach ($conditions->get('order') as $col => $order) {
            $users->orderBy($col, $order);
        }

        return $users->paginate(
                $perPage,
                ['*'],
                $catalogName
            )
            ->onEachSide($onEachSide);
    }

}
