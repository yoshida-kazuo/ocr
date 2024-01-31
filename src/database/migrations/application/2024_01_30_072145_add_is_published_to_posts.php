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
        Schema::table(table: 'posts', callback: function (Blueprint $table) {
            $table->unsignedTinyInteger(column: 'is_published')
                ->default(value: 0)
                ->comment(comment: '公開フラグ[0:非公開,1:公開]')
                ->index()
                ->after('body');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table(table: 'posts', callback: function (Blueprint $table) {
            $table->dropColumn(columns: 'is_published');
        });
    }
};
