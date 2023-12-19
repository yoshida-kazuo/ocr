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
    public function up()
    {
        Schema::create('activities', function (Blueprint $table) {
            $table->id()
                ->comment('ID');
            $table->bigInteger('user_id')
                ->nullable()
                ->comment('ユーザID')
                ->index();
            $table->string('type', 16)
                ->default('info')
                ->comment('操作タイプ [dev|info|error]')
                ->index();
            $table->string('message', 2003)
                ->comment('操作');
            $table->timestamp('created_at')
                ->useCurrent()
                ->comment('操作日時');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('activities');
    }
};
