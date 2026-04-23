<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use App\Models\Setting;
use Inertia\Inertia;
use Carbon\Carbon;

class DeadStockController extends Controller
{
    public function index()
    {
        $today = Carbon::now();
        $limitDeadStock = Setting::getSetting('limit_dead_stock', 30);

        $barang = Barang::with([
            'kategori',
            'satuan',
            'barangMasuk',
            'barangKeluar'
        ])
        ->get()
        ->map(function ($item) use ($today, $limitDeadStock) {

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

                // Jika belum pernah keluar, anggap sudah melampaui limit agar muncul di list
                $selisihHari = $limitDeadStock + 1;

            }

            return [
                'id' => $item->id,
                'kode_barang' => $item->kode_barang,
                'nama_barang' => $item->nama_barang,

                // PERBAIKAN NAMA FIELD
                'kategori' => $item->kategori->nama_kategori ?? '-',

                'satuan' => $item->satuan->nama ?? '-',

                // TAMBAHAN STOK
                'stok' => $stok,

                'hari' => $selisihHari,
            ];
        })
        ->filter(function ($item) use ($limitDeadStock) {

            // Dead Stock:
            // > limit_dead_stock hari dan stok masih ada

            return $item['hari'] > $limitDeadStock
                && $item['stok'] > 0;

        })
        ->values();

        return Inertia::render(
            'DeadStock/Index',
            [
                'barang' => $barang,
                'limit_dead_stock' => $limitDeadStock
            ]
        );
    }
}
