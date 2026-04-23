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
        
        $isEvent = Setting::isEventMonth();
        $limitDefault = $isEvent 
            ? Setting::getSetting('limit_stok_event', 50) 
            : Setting::getSetting('limit_stok_normal', 10);

        $barang = Barang::with(['kategori', 'satuan'])
            ->when($search, function ($query, $search) {
                $query->where('nama_barang', 'like', "%{$search}%")
                      ->orWhere('kode_barang', 'like', "%{$search}%");
            })
            ->get()
            ->filter(function ($item) use ($limitDefault) {
                // Return items where stock is below limit
                return $item->stok < $limitDefault;
            })
            ->values();

        return Inertia::render('StokMinimum/Index', [
            'barang' => $barang,
            'limit' => $limitDefault,
            'is_event_month' => $isEvent,
            'filters' => [
                'search' => $search
            ]
        ]);
    }
}
