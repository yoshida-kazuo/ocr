<?php

namespace App\Console\Commands\User;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Validator;
use App\Http\Requests\V1\Web\Auth\RegisterRequest;
use App\Models\User;

class Create extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:create
        {email : 追加ユーザのメールアドレスをセットしてください}
        {password : パスワードは8文字以上でセットしてください}
        {--N|name= : 省略した場合emailがセットされます}
        {--R|role-id= : [3:root|6:admin|9:user] 省略した場合9がセットされます}
        ';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'ユーザ追加';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $status = 0;
        $uuid = uuid();

        $this->info("{$uuid} start");

        $this->addArgument(
            'password_confirmation',
            null,
            '',
            $this->argument('password')
        );

        $rules = (new RegisterRequest)
            ->rules();

        $validator = Validator::make(
            $this->arguments(),
            data_forget($rules, 'name')
        );

        if ($validator->fails()) {
            foreach ($validator->errors()
                ->messages() as $k => $v
            ) {
                foreach ($v as $e) {
                    $this->error("{$uuid} error {$k}: {$e}");
                }
            }

            $status = 91001;
        }

        $user = (new User)
            ->fill([
                'email'     => $this->argument('email'),
                'password'  => bcrypt($this->argument('password')),
                'name'      => $this->option('name') ?: $this->argument('email'),
                'role_id'   => $this->option('role-id') ?: 9,
            ]);
        $user->email_verified_at = now();

        if ($status === 0
            && ! $user->save()
        ) {
            $this->error("{$uuid} error Error while saving data in database");

            $status = 91002;
        }

        if ($status === 0) {
            $this->info("{$uuid} success created user {$this->argument('email')}");
        }

        $this->info("{$uuid} end");

        return $status;
    }
}
