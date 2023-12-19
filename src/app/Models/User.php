<?php

namespace App\Models;

use App\Lib\Support\User\RoleSupport;
use App\Models\Trait\Timezone;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable implements MustVerifyEmail
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
        'provider',
        'provider_id',
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
     * @var array|null
     */
    protected $roles = null;

    /**
     * roles function
     *
     * @return array
     */
    public function roles(): array
    {
        if ($this->roles !== null) {
            return $this->roles;
        }

        $this->roles = app(RoleSupport::class)
            ->all()
            ->pluck('role', 'id')
            ->toArray();

        return $this->roles;
    }

    /**
     * dashboardRoute function
     *
     * @return string
     */
    public function dashboardRoute(): string
    {
        return $this->role->redirect_route;
    }

    /**
     * isAuthorizeUser function
     *
     * @param string $role
     * @param boolean $strict
     *
     * @return boolean
     */
    public function isAuthorizeUser(
        string $role,
        bool $strict = false
    ): bool {
        $isAuthorizeUser = false;
        $roleId = data_get(array_flip($this->roles()), $role);

        if ($strict === true) {
            $isAuthorizeUser = $this->role_id === $roleId;
        } else {
            $isAuthorizeUser = $this->role_id <= $roleId;
        }

        return $isAuthorizeUser;
    }

    /**
     * role function
     *
     * @return BelongsTo
     */
    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    /**
     * activities function
     *
     * @return HasMany
     */
    public function activities(): HasMany
    {
        return $this->hasMany(Activity::class);
    }

    /**
     * authProviders function
     *
     * @return HasMany
     */
    public function authProviders(): HasMany
    {
        return $this->hasMany(AuthProvider::class);
    }

}
