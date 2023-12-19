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
        Schema::create(table: 'auth_providers', callback: function (Blueprint $table) {
            $table->id()
                ->comment(comment: 'ID');
            $table->unsignedBigInteger(column: 'provider_id')
                ->comment(comment: '外部連携ID')
                ->index();
            $table->unsignedBigInteger(column: 'user_id')
                ->comment(comment: 'ユーザID')
                ->index();
            $table->string(
                    column: 'provider_user_id',
                    length: 255
                )
                ->comment(comment: '外部連携ユーザID');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists(table: 'auth_providers');
    }
};
