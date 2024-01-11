<?php

namespace App\Lib\Support\Activity;

use App\Jobs\ProcessAcitivity;
use App\Models\Activity as ActivityModel;
use Illuminate\Contracts\Database\Eloquent\Builder;

class ActivitySupport
{

    /**
     * Constructor
     *
     * @param string|null $message
     * @param string|null $type
     */
    public function __construct(
        ?string $message = null,
        ?string $type = null
    ) {
        if (isset($message)
            && isset($type)
        ) {
            $this->create($message, $type);
        }
    }

    /**
     * create function
     *
     * @param string $message
     * @param string $type
     *
     * @return ActivitySupport
     */
    public function create(
        string $message,
        string $type
    ): ActivitySupport {
        $message = implode(' : ' , [
                'v' . config('app.version'),
                $message,
            ]);

        if (! app()->runningInConsole()) {
            ProcessAcitivity::dispatch($message, $type)
                ->onConnection('sync')
                ->afterResponse();
        } else {
            ProcessAcitivity::dispatch($message, $type)
                ->onConnection('sync')
                ->afterCommit();
        }

        return $this;
    }

    /**
     * info function
     *
     * @param string $message
     *
     * @return ActivitySupport
     */
    public function info(string $message): ActivitySupport
    {
        $this->create($message, 'info');

        return $this;
    }

    /**
     * warning function
     *
     * @param string $message
     *
     * @return ActivitySupport
     */
    public function warning(string $message): ActivitySupport
    {
        $this->create($message, 'warning');

        return $this;
    }

    /**
     * error function
     *
     * @param string $message
     *
     * @return ActivitySupport
     */
    public function error(string $message): ActivitySupport
    {
        $this->create($message, 'error');

        return $this;
    }

    /**
     * dev function
     *
     * @param string $message
     *
     * @return ActivitySupport
     */
    public function dev(string $message): ActivitySupport
    {
        if (! app()->isProduction()) {
            $this->create($message, 'dev');
        }

        return $this;
    }

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
        array $conditions,
        int $perPage = 15,
        string $catalogName = 'activity-catalog',
        int $onEachSide = 1
    ): \Illuminate\Contracts\Pagination\LengthAwarePaginator {
        $conditions = collect($conditions);
        $activities = ActivityModel::with('user');

        $activities->where(function (Builder $query) {
            $users = \App\Models\User::select('id')
                ->whereColumn('users.id', 'activities.user_id')
                ->where('role_id', '>=', user('role_id'));

            $query->whereNull('user_id')
                ->orWhereExists($users);
        });

        if ($conditions->get('type')) {
            $activities->where('type', $conditions->get('type'));
        }

        if ($conditions->get('message')) {
            $activities->where('message', 'like', "%{$conditions->get('message')}%");
        }

        if (! $conditions->get('order')) {
            $conditions->put('order', [
                'id' => 'desc',
            ]);
        }

        foreach ($conditions->get('order') as $col => $order) {
            $activities->orderBy($col, $order);
        }

        return $activities->paginate(
                $perPage,
                ['*'],
                $catalogName
            )
            ->onEachSide($onEachSide);
    }

}
