<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use Inertia\Inertia;
use Carbon\Carbon;

class StokMinimumController extends Controller
{
    public function index()
    {
        $bulan = Carbon::now()->month;

        // Bulan ramai pramuka
        $bulanRamai = [6, 7, 8];

        // Tentukan stok minimum
        if (in_array($bulan, $bulanRamai)) {

            $stokMinimum = 50;
            $statusBulan = "Musim Ramai";

        } else {

            $stokMinimum = 10;
            $statusBulan = "Normal";

        }

        $barang = Barang::with([
            'kategori',
            'satuan',
            'barangMasuk',
            'barangKeluar'
        ])
        ->get()
        ->map(function ($item) use ($stokMinimum) {

            $masuk = $item->barangMasuk->sum('jumlah');
            $keluar = $item->barangKeluar->sum('jumlah');

            $stok = $masuk - $keluar;

            return [
                'id' => $item->id,
                'kode_barang' => $item->kode_barang,
                'nama_barang' => $item->nama_barang,
                'kategori' => $item->kategori->nama_kategori ?? '-',
                'satuan' => $item->satuan->nama ?? '-',
                'stok' => $stok,
                'status' => $stok <= $stokMinimum
                                ? 'Minimum'
                                : 'Aman',
            ];
        })
        ->filter(function ($item) use ($stokMinimum) {

            return $item['stok'] <= $stokMinimum;

        })
        ->values();

        return Inertia::render(
            'StokMinimum/Index',
            [
                'barang' => $barang,
                'stokMinimum' => $stokMinimum,
                'statusBulan' => $statusBulan
            ]
        );
    }
}