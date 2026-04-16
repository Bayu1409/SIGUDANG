<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use Inertia\Inertia;
use Carbon\Carbon;

class DeadStockController extends Controller
{
    public function index()
    {
        $today = Carbon::now();

        $barang = Barang::with([
            'kategori',
            'satuan',
            'barangMasuk',
            'barangKeluar'
        ])
        ->get()
        ->map(function ($item) use ($today) {

            // =========================
            // HITUNG STOK
            // =========================

            $masuk = $item->barangMasuk->sum('jumlah');
            $keluar = $item->barangKeluar->sum('jumlah');

            $stok = $masuk - $keluar;

            // =========================
            // AMBIL TRANSAKSI TERAKHIR
            // =========================

            $lastKeluar = $item->barangKeluar
                ->sortByDesc('tanggal_keluar')
                ->first();

            if ($lastKeluar) {

                $lastDate = Carbon::parse(
                    $lastKeluar->tanggal_keluar
                );

                $selisihHari =
                    $today->diffInDays($lastDate);

            } else {

                // Jika belum pernah keluar
                $selisihHari = 999;

            }

            return [
                'id' => $item->id,
                'kode_barang' => $item->kode_barang,
                'nama_barang' => $item->nama_barang,

                // PERBAIKAN NAMA FIELD
                'kategori' => $item->kategori->nama_kategori ?? '-',

                'satuan' => $item->satuan->nama_satuan ?? '-',

                // TAMBAHAN STOK
                'stok' => $stok,

                'hari' => $selisihHari,
            ];
        })
        ->filter(function ($item) {

            // Dead Stock:
            // > 30 hari dan stok masih ada

            return $item['hari'] > 30
                && $item['stok'] > 0;

        })
        ->values();

        return Inertia::render(
            'DeadStock/Index',
            [
                'barang' => $barang
            ]
        );
    }
}