<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KategoriBarang extends Model
{
    protected $fillable = [
        'nama_kategori',
        'deskripsi'
    ];

    // Relasi ke Barang
    public function barang()
    {
        return $this->hasMany(Barang::class);
    }
}