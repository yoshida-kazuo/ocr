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
        Schema::create(table: 'roles', callback: function (Blueprint $table) {
            $table->integer(column: 'id', unsigned: true)
                ->primary()
                ->comment(comment: 'ID');
            $table->string(column: 'role', length: 16)
                ->comment(comment: '権限');
            $table->string(column: 'redirect_route', length: 16)
                ->comment(comment: 'リダイレクトルート');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists(table: 'roles');
    }
};
