<?php

namespace App\Lib\Support\User;

use Illuminate\Support\Str;
use App\Models\User as UserModel;

class UserSupport
{

    /**
     * model function
     *
     * @return UserModel
     */
    public function model(): UserModel
    {
        return app(UserModel::class);
    }

    /**
     * find function
     *
     * @param integer $id
     * @param boolean $withTrashed
     *
     * @return mixed
     */
    public function find(
        int $id,
        bool $withTrashed = false
    ): mixed {
        $user = UserModel::with('role');

        if ($withTrashed) {
            $user->withTrashed();
        }

        return $user->find($id);
    }

    /**
     * store function
     *
     * @param array $values
     * @param boolean $emailVerified
     *
     * @return UserModel
     */
    public function store(
        array $values,
        bool $emailVerified = false
    ): UserModel {
        $user = new UserModel;

        foreach ($values as $column => $value) {
            $user->{$column} = $value;
        }

        if ($emailVerified === true) {
            $user->email_verified_at = now();
        }

        $user->save();

        activity()
            ->info(__(':userId : :email : :name : Create user information. : :postData : :userData', [
                'userId'        => $user->id,
                'name'          => $user->name,
                'email'         => $user->email,
                'postData'      => print_r($values, true),
                'userData'      => print_r($user->toArray(), true),
            ]));

        return $user;
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
     * @param boolean $aboveCurrentAuth
     * @param array $excludeUserIds
     * @param array $excludeRoleIds
     * @param boolean $withTrashed
     *
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function catalog(
        array $conditions = [],
        int $perPage = 15,
        string $catalogName = 'user-catalog',
        int $onEachSide = 1,
        bool $aboveCurrentAuth = false,
        array $excludeUserIds = [],
        array $excludeRoleIds = [],
        bool $withTrashed = false
    ): \Illuminate\Contracts\Pagination\LengthAwarePaginator {
        $conditions = collect($conditions);
        $users = UserModel::with('role');

        if (! empty($excludeUserIds)) {
            $users->whereNotIn('id', $excludeUserIds);
        }

        if ($aboveCurrentAuth === true) {
            $users->where('role_id', '>=', user('role_id'));
        }

        if (! empty($excludeRoleIds)) {
            $users->whereNotIn('role_id', $excludeRoleIds);
        }

        if ($withTrashed === true) {
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

    /**
     * createUniqueColumn function
     *
     * @param string $uniqueColumn
     * @param string|null $prefix
     * @param string|null $suffix
     * @param integer $length
     *
     * @return string
     *
     * @throws \App\Exceptions\AppErrorException
     */
    public function createUniqueColumn(
        string $uniqueColumn = 'email',
        ?string $prefix = null,
        ?string $suffix = null,
        int $length = 16,
        int $maxAttempts = 12
    ): string {
        $isUnique = false;

        for ($attempts = 0; $attempts < $maxAttempts; $attempts++) {
            $randomString = Str::random($length);

            if ($prefix) {
                $randomString = "{$prefix}{$randomString}";
            }

            if ($suffix) {
                $randomString .= $suffix;
            }

            if (! UserModel::where($uniqueColumn, $randomString)
                ->exists()
            ) {
                $isUnique = true;
                break;
            }
        }

        if (! $isUnique) {
            throw new \App\Exceptions\AppErrorException('Failed to generate unique data.');
        }

        return $randomString;
    }

}
