<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PostResource extends JsonResource
{

    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'            => $this->id,
            'name'          => $this->user->name,
            'body'          => $this->body,
            'replayCount'   => $this->posts->count(),
            'created_at'    => $this->created_at,
            'updated_at'    => $this->updated_at,
        ];
    }

}
