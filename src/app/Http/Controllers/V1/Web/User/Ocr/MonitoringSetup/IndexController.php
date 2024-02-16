<?php

namespace App\Http\Controllers\V1\Web\User\Ocr\MonitoringSetup;

use App\Lib\Support\OcrResult\WatchedFolderSupport;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class IndexController extends Controller
{

    /**
     * Handle the incoming request.
     *
     * @param Request $request
     * @param WatchedFolderSupport $watchedFolderSupport
     *
     * @return \Inertia\Response
     */
    public function __invoke(
        Request $request,
        WatchedFolderSupport $watchedFolderSupport
    ): \Inertia\Response {
        $watchedFolders = $watchedFolderSupport->catalog(
            conditions: [
                'user_id'   => user('id')
            ],
            perPage: 999
        );

        return Inertia::render('User/Ocr/MonitoringSetup/Index', compact(
            'watchedFolders'
        ));
    }

}
