<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('barang_masuk', function (Blueprint $table) {

            $table->id();

            // 🔥 SESUAIKAN DENGAN NAMA TABEL BARANG

            $table->foreignId('barang_id')
                ->constrained('barangs') // biasanya barangs
                ->cascadeOnDelete();

            $table->date('tanggal_masuk');

            $table->integer('jumlah');

            $table->string('dokumen')->nullable();

            $table->timestamps();

        });
    }

    public function down(): void
    {
        Schema::dropIfExists('barang_masuk');
    }
};