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
        Schema::create(table: 'users', callback: function (Blueprint $table) {
            $table->id()
                ->comment(comment: 'ID');
            $table->string(column: 'name')
                ->comment(comment: '名前');
            $table->string(column: 'email')
                ->unique()
                ->comment(comment: 'メールアドレス');
            $table->timestamp(column: 'email_verified_at')
                ->nullable()
                ->comment(comment: 'メールアドレス確認日時');
            $table->string(column: 'password')
                ->comment('パスワード');
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists(table: 'users');
    }
};
