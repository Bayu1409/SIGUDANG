<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BarangMasuk extends Model
{

    protected $table = 'barang_masuk';

    protected $fillable = [
        'barang_id',
        'tanggal_masuk',
        'jumlah',
        'dokumen'
    ];

    /*
    RELASI KE BARANG
    */

    public function barang()
    {
        return $this->belongsTo(
            Barang::class,
            'barang_id'
        );
    }

}