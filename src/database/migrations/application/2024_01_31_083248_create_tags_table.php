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
        Schema::create(table: 'tags', callback: function (Blueprint $table) {
            $table->id()
                ->comment(comment: 'ID');
            $table->unsignedBigInteger(column: 'post_id')
                ->comment(comment: '投稿ID')
                ->index();
            $table->string(column: 'type')
                ->comment(comment: 'タイプ[team,game_title,...]')
                ->index();
            $table->string(column: 'name')
                ->comment(comment: 'タグ名')
                ->index();
            $table->timestamp(column: 'created_at')
                ->comment(comment: '登録日');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        Schema::dropIfExists(table: 'tags');
    }
};
