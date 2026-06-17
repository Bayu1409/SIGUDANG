<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use App\Models\Setting;
use Inertia\Inertia;
use Illuminate\Http\Request;

class StokMinimumController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $kategoriId = $request->input('kategori_id');
        
        $isEvent = Setting::isEventMonth();
        $limitDefault = $isEvent 
            ? Setting::getSetting('limit_stok_event', 50) 
            : Setting::getSetting('limit_stok_normal', 10);

        $barang = Barang::with(['kategori', 'satuan'])
            ->when($search, function ($query, $search) {
                $query->where('nama_barang', 'like', "%{$search}%")
                      ->orWhere('kode_barang', 'like', "%{$search}%");
            })
            ->when($kategoriId, function($q) use ($kategoriId) {
                $q->where('kategori_id', $kategoriId);
            })
            ->get()
            ->filter(function ($item) use ($limitDefault) {
                // Konversi stok ke satuan terkecil (Unit/Biji)
                $totalUnitSaatIni = $item->stok * ($item->nilai_konversi ?: 1);

                // Hitung ambang batas dalam satuan terkecil
                // Jika ada batas_minimum spesifik, asumsikan itu dalam satuan barangnya (misal: 1 kodi)
                // maka dikalikan nilai_konversi. Jika 0, gunakan global limit (sudah dalam Unit).
                $thresholdUnit = ($item->batas_minimum > 0) 
                    ? ($item->batas_minimum * ($item->nilai_konversi ?: 1)) 
                    : $limitDefault;
                
                return $totalUnitSaatIni < $thresholdUnit;
            })
            ->values();

        return Inertia::render('StokMinimum/Index', [
            'barang' => $barang,
            'limit' => $limitDefault,
            'kategoris' => \App\Models\Kategori::all(),
            'is_event_month' => $isEvent,
            'filters' => [
                'search' => $search,
                'kategori_id' => $kategoriId
            ]
        ]);
    }
}
