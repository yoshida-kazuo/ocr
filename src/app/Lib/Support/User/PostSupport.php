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
        $post = PostModel::with([
            'user',
            'posts'
        ]);

        if ($withTrashed) {
            $post->withTrashed();
        }

        return $post->find($id);
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
     * update function
     *
     * @param integer $id
     * @param array $values
     * @param boolean $isRestore
     * @param boolean $withTrashed
     *
     * @return boolean
     */
    public function update(
        int $id,
        array $values,
        bool $isRestore = false,
        bool $withTrashed = false
    ): bool {
        $post = $this->find(
            id: $id,
            withTrashed: $withTrashed
        );

        activity()
            ->info(__(':postId : :userId : Update post information. : :currentData : :newData', [
                'postId'        => $post->id,
                'userId'        => $post->user_id,
                'currentData'   => print_r($post->toArray(), true),
                'newData'       => print_r($values, true),
            ]));

        foreach ($values as $column => $value) {
            $post->{$column} = $value;
        }

        if ($isRestore) {
            activity()
                ->info(__(':postId : :userId : The deletion flag has been removed.', [
                    'postId'    => $post->id,
                    'userId'    => $post->user_id,
                ]));
        }

        return $isRestore ? $post->restore() : $post->save();
    }

    /**
     * delete function
     *
     * @param integer $id
     * @param callable|null $callbackFunction
     *
     * @return boolean|null
     */
    public function delete(
        int $id,
        ?callable $callbackFunction = null
    ): bool|null {
        $post = $this->find($id);
        $delete = $post->delete();

        if ($callbackFunction) {
            call_user_func($callbackFunction, $post);
        }

        if ($delete) {
            activity()
                ->info(__(':postId : :userId : :body : The post has been deleted.', [
                    'postId'    => $post->id,
                    'userId'    => $post->user_id,
                    'body'      => $post->body,
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
     * @param boolean $withTrashed
     *
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function catalog(
        array $conditions = [],
        int $perPage = 15,
        string $catalogName = 'post-catalog',
        int $onEachSide = 1,
        bool $withTrashed = false,
        ?bool $isPublished = null,
        ?int $allPublisheUserId = null
    ): \Illuminate\Contracts\Pagination\LengthAwarePaginator {
        $conditions = collect($conditions);
        $posts = PostModel::with([
                'user',
                'posts',
            ]);

        if ($withTrashed === true) {
            $posts->withTrashed();
        }

        if (isset($isPublished)) {
            $posts->where(function($query) use($isPublished, $allPublisheUserId) {
                $query->where('is_published', $isPublished);

                if (isset($allPublisheUserId)) {
                    $query->orWhere('user_id', $allPublisheUserId);
                }
            });
        }

        if ($conditions->get('topic_type')) {
            $posts->where('topic_type', $conditions->get('topic_type'));
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
