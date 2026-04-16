<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Kategori;
use App\Models\Satuan;
use App\Models\BarangMasuk;
use App\Models\BarangKeluar;

class Barang extends Model
{
    protected $table = 'barangs';

    protected $fillable = [
        'kode_barang',
        'nama_barang',
        'kategori_id',
        'satuan_id',
        'supplier_id',
        'stok'
    ];

    // =========================
    // RELASI KATEGORI
    // =========================

    public function kategori()
    {
        return $this->belongsTo(
            Kategori::class,
            'kategori_id'
        );
    }

    // =========================
    // RELASI SATUAN
    // =========================

    public function satuan()
    {
        return $this->belongsTo(
            Satuan::class,
            'satuan_id'
        );
    }

    // =========================
    // RELASI BARANG MASUK
    // =========================

    public function barangMasuk()
    {
        return $this->hasMany(
            BarangMasuk::class,
            'barang_id'
        );
    }

    // =========================
    // RELASI BARANG KELUAR
    // =========================

    public function barangKeluar()
    {
        return $this->hasMany(
            BarangKeluar::class,
            'barang_id'
        );
    }
}