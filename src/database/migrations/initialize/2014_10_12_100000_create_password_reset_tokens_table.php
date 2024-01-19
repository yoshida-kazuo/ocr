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
        Schema::create(table: 'password_reset_tokens', callback: function (Blueprint $table) {
            $table->string(column: 'email')
                ->primary()
                ->comment(comment: 'メールアドレス');
            $table->string(column: 'token')
                ->comment(comment: 'トークン');
            $table->timestamp(column: 'created_at')
                ->nullable()
                ->comment(comment: '登録日時');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists(table: 'password_reset_tokens');
    }
};
