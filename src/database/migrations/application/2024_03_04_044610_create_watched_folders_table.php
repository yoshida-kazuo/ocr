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
        Schema::create(table: 'watched_folders', callback: function (Blueprint $table) {
            $table->id()
                ->comment('ID');
            $table->unsignedBigInteger('user_id')
                ->comment('ユーザID')
                ->index();
            $table->string('service', 32)
                ->comment('OCRサービス名')
                ->index();
            $table->string('storage', 32)
                ->nullable()
                ->comment('ストレージ')
                ->index();
            $table->string('folder_path', 255)
                ->comment('フォルダーパス');
            $table->unsignedTinyInteger('is_active')
                ->default(0)
                ->comment('有効・無効フラグ[0:無効|1:有効]')
                ->index();
            $table->timestamp('created_at')
                ->nullable()
                ->comment('登録日');
            $table->timestamp('updated_at')
                ->nullable()
                ->comment('更新日');
            $table->softDeletes()
                ->comment('削除日');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists(table: 'watched_folders');
    }
};
