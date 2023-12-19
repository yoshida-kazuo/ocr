<?php

namespace App\Jobs;

use Illuminate\Bus\Batchable;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Artisan;
use Throwable;

class ProcessOcr implements ShouldQueue
{
    use Batchable,
        Dispatchable,
        InteractsWithQueue,
        Queueable,
        SerializesModels;

    /**
     * The number of times the job may be attempted.
     *
     * @var integer
     */
    public $tries = 3;

    /**
     * The number of seconds the job can run before timing out.
     *
     * @var integer
     */
    public $timeout = 540;

    /**
     * Mark the given job as failed if it should fail on timeouts.
     *
     * @var boolean
     */
    public $failOnTimeout = true;

    /**
     * options variable
     *
     * @var Collection
     */
    protected $options;

    /**
     * Create a new job instance.
     *
     * @param array $options
     *
     * @return void
     */
    public function __construct(array $options = []) {
        $this->options = collect([
                '--service'             => 'tesseract-v1',
                '--pages'               => '1',
                '--dpi'                 => 300,
                '--image-correction'    => true,
                '--user-id'             => null,
                '--storage'             => null,
            ])
            ->merge($options);
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle(): void
    {
        Artisan::call(
            'ocr:run',
            $this->options->toArray()
        );
    }

    /**
     * failed function
     *
     * @param Throwable $exception
     *
     * @return void
     */
    public function failed(Throwable $exception): void
    {
        activity(
            $exception->getMessage(),
            'error'
        );
    }

}
