<?php

namespace App\Lib\Support;

use App\Jobs\ProcessAcitivity;
use App\Models\Activity as ActivityModel;

class Activity
{

    /**
     * Constructor
     *
     * @param string|null $message
     * @param string|null $type
     * @return void
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
     * @return Activity
     */
    public function create(
        string $message,
        string $type
    ): Activity {
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
     * @return Activity
     */
    public function info(string $message): Activity
    {
        $this->create($message, 'info');

        return $this;
    }

    /**
     * error function
     *
     * @param string $message
     * @return Activity
     */
    public function error(string $message): Activity
    {
        $this->create($message, 'error');

        return $this;
    }

    /**
     * dev function
     *
     * @param string $message
     * @return Activity
     */
    public function dev(string $message): Activity
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
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function catalog(
        array $conditions,
        int $perPage = 15,
        string $catalogName = 'activity-catalog'
    ) : \Illuminate\Contracts\Pagination\LengthAwarePaginator {
        $conditions = collect($conditions);
        $activities = ActivityModel::with('user');

        if ($conditions->get('type')) {
            $activities->where('type', $conditions->get('type'));
        }

        if ($conditions->get('message')) {
            $activities->where('message', 'like', "%{$conditions->get('message')}%");
        }

        if (! $conditions->get('order')) {
            $conditions->put('order', [
                'id'    => 'desc',
            ]);
        }

        foreach ($conditions->get('order') as $col => $order) {
            $activities->orderBy($col, $order);
        }

        return $activities->paginate(
            $perPage,
            ['*'],
            $catalogName
        );
    }

}
