<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Supplier;

class BarangMasuk extends Model
{

    protected $table = 'barang_masuk';

    protected $fillable = [
        'barang_id',
        'supplier_id',
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

    /*
    RELASI KE SUPPLIER
    */

    public function supplier()
    {
        return $this->belongsTo(
            Supplier::class,
            'supplier_id'
        );
    }

}