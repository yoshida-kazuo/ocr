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
        Schema::create('ocr_results', function (Blueprint $table) {
            $table->id()
                ->comment('ID');
            $table->unsignedBigInteger('user_id')
                ->nullable()
                ->comment('ユーザID')
                ->index();
            $table->unsignedBigInteger('watched_folder_id')
                ->nullable()
                ->comment('監視フォルダID')
                ->index();
            $table->string('document_id', 255)
                ->comment('ドキュメント識別子')
                ->unique();
            $table->string('document_name', 255)
                ->nullable()
                ->comment('ドキュメント名');
            $table->string('service', 64)
                ->comment('解析サービス');
            $table->string('storage', 36)
                ->nullable()
                ->comment('ファイルストレージ');
            $table->string('file_path', 255)
                ->nullable()
                ->comment('ファイルパス');
            $table->string('page_number', 64)
                ->nullable()
                ->comment('ページ番号');
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
        Schema::dropIfExists('ocr_results');
    }
};
