<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use App\Models\Kategori;
use App\Models\Supplier;
use App\Models\BarangMasuk;
use App\Models\BarangKeluar;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        // =========================
        // STATISTIK UTAMA
        // =========================
        $stats = [
            'total_barang' => Barang::count(),
            'total_kategori' => Kategori::count(),
            'total_supplier' => Supplier::count(),
            'masuk_today' => BarangMasuk::whereDate('tanggal_masuk', Carbon::today())->count(),
            'keluar_today' => BarangKeluar::whereDate('tanggal_keluar', Carbon::today())->count(),
        ];

        // =========================
        // STOK RENDAH (LOGIKA DINAMIS)
        // =========================
        $bulan = Carbon::now()->month;
        $stokMinimum = in_array($bulan, [6, 7, 8]) ? 50 : 10;

        $lowStockItems = Barang::with(['satuan', 'kategori'])
            ->get()
            ->filter(function ($item) use ($stokMinimum) {
                return $item->stok <= $stokMinimum;
            })
            ->take(5)
            ->values();

        // =========================
        // DATA GRAFIK (6 BULAN TERAKHIR)
        // =========================
        $chartData = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $monthName = $date->translatedFormat('F');
            $yearMonth = $date->format('Y-m');

            $masuk = BarangMasuk::where('tanggal_masuk', 'like', "$yearMonth%")->sum('jumlah');
            $keluar = BarangKeluar::where('tanggal_keluar', 'like', "$yearMonth%")->sum('jumlah');

            $chartData[] = [
                'name' => $monthName,
                'masuk' => (int)$masuk,
                'keluar' => (int)$keluar,
            ];
        }

        // =========================
        // AKTIVITAS TERBARU
        // =========================
        $recentMasuk = BarangMasuk::with('barang')->latest()->take(5)->get()->map(function($item) {
            return [
                'type' => 'masuk',
                'title' => 'Barang Masuk: ' . ($item->barang->nama_barang ?? 'Unknown'),
                'desc' => "Jumlah +{$item->jumlah}",
                'time' => $item->created_at->diffForHumans(),
            ];
        });

        $recentKeluar = BarangKeluar::with('barang')->latest()->take(5)->get()->map(function($item) {
            return [
                'type' => 'keluar',
                'title' => 'Barang Keluar: ' . ($item->barang->nama_barang ?? 'Unknown'),
                'desc' => "Jumlah -{$item->jumlah}",
                'time' => $item->created_at->diffForHumans(),
            ];
        });

        $activities = $recentMasuk->concat($recentKeluar)->sortByDesc('time')->values()->take(8);

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'lowStock' => $lowStockItems,
            'chartData' => $chartData,
            'activities' => $activities,
            'config' => [
                'stokMinimum' => $stokMinimum,
                'isRamai' => in_array($bulan, [6, 7, 8])
            ]
        ]);
    }
}
