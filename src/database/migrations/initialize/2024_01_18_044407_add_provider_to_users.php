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
            $table->string(
                    column: 'provider',
                    length: 255
                )
                ->nullable()
                ->default(value: null)
                ->after(column: 'role_id')
                ->comment(comment: '外部認証カラム');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table(table: 'users', callback: function (Blueprint $table) {
            $table->dropColumn(columns: 'provider');
        });
    }
};
