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
        Schema::create(table: 'posts', callback: function (Blueprint $table) {
            $table->id()
                ->comment(comment: 'ID');
            $table->unsignedBigInteger(column: 'post_id')
                ->nullable()
                ->default(value: null)
                ->comment(comment: '返信先ID');
            $table->unsignedBigInteger(column: 'user_id')
                ->comment(comment: 'ユーザID');
            $table->string(
                    column: 'body',
                    length: 3000
                )
                ->comment(comment: '投稿内容');
            $table->timestamps();
            $table->softDeletes(column: 'deleted_at')
                ->nullable()
                ->default(null)
                ->comment('削除日時');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists(table: 'posts');
    }
};
