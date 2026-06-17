<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
                        'auth' => [
                'user' => $request->user(),
            ],
            'event' => [
                'is_event_month' => ($isEvent = \App\Models\Setting::isEventMonth()),
                'current_month' => (function() {
                    $months = [
                        1 => 'Januari', 2 => 'Februari', 3 => 'Maret', 4 => 'April',
                        5 => 'Mei', 6 => 'Juni', 7 => 'Juli', 8 => 'Agustus',
                        9 => 'September', 10 => 'Oktober', 11 => 'November', 12 => 'Desember'
                    ];
                    return $months[\Carbon\Carbon::now()->month];
                })(),
                'is_all_stock_fulfilled' => (function() use ($isEvent) {
                    $limit = $isEvent 
                        ? \App\Models\Setting::getSetting('limit_stok_event', 50) 
                        : \App\Models\Setting::getSetting('limit_stok_normal', 10);
                    
                    // Gunakan raw query agar performa tetap terjaga namun akurat secara konversi
                    return \App\Models\Barang::whereRaw('(stok * nilai_konversi) >= ? AND batas_minimum = 0', [$limit])
                        ->orWhereRaw('(stok * nilai_konversi) >= (batas_minimum * nilai_konversi) AND batas_minimum > 0')
                        ->count() === \App\Models\Barang::count();
                })(),
                'low_stock_items' => (function() use ($isEvent) {
                    $limit = $isEvent 
                        ? \App\Models\Setting::getSetting('limit_stok_event', 50) 
                        : \App\Models\Setting::getSetting('limit_stok_normal', 10);
                    
                    // Ambil barang yang memenuhi kriteria stok rendah (setelah konversi)
                    return \App\Models\Barang::where(function($query) use ($limit) {
                            $query->whereRaw('(stok * nilai_konversi) < ?', [$limit])
                                  ->where('batas_minimum', 0);
                        })
                        ->orWhere(function($query) {
                            $query->whereRaw('(stok * nilai_konversi) < (batas_minimum * nilai_konversi)')
                                  ->where('batas_minimum', '>', 0);
                        })
                        ->select('id', 'nama_barang', 'stok', 'kode_barang', 'nilai_konversi', 'batas_minimum')
                        ->get();
                })(),
            ],
            'flash' => [
                'message' => $request->session()->get('message'),
                'error' => $request->session()->get('error'),
            ],
        ];
    }
}
