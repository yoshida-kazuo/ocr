<?php

namespace App\Lib\Support\OcrResult;

use App\Models\WatchedFolder;

class WatchedFolderSupport
{

    /**
     * model function
     *
     * @return WatchedFolder
     */
    public function model(): WatchedFolder
    {
        return app(WatchedFolder::class);
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
        $watchedFolder = WatchedFolder::on();

        if ($withTrashed) {
            $watchedFolder->withTrashed();
        }

        return $watchedFolder->find($id);
    }

    /**
     * store function
     *
     * @param array $values
     *
     * @return WatchedFolder
     */
    public function store(array $values): WatchedFolder
    {
        $watchedFolder = new WatchedFolder;

        foreach ($values as $column => $value) {
            $watchedFolder->{$column} = $value;
        }

        $watchedFolder->save();

        return $watchedFolder;
    }

    /**
     * update function
     *
     * @param integer $id
     * @param array $values
     * @param boolean $withTrashed
     *
     * @return boolean
     */
    public function update(
        int $id,
        array $values,
        bool $withTrashed = false
    ): bool {
        $watchedFolder = $this->find(
            id: $id,
            withTrashed: $withTrashed
        );

        foreach ($values as $column => $value) {
            $watchedFolder->{$column} = $value;
        }

        return $watchedFolder->save();
    }

    /**
     * delete function
     *
     * @param integer $id
     * @param mixed $callback
     *
     * @return boolean|null
     */
    public function delete(
        int $id,
        $callback = null
    ): bool|null {
        $watchedFolder = $this->find($id);
        $delete = $watchedFolder->delete();

        if ($callback) {
            call_user_func($callback, $watchedFolder);
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
     *
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function catalog(
        array $conditions = [],
        int $perPage = 15,
        string $catalogName = 'watched-folder-catalog',
        int $onEachSide = 1
    ): \Illuminate\Contracts\Pagination\LengthAwarePaginator {
        $conditions = collect($conditions);
        $watchedFolder = WatchedFolder::withCount([
            'ocrResults',
        ]);

        if ($conditions->get('user_id')) {
            $watchedFolder->where('user_id', $conditions->get('user_id'));
        }

        if (! $conditions->get('order')) {
            $conditions->put('order', [
                'id' => 'desc',
            ]);
        }

        foreach ($conditions->get('order') as $col => $order) {
            $watchedFolder->orderBy($col, $order);
        }

        return $watchedFolder->paginate(
                $perPage,
                ['*'],
                $catalogName
            )
            ->onEachSide($onEachSide);
    }

    /**
     * monitoringFolder function
     *
     * @return \Illuminate\Support\LazyCollection
     */
    public function monitoringFolder(): \Illuminate\Support\LazyCollection
    {
        return WatchedFolder::cursor()
            ->filter(function(WatchedFolder $watchedFolder) {
                return $watchedFolder->is_active === 1;
            });
    }

}

