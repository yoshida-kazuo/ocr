<?php

namespace App\Lib\Support\User;

use App\Models\Post as PostModel;

class PostSupport
{

    /**
     * model function
     *
     * @return PostModel
     */
    public function model(): PostModel
    {
        return app(PostModel::class);
    }

    /**
     * store function
     *
     * @param array $values
     *
     * @return PostModel
     */
    public function store(array $values): PostModel
    {
        $post = new PostModel;

        foreach ($values as $column => $value) {
            $post->{$column} = $value;
        }

        $post->save();

        activity()
            ->info(__(':userId : Create post information. : :postData', [
                'userId'        => $post->user_id,
                'postData'      => print_r($values, true),
            ]));

        return $post;
    }

    /**
     * catalog function
     *
     * @param array $conditions
     * @param integer $perPage
     * @param string $catalogName
     * @param integer $onEachSide
     * @param boolean $withTrashed
     *
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function catalog(
        array $conditions = [],
        int $perPage = 15,
        string $catalogName = 'post-catalog',
        int $onEachSide = 1,
        bool $withTrashed = false
    ): \Illuminate\Contracts\Pagination\LengthAwarePaginator {
        $conditions = collect($conditions);
        $posts = PostModel::with([
                'user',
                'posts',
            ]);

        if ($withTrashed === true) {
            $posts->withTrashed();
        }

        if (! $conditions->get('order')) {
            $conditions->put('order', [
                'id' => 'desc',
            ]);
        }

        foreach ($conditions->get('order') as $col => $order) {
            $posts->orderBy($col, $order);
        }

        return $posts->paginate(
                $perPage,
                ['*'],
                $catalogName
            )
            ->onEachSide($onEachSide);
    }

}
