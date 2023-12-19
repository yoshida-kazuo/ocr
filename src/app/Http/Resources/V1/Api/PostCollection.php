<?php

namespace App\Http\Resources\V1\Api;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class PostCollection extends ResourceCollection
{

    /**
     * Transform the resource collection into an array.
     *
     * @param Request $request
     *
     * @return array<int|string, mixed>
     */
    public function toArray(Request $request): \Illuminate\Support\Collection
    {
        return $this->collection;
    }

}
