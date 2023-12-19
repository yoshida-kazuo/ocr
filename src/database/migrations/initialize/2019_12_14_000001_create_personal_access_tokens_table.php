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
        Schema::create(table: 'personal_access_tokens', callback: function (Blueprint $table) {
            $table->id()
                ->comment(comment: 'ID');
            $table->morphs(name: 'tokenable');
            $table->string(column: 'name')
                ->comment(comment: 'アクセス名');
            $table->string(
                    column: 'token',
                    length: 64
                )
                ->unique()
                ->comment(comment: 'トークン');
            $table->text(column: 'abilities')
                ->nullable()
                ->comment(comment: 'アビリティ');
            $table->timestamp(column: 'last_used_at')
                ->nullable()
                ->comment(comment: '最終更新日時');
            $table->timestamp(column: 'expires_at')
                ->nullable()
                ->comment(comment: '有効期限');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists(table: 'personal_access_tokens');
    }
};
