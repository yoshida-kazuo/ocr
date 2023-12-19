<?php

use Illuminate\Support\Facades\Facade;
use Illuminate\Support\ServiceProvider;

return [

    /*
    |--------------------------------------------------------------------------
    | Role Prefix Url
    |--------------------------------------------------------------------------
    */

    'prefix' => [
        'url' => [
            'user'  => env('ROUTE_PREFIX_URL_USER', 'user'),
            'admin' => env('ROUTE_PREFIX_URL_ADMIN', 'admin'),
            'root'  => env('ROUTE_PREFIX_URL_ROOT', 'root'),
        ],
    ],

];
