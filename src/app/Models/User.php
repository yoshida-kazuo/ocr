<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Sanctum\HasApiTokens;
use App\Models\Trait\Timezone;

class User extends Authenticatable
{
    use HasApiTokens,
        HasFactory,
        Notifiable,
        SoftDeletes,
        Timezone;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role_id',
        'email_verified_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password'          => 'hashed',
    ];

    /**
     * roles variable
     *
     * @var array
     */
    protected $roles = [
        'root'  => 30,
        'admin' => 60,
        'user'  => 90,
    ];

    /**
     * dashboardRoutes variable
     *
     * @var array
     */
    protected $dashboardRoutes = [
        'user'  => 'user.dashboard',
        'admin' => 'admin.dashboard',
        'root'  => 'root.dashboard',
    ];

    /**
     * defaultRole variable
     *
     * @var integer
     */
    protected $defaultRole = 90;

    /**
     * roles function
     *
     * @param string|null $role
     *
     * @return array<string, integer>|int|null
     */
    public function roles(?string $role = null): mixed
    {
        $roles = $this->roles;
        if (is_string($role)) {
            $roles = data_get($this->roles, $role);
        }

        return $roles;
    }

    /**
     * dashboardRoute function
     *
     * @param string|null $role
     *
     * @return string|array
     */
    public function dashboardRoute(?string $role = null): string|array
    {
        $dashboardRoute = $this->dashboardRoutes;

        if (isset($role) && ! empty($role)) {
            $dashboardRoute = data_get($this->dashboardRoutes, $role);
        }

        if (is_null($role) && $this->role_id) {
            $role = array_flip($this->roles)[$this->role_id];
            $dashboardRoute = data_get($this->dashboardRoutes, $role);
        }

        return $dashboardRoute;
    }

    /**
     * authorizeUser function
     *
     * @param string $role
     *
     * @return boolean
     */
    public function authorizeUser(string $role): bool
    {
        return $this->role_id <= $this->roles($role);
    }
}
