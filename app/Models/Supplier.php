<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{

    protected $fillable = [

        'nama_supplier',
        'alamat',
        'telepon',
        'email'

    ];

    // Relasi ke barang (nanti dipakai)
    public function barang()
    {
        return $this->hasMany(Barang::class);
    }

}