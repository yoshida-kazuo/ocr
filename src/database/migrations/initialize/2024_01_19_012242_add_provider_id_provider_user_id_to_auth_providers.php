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
        Schema::table(table: 'auth_providers', callback: function (Blueprint $table) {
            $table->unique(
                columns: [
                    'provider_id',
                    'provider_user_id',
                ],
                name: 'provider_id_provider_user_id_unique'
            );
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table(table: 'auth_providers', callback: function (Blueprint $table) {
            $table->dropUnique(index: 'provider_id_provider_user_id_unique');
        });
    }
};
