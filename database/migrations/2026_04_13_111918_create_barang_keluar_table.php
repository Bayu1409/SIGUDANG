<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('barang_keluar', function (Blueprint $table) {

            $table->id();

            $table->foreignId('barang_id')
                ->constrained('barangs')
                ->cascadeOnDelete();

            $table->date('tanggal_keluar');

            $table->integer('jumlah');

            $table->string('dokumen')
                ->nullable();

            $table->timestamps();

        });
    }

    public function down(): void
    {
        Schema::dropIfExists('barang_keluar');
    }
};