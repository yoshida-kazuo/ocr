<?php

namespace App\Console\Commands\User;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules;
use App\Models\User;

class Update extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:update
        {email : 対象ユーザのメールアドレスをセットしてください}
        {--P|password= : 新パスワードをセットしてください}
        {--N|name= : 新ユーザ名をセットしてください}
        {--R|role-id= : 3:root|6:admin|9:user}
        {--restore=no : ソフト削除したユーザを元へ戻す default no}
        ';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'ユーザ更新';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $status = 0;
        $uuid = uuid();

        $this->info("{$uuid} start modify user data {$this->argument('email')}");

        if (! $user = User::withTrashed()
                ->where('email', $this->argument('email'))
                ->first()
        ) {
            $this->error("{$uuid} error User not found {$this->argument('email')}");

            $status = 91005;
        }

        $validator = Validator::make([
                'password'  => $this->option('password'),
                'name'      => $this->option('name'),
            ], [
                'name' => [
                    'nullable',
                    'string',
                    'max:255',
                ],
                'password' => [
                    'nullable',
                    'confirmed',
                    Rules\Password::defaults(),
                ],
            ]
        );

        if ($validator->fails()) {
            foreach ($validator->errors()
                ->messages() as $k => $v
            ) {
                foreach ($v as $e) {
                    $this->error("{$uuid} error {$k}: {$e}");
                }
            }

            $status = 91006;
        }

        if ($this->option('name')) {
            $user->name = $this->option('name');
        }

        if ($this->option('password')) {
            $user->password = bcrypt($this->option('password'));
        }

        if ($this->option('role-id')) {
            $user->role_id = $this->option('role-id');
        }

        if ($status === 0
            && $this->option('restore') === 'yes'
        ) {

            if (! $user->restore()) {
                $this->error("{$uuid} error Error while restore user");

                $status = 91007;
            } else {
                $this->info("{$uuid} success restored user {$this->argument('email')}");
            }

        } else
        if ($status === 0) {

            if (! $user->save()) {
                $this->error("{$uuid} error Error while saving data in database");

                $status = 91008;
            } else {
                $this->info("{$uuid} success modified user {$this->argument('email')}");
            }

        }

        $this->info("{$uuid} end");

        return $status;
    }
}
