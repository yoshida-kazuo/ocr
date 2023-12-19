<?php

namespace App\Console;

use Throwable;
use Illuminate\Console\Command as CommandBase;

class Command extends CommandBase
{

    /**
     * memoryLimit function
     *
     * @param integer $memoryLimit
     *
     * @return Command
     */
    public function memoryLimit(int $memoryLimit): Command
    {
        ini_set('memory_limit', $memoryLimit);

        return $this;
    }

    /**
     * info
     *
     * @param string $string
     * @param int|string|null $verbosity
     *
     * @return void
     */
    public function info(
        $string,
        $verbosity = null
    ): void {
        parent::info($string, $verbosity);

        activity($string, 'info');
    }

    /**
     * Write a string as error output.
     *
     * @param  string  $string
     * @param  int|string|null  $verbosity
     * @param Throwable|null $exception
     *
     * @return void
     * @throws Throwable
     */
    #[\Override]
    public function error(
        $string,
        $verbosity = null,
        ?Throwable $exception = null
    ): void {
        parent::error($string, $verbosity);

        if ($exception) {
            throw new $exception($string);
        }
    }

}
