<?php

namespace App\Http\Controllers\V1\Web\User\Ocr\MonitoringSetup;

use App\Lib\Support\OcrResult\WatchedFolderSupport;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class IndexController extends Controller
{

    /**
     * perPage variable
     *
     * @var integer
     */
    protected $perPage = 15;

    /**
     * onEachSide variable
     *
     * @var integer
     */
    protected $onEachSide = 1;

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
                'user_id'   => user('id'),
                'order' => [
                    'id' => 'ASC',
                ],
            ],
            perPage: $this->perPage,
            onEachSide: $this->onEachSide
        );

        return Inertia::render('User/Ocr/MonitoringSetup/Index', compact(
            'watchedFolders'
        ));
    }

}
