<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kategori extends Model
{
    // Arahkan ke tabel yang benar
    protected $table = 'kategori_barangs';

    protected $fillable = [
        'nama_kategori'
    ];
}