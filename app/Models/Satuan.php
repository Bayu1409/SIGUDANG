<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Satuan extends Model
{
    protected $fillable = [
        'nama',
        'nilai_konversi_default'
    ];

    public function barangs()
    {
        return $this->hasMany(Barang::class, 'satuan_id');
    }
}
