<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\Setting;

class StokController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->search;
        $kategoriId = $request->kategori_id;

        $barangPaginated = Barang::with([
            'kategori',
            'satuan',
            'barangMasuk.supplier',
            'barangKeluar'
        ])
        ->when($search, function ($query, $search) {
            $query->where('nama_barang', 'like', "%{$search}%")
                  ->orWhere('kode_barang', 'like', "%{$search}%")
                  ->orWhereHas('kategori', function($q) use ($search) {
                      $q->where('nama_kategori', 'like', "%{$search}%");
                  });
        })
        ->when($kategoriId, function ($query, $kategoriId) {
            $query->where('kategori_id', $kategoriId);
        })
        ->paginate(10)
        ->withQueryString();

        $barangPaginated->getCollection()->transform(function ($item) {
            $masuk = $item->barangMasuk->sum('jumlah');
            $keluar = $item->barangKeluar->sum('jumlah');
            $stok = $masuk - $keluar;

            // Breakdown barang masuk per supplier
            $supplierBreakdown = $item->barangMasuk
                ->groupBy('supplier_id')
                ->map(function ($transaksi) {
                    $supplier = $transaksi->first()->supplier;
                    return [
                        'nama_supplier' => $supplier?->nama_supplier ?? 'Tidak Diketahui',
                        'total_jumlah'  => $transaksi->sum('jumlah'),
                        'jumlah_transaksi' => $transaksi->count(),
                        'terakhir_masuk' => $transaksi->max('created_at'),
                    ];
                })
                ->values();

            return [
                'id'          => $item->id,
                'kode_barang' => $item->kode_barang,
                'nama_barang' => $item->nama_barang,
                'kategori'    => $item->kategori->nama_kategori ?? '-',
                'satuan'      => $item->satuan->nama ?? '-',
                'masuk'       => $masuk,
                'keluar'      => $keluar,
                'stok'        => $stok,
                'nilai_konversi' => $item->nilai_konversi ?: 1,
                'total_unit'  => $stok * ($item->nilai_konversi ?: 1),
                'batas_minimum' => $item->batas_minimum,
                'supplier_breakdown' => $supplierBreakdown,
            ];
        });

        return Inertia::render(
            'Stok/Index',
            [
                'barang'  => $barangPaginated,
                'filters' => $request->only(['search', 'kategori_id']),
                'kategoris' => \App\Models\Kategori::all(),
                'config'  => [
                    'stokMinimum' => self::getActiveStokMinimum()
                ]
            ]
        );
    }

    private static function getActiveStokMinimum()
    {
        $bulan = Carbon::now()->month;
        $eventMonths = Setting::getSetting('event_months', [6, 7, 8]);

        return in_array($bulan, $eventMonths)
            ? Setting::getSetting('limit_stok_event', 50)
            : Setting::getSetting('limit_stok_normal', 10);
    }
}
