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
        Schema::create('ocr_pages_results', function (Blueprint $table) {
            $table->id()
                ->comment('ID');
            $table->unsignedBigInteger('ocr_result_id')
                ->comment('解析ID')
                ->index();
            $table->unsignedBigInteger('user_id')
                ->nullable()
                ->comment('ユーザID')
                ->index();
            $table->unsignedInteger('page_number')
                ->comment('ページ番号')
                ->index();
            $table->json('extracted_text')
                ->nullable()
                ->comment('解析結果');
            $table->text('full_text')
                ->nullable()
                ->comment('全文');
            $table->timestamp('created_at')
                ->nullable()
                ->comment('登録日');
            $table->timestamp('updated_at')
                ->nullable()
                ->comment('更新日');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ocr_pages_results');
    }
};
