<?php

namespace App\Console\Commands\Ocr\Image;

use Illuminate\Console\Command;

class Adjust extends Command
{

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'ocr:image-adjust {file-path}
        {--output-dir=}
        {--output-image-file=output.jpg}
        {--output-json-file=output.json}
        {--dpi=300}
    ';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = '画像補正を行う';

    /**
     * Execute the console command.
     *
     * @return integer
     */
    public function handle(): int
    {
        $status = 0;

        // $python = '/usr/bin/python3';
        // $exec = '/var/www/storage/bin/cv/main.py cvimage cells';
        // $filePath = $this->argument('file-path');
        // if (! $outputDir = $this->option('output-dir')) {
        //     $outputDir = dirname($filePath);
        // }

        // $info = null;
        // exec(
        //     sprintf('%s %s --file-path=%s --output-dir=%s --output-file=%s --output-json-file=%s --dpi=%d', ...[
        //         $python,
        //         $exec,
        //         $this->argument('file-path'),
        //         $outputDir,
        //         escapeshellarg($this->option('output-file')),
        //         escapeshellarg($this->option('output-json-file')),
        //         $this->option('dpi'),
        //     ]),
        //     $info,
        //     $status
        // );

        return $status;
    }

}
