<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up(): void
    {
        Schema::create(table: 'posts', callback: function (Blueprint $table) {
            $table->id()
                ->comment(comment: 'ID');
            $table->unsignedBigInteger(column: 'post_id')
                ->nullable()
                ->default(value: null)
                ->comment(comment: '返信先ID')
                ->index();
            $table->unsignedBigInteger(column: 'user_id')
                ->comment(comment: 'ユーザID')
                ->index();
            $table->string(
                    column: 'topic_type',
                    length: 64
                )
                ->comment(comment: 'トピックタイプ')
                ->index();
            $table->string(
                    column: 'body',
                    length: 12000
                )
                ->comment(comment: '投稿内容');
            $table->unsignedTinyInteger(column: 'is_published')
                ->default(value: 0)
                ->comment(comment: '公開フラグ[0:非公開,1:公開]')
                ->index();
            $table->timestamps();
            $table->softDeletes(column: 'deleted_at')
                ->nullable()
                ->default(null)
                ->comment('削除日時');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        Schema::dropIfExists(table: 'posts');
    }

};
