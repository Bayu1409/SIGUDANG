<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Barang;

class BarangKeluar extends Model
{
    protected $table = 'barang_keluar';

    protected $fillable = [
        'barang_id',
        'tanggal_keluar',
        'jumlah',
        'dokumen'
    ];

    public function barang()
    {
        return $this->belongsTo(
            Barang::class,
            'barang_id'
        );
    }
}