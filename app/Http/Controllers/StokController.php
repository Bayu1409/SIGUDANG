<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use Inertia\Inertia;

class StokController extends Controller
{
    public function index()
    {
        $barang = Barang::with([
            'kategori',
            'satuan',
            'barangMasuk',
            'barangKeluar'
        ])
            ->get()
            ->map(function ($item) {

                // Hitung total masuk
                $masuk = $item->barangMasuk->sum('jumlah');

                // Hitung total keluar
                $keluar = $item->barangKeluar->sum('jumlah');

                // Hitung stok
                $stok = $masuk - $keluar;

                return [
                    'id' => $item->id,
                    'kode_barang' => $item->kode_barang,
                    'nama_barang' => $item->nama_barang,
                    'kategori' => $item->kategori->nama_kategori ?? '-',
                    'satuan' => $item->satuan->nama ?? '-',
                    'masuk' => $masuk,
                    'keluar' => $keluar,
                    'stok' => $stok,
                ];
            });

        return Inertia::render(
            'Stok/Index',
            [
                'barang' => $barang
            ]
        );
    }
}
