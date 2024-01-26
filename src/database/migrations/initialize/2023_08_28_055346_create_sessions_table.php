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
        Schema::create(table: 'sessions', callback: function (Blueprint $table) {
            $table->string(column: 'id')
                ->primary()
                ->comment(comment: 'ID');
            $table->foreignId(column: 'user_id')
                ->nullable()
                ->comment(comment: 'ユーザID')
                ->index();
            $table->string(
                    column: 'ip_address',
                    length: 45
                )
                ->nullable();
            $table->text(column: 'user_agent')
                ->nullable()
                ->comment(comment: 'ユーザエージェント');
            $table->longText(column: 'payload')
                ->comment(comment: 'データ');
            $table->integer(column: 'last_activity')
                ->comment(comment: '最終更新')
                ->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists(table: 'sessions');
    }
};
