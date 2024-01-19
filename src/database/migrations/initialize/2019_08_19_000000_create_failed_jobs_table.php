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
        Schema::create(table: 'failed_jobs', callback: function (Blueprint $table) {
            $table->id()
                ->comment(comment: 'ID');
            $table->string(column: 'uuid')
                ->unique()
                ->comment(column: 'ユニークID');
            $table->text(column: 'connection')
                ->comment(comment: '接続先');
            $table->text(column: 'queue')
                ->comment(comment: 'キュー');
            $table->longText(column: 'payload')
                ->comment(comment: 'データ');
            $table->longText(column: 'exception')
                ->comment(comment: 'エラー');
            $table->timestamp(column: 'failed_at')
                ->useCurrent()
                ->comment(comment: '失敗日時');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists(table: 'failed_jobs');
    }
};
