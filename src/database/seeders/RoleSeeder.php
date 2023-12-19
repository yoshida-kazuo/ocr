<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('roles')
            ->insert([
                [
                    'id'                => 3,
                    'role'              => 'root',
                    'redirect_route'    => 'root.dashboard',
                    'created_at'        => now(),
                    'updated_at'        => now(),
                ], [
                    'id'                => 6,
                    'role'              => 'admin',
                    'redirect_route'    => 'admin.dashboard',
                    'created_at'        => now(),
                    'updated_at'        => now(),
                ], [
                    'id'                => 9,
                    'role'              => 'user',
                    'redirect_route'    => 'user.dashboard',
                    'created_at'        => now(),
                    'updated_at'        => now(),
                ],
            ]);
    }
}
