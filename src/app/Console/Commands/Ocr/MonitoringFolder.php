<?php

namespace App\Console\Commands\Ocr;

use App\Jobs\ProcessOcr;
use App\Lib\Support\OcrResult\OcrResultSupport;
use App\Lib\Support\OcrResult\WatchedFolderSupport;
use App\Console\Command;
use Illuminate\Support\Facades\Storage;
use Illuminate\Bus\Batch;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Str;
use Imagick;
use Throwable;

class MonitoringFolder extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'ocr:monitoring-folder';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = '監視対象フォルダ内のPDF解析を実施';

    /**
     * Execute the console command.
     *
     * @param WatchedFolderSupport $watchedFolderSupport
     *
     * @return integer
     */
    public function handle(
        WatchedFolderSupport $watchedFolderSupport,
        OcrResultSupport $ocrResultSupport
    ): int {
        $this->memoryLimit(-1);

        $status = 0;
        $handleId = uuid();
        $this->info(__(':handleId : We have initiated the MonitoringFolder command.', [
            'handleId'  => $handleId,
        ]));

        $batchDir = config('ocr.batchDir');
        $batchDisk = Storage::disk('local');

        $watchedFolders = $watchedFolderSupport->monitoringFolder();
        foreach ($watchedFolders as $watchedFolder) {
            if ($watchedFolder->storage) {
                $disk = Storage::disk($watchedFolder->storage);
                $monitoringFolder = $watchedFolder->folder_path;
            } else {
                $disk = Storage::build([
                    'driver'    => 'local',
                    'root'      => $watchedFolder->folder_path,
                ]);
                $monitoringFolder = '';
            }
            $monitoringFolder = Str::of($monitoringFolder)
                ->trim('/');

            $ocrClass = config("ocr.{$watchedFolder->service}.class");
            $ocr = new $ocrClass;

            $files = $disk->files($monitoringFolder);
            foreach ($files as $file) {
                $this->info(__(':handleId : :file : We have initiated the batch processing.', [
                    'handleId'  => $handleId,
                    'file'      => $file
                ]));

                $documentId = uuid();
                $filename = basename($file);
                $mimeType = $disk->mimeType($file);
                $tmpImagefile = null;

                if ($ocr->isImage($mimeType)) {
                    $convertPdffile = dirname($file) . '/' . pathinfo($filename, PATHINFO_FILENAME) . '.pdf';
                    $ocr->image2pdf(
                        $disk->path($file),
                        $disk->path($convertPdffile)
                    );

                    $tmpImagefile = $file;
                    $file = $convertPdffile;
                    $filename = basename($file);
                } else
                if (! $ocr->isPdf($mimeType)) {
                    continue;
                }

                $batchFile = "{$batchDir}/{$documentId}/{$filename}";

                if ($batchDisk->put(
                    $batchFile,
                    $disk->get($file)
                )) {
                    $disk->delete($file);
                }

                if ($tmpImagefile
                    && $batchDisk->put(
                        dirname($batchFile) . '/' . basename($tmpImagefile),
                        $disk->get($tmpImagefile)
                    )
                ) {
                    $disk->delete($tmpImagefile);
                }

                $imagick = app(Imagick::class);
                $imagick->readImage($batchDisk->path($batchFile));
                $pageCount = $imagick->getNumberImages();
                $imagick->clear();
                $imagick->destroy();

                $pages = '1';
                if ($pageCount > 1) {
                    $pages .= "-{$pageCount}";
                }

                $ocrResultSupport->store([
                    'user_id'           => $watchedFolder->user_id,
                    'watched_folder_id' => $watchedFolder->id,
                    'document_id'       => $documentId,
                    'service'           => $watchedFolder->service,
                    'storage'           => $watchedFolder->storage,
                    'page_number'       => $pages,
                ]);

                Bus::batch([
                        new ProcessOcr([
                            'filepath'              => $batchDisk->path($batchFile),
                            '--service'             => $watchedFolder->service,
                            '--storage'             => $watchedFolder->storage,
                            '--pages'               => $pages,
                            '--image-correction'    => true,
                            '--document-id'         => $documentId,
                            '--user-id'             => $watchedFolder->user_id,
                        ]),
                    ])
                    ->then(function(Batch $batch) {
                        //
                    })
                    ->catch(function(Batch $batch, Throwable $e) {
                        activity()
                            ->error($e->getMessage());
                    })
                    ->onQueue('ocr-batch')
                    ->dispatch();
            }
        }

        $this->info(__(':handleId : The MonitoringFolder command has terminated successfully.', [
            'handleId' => $handleId,
        ]));

        return $status;
    }
}
