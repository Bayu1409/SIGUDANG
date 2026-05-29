<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use App\Models\Setting;
use Inertia\Inertia;
use Carbon\Carbon;

class DeadStockController extends Controller
{
    public function index(Illuminate\Http\Request $request)
    {
        $today = Carbon::now();
        $limitDeadStock = Setting::getSetting('limit_dead_stock', 30);
        $search = $request->search;
        $kategoriId = $request->kategori_id;

        $barang = Barang::with(['kategori', 'satuan', 'barangMasuk', 'barangKeluar'])
            ->when($search, function($q) use ($search) {
                $q->where('nama_barang', 'like', "%{$search}%")->orWhere('kode_barang', 'like', "%{$search}%");
            })
            ->when($kategoriId, function($q) use ($kategoriId) {
                $q->where('kategori_id', $kategoriId);
            })
            ->get()
            ->map(function ($item) use ($today, $limitDeadStock) {
                $masuk = $item->barangMasuk->sum('jumlah');
                $keluar = $item->barangKeluar->sum('jumlah');
                $stok = $masuk - $keluar;

                $lastKeluar = $item->barangKeluar->sortByDesc('tanggal_keluar')->first();
                if ($lastKeluar) {
                    $lastDate = Carbon::parse($lastKeluar->tanggal_keluar);
                    $selisihHari = $today->diffInDays($lastDate);
                } else {
                    $selisihHari = 999; // Sangat lama/belum pernah
                }

                return [
                    'id' => $item->id,
                    'kode_barang' => $item->kode_barang,
                    'nama_barang' => $item->nama_barang,
                    'kategori' => $item->kategori->nama_kategori ?? '-',
                    'satuan' => $item->satuan->nama ?? '-',
                    'stok' => $stok,
                    'hari' => $selisihHari,
                ];
            })
            ->filter(function ($item) use ($limitDeadStock) {
                return $item['hari'] > $limitDeadStock && $item['stok'] > 0;
            })
            ->values();

        return Inertia::render('DeadStock/Index', [
            'barang' => $barang,
            'limit_dead_stock' => $limitDeadStock,
            'kategoris' => \App\Models\Kategori::all(),
            'filters' => $request->only(['search', 'kategori_id'])
        ]);
    }
}
