<?php

namespace App\Http\Controllers\V1\Web\User\Ocr\MonitoringSetup;

use App\Lib\Support\OcrResult\WatchedFolderSupport;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DestroyController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(
        Request $request,
        WatchedFolderSupport $watchedFolderSupport
    ) {
        $watchedFolderSupport->delete($request->post('id'));

        return to_route('user.ocr.monitoring-setup');
    }
}
