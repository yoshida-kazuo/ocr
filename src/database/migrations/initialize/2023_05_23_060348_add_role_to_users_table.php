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
            $table->unsignedInteger(column: 'role_id')
                ->default(value: 9)
                ->after(column: 'id')
                ->comment(comment: '権限[root:3,admin:6,user:9]')
                ->index();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table(table: 'users', callback: function (Blueprint $table) {
            $table->dropColumn(
                columns: [
                    'role_id',
                    'deleted_at',
                ]
            );
        });
    }
};
