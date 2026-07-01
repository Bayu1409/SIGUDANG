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
use App\Models\Setting;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $kategoriId = $request->kategori_id;

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
        $eventMonths = Setting::getSetting('event_months', [6, 7, 8]);
        
        $isEventMonth = in_array($bulan, $eventMonths);
        $stokMinimum = $isEventMonth 
            ? Setting::getSetting('limit_stok_event', 50) 
            : Setting::getSetting('limit_stok_normal', 10);

        // =========================
        // DEAD STOCK (RINGKAS)
        // =========================
        $today = Carbon::now();
        $limitDeadStock = Setting::getSetting('limit_dead_stock', 30);
        
        $deadStockCount = Barang::with(['barangKeluar'])
            ->get()
            ->filter(function ($item) use ($today, $limitDeadStock) {
                $lastKeluar = $item->barangKeluar->sortByDesc('tanggal_keluar')->first();
                if ($lastKeluar) {
                    $lastDate = Carbon::parse($lastKeluar->tanggal_keluar);
                    $selisihHari = (int) $lastDate->diffInDays($today);
                } else {
                    $selisihHari = 999;
                }
                return $selisihHari > $limitDeadStock && $item->stok > 0;
            })
            ->count();

        $lowStockItems = Barang::with(['satuan', 'kategori'])
            ->when($kategoriId, function($q) use ($kategoriId) {
                $q->where('kategori_id', $kategoriId);
            })
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
            $monthNamesId = [
                1 => 'Januari', 2 => 'Februari', 3 => 'Maret', 4 => 'April',
                5 => 'Mei', 6 => 'Juni', 7 => 'Juli', 8 => 'Agustus',
                9 => 'September', 10 => 'Oktober', 11 => 'November', 12 => 'Desember'
            ];
            $monthName = $monthNamesId[$date->month];
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

        // =========================
        // DATA GRAFIK SUPPLIER (TOP 5)
        // =========================
        $supplierChartData = DB::table('barang_masuk')
            ->join('suppliers', 'barang_masuk.supplier_id', '=', 'suppliers.id')
            ->select('suppliers.nama_supplier', DB::raw('SUM(barang_masuk.jumlah) as total'))
            ->groupBy('suppliers.id', 'suppliers.nama_supplier')
            ->orderByDesc('total')
            ->take(5)
            ->get()
            ->map(function($item) {
                return [
                    'name' => $item->nama_supplier,
                    'count' => (int)$item->total
                ];
            });

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'lowStock' => $lowStockItems,
            'kategoris' => Kategori::all(),
            'filters' => $request->only(['kategori_id']),
            'chartData' => $chartData,
            'supplierChartData' => $supplierChartData,
            'activities' => $activities,
            'config' => [
                'stokMinimum' => $stokMinimum,
                'isRamai' => $isEventMonth,
                'deadStockCount' => $deadStockCount
            ]
        ]);
    }
}
