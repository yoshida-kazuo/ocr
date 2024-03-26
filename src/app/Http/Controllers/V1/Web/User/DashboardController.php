<?php

namespace App\Http\Controllers\V1\Web\User;

use App\Lib\Support\OcrResult\OcrPagesResultSupport;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{

    /**
     * Handle the incoming request.
     *
     * @param Request $request
     *
     * @return Response
     */
    public function __invoke(
        Request $request,
        OcrPagesResultSupport $ocrPagesResultSupport
    ): Response {
        $ocrPagesResultCount = $ocrPagesResultSupport
            ->model()::where('user_id', user('id'))
            ->count();

        return Inertia::render('User/Dashboard', compact(
            'ocrPagesResultCount'
        ));
    }

}
