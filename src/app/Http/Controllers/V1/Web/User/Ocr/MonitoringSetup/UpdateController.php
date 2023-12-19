<?php

namespace App\Http\Controllers\V1\Web\User\Ocr\MonitoringSetup;

use App\Lib\Support\OcrResult\WatchedFolderSupport;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class UpdateController extends Controller
{

    /**
     * Handle the incoming request.
     */
    public function __invoke(
        Request $request,
        WatchedFolderSupport $watchedFolderSupport
    ): \Illuminate\Http\RedirectResponse {
        $watchedFolder = $watchedFolderSupport->update(
            id: $request->post('id'),
            values: [
                'service'       => $request->post('service'),
                'storage'       => $request->post('storage'),
                'folder_path'   => $request->post('folder_path'),
                'is_active'     => (int) $request->post('is_active'),
            ],
        );

        return to_route('user.ocr.monitoring-setup');
    }

}
