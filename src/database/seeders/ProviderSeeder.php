<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProviderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('providers')
            ->insert([
                [
                    'id'            => 1,
                    'name'          => 'google',
                    'created_at'    => now(),
                    'updated_at'    => now(),
                ], [
                    'id'            => 2,
                    'name'          => 'x',
                    'created_at'    => now(),
                    'updated_at'    => now(),
                ], [
                    'id'            => 3,
                    'name'          => 'github',
                    'created_at'    => now(),
                    'updated_at'    => now(),
                ], [
                    'id'            => 4,
                    'name'          => 'twitch',
                    'created_at'    => now(),
                    'updated_at'    => now(),
                ],
            ]);
    }
}
