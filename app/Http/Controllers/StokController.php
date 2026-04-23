<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use Inertia\Inertia;
use Illuminate\Http\Request;

class StokController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->search;

        $barangPaginated = Barang::with([
            'kategori',
            'satuan',
            'barangMasuk',
            'barangKeluar'
        ])
        ->when($search, function ($query, $search) {
            $query->where('nama_barang', 'like', "%{$search}%")
                  ->orWhere('kode_barang', 'like', "%{$search}%")
                  ->orWhereHas('kategori', function($q) use ($search) {
                      $q->where('nama_kategori', 'like', "%{$search}%");
                  });
        })
        ->paginate(10)
        ->withQueryString();

        $barangPaginated->getCollection()->transform(function ($item) {
            $masuk = $item->barangMasuk->sum('jumlah');
            $keluar = $item->barangKeluar->sum('jumlah');
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
                'barang' => $barangPaginated,
                'filters' => $request->only(['search'])
            ]
        );
    }
}
