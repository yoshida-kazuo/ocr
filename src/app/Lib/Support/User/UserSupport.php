<?php

namespace App\Lib\Support\User;

use App\Models\User as UserModel;
use Nette\Utils\Callback;

class UserSupport
{

    /**
     * find function
     *
     * @param integer $id
     *
     * @return UserModel
     */
    public function find(
        int $id,
        bool $withTrashed = false
    ): UserModel {
        $users = UserModel::with('role');

        if ($withTrashed) {
            $users->withTrashed();
        }

        return $users->find($id);
    }

    /**
     * update function
     *
     * @param integer $id
     * @param array $values
     * @param boolean|null $isLoginProhibited
     * @param boolean $isRestore
     * @param boolean $withTrashed
     *
     * @return boolean
     */
    public function update(
        int $id,
        array $values,
        bool|null $isLoginProhibited = null,
        bool $isRestore = false,
        bool $withTrashed = false
    ): bool {
        $user = $this->find(
            id: $id,
            withTrashed: $withTrashed
        );

        activity()
            ->info(__(':userId : :email : Update user information. : :currentData : :newData', [
                'userId'        => $user->id,
                'email'         => $user->email,
                'currentData'   => print_r($user->toArray(), true),
                'newData'       => print_r($values, true),
            ]));

        foreach ($values as $column => $value) {
            $user->{$column} = $value;
        }

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
            activity()
                ->info(__(':userId : :email : :oldEmail : The email address has been changed.', [
                    'userId'    => $user->id,
                    'email'     => $user->email,
                    'oldEmail'  => data_get($values, 'email'),
                ]));
        }

        if (is_bool($isLoginProhibited)) {
            if (! $isLoginProhibited && $user->login_ban_at) {
                $user->login_ban_at = null;
            } elseif ($isLoginProhibited && is_null($user->login_ban_at)) {
                $user->login_ban_at = now();
            }
        }

        if ($user->isDirty('login_ban_at')) {
            activity()
                ->info(__(':userId : :email : The login restriction status has been changed. : :status', [
                    'userId'    => $user->id,
                    'email'     => $user->email,
                    'status'    => $user->login_ban_at ? 'Login prohibited' : 'Login permitted',
                ]));
        }

        if ($isRestore) {
            activity()
                ->info(__(':userId : :email : The deletion flag has been removed.', [
                    'userId'    => $user->id,
                    'email'     => $user->email,
                ]));
        }

        return $isRestore ? $user->restore() : $user->save();
    }

    /**
     * delete function
     *
     * @param integer $id
     * @param mixed|null $callbackFunction
     *
     * @return boolean|null
     */
    public function delete(
        int $id,
        $callbackFunction = null
    ): bool|null {
        $user = $this->find($id);
        $delete = $user->delete();

        if ($callbackFunction) {
            call_user_func($callbackFunction, $user);
        }

        if ($delete) {
            activity()
                ->info(__(':userId : :email : The account has been deleted.', [
                    'userId'    => $user->id,
                    'email'     => $user->email,
                ]));
        }

        return $delete;
    }

    /**
     * catalog function
     *
     * @param array $conditions
     * @param integer $perPage
     * @param string $catalogName
     * @param integer $onEachSide
     * @param array $excludeRoleId
     * @param boolean $withTrashed
     *
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function catalog(
        array $conditions = [],
        int $perPage = 15,
        string $catalogName = 'user-catalog',
        int $onEachSide = 1,
        array|bool $excludeRoleId = true,
        bool $withTrashed = false
    ): \Illuminate\Contracts\Pagination\LengthAwarePaginator {
        $conditions = collect($conditions);
        $users = UserModel::with('role');

        if (is_bool($excludeRoleId)
            && $excludeRoleId === true
        ) {
            $users->where('role_id', '>=', user('role_id'));
        } else
        if (is_array($excludeRoleId)) {
            $users->whereIn('role_id', $excludeRoleId);
        }

        if ($withTrashed) {
            $users->withTrashed();
        }

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
