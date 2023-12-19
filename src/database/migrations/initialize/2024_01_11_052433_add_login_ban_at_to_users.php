<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table(table: 'users', callback: function (Blueprint $table) {
            $table->timestamp(column: 'login_ban_at')
                ->nullable()
                ->default(value: null)
                ->after(column: 'remember_token')
                ->comment(comment: 'ログイン禁止日時')
                ->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table(table: 'users', callback: function (Blueprint $table) {
            $table->dropColumn(columns: 'login_ban_at');
        });
    }
};
