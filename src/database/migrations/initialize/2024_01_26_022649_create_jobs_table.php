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
        Schema::create(table: 'jobs', callback: function (Blueprint $table) {
            $table->bigIncrements(column: 'id')
                ->comment(comment: 'ID');
            $table->string(column: 'queue')
                ->index()
                ->comment(comment: 'キュー');
            $table->longText(column: 'payload')
                ->comment(comment: 'ペイロード');
            $table->unsignedTinyInteger(column: 'attempts')
                ->comment(comment: '試行回数');
            $table->unsignedInteger(column: 'reserved_at')
                ->nullable()
                ->comment(comment: '開始日時');
            $table->unsignedInteger(column: 'available_at')
                ->comment(comment: '追加日時');
            $table->unsignedInteger(column: 'created_at')
                ->comment(comment: '登録日時');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists(table: 'jobs');
    }
};
