<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\LogService;

class SettingController extends Controller
{
    public function index()
    {
        $settings = [
            'event_months' => Setting::getSetting('event_months', []),
            'limit_stok_normal' => Setting::getSetting('limit_stok_normal', 10),
            'limit_stok_event' => Setting::getSetting('limit_stok_event', 50),
            'limit_dead_stock' => Setting::getSetting('limit_dead_stock', 30),
        ];

        return Inertia::render('Setting/Index', [
            'settings' => $settings
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'event_months' => 'array',
            'limit_stok_normal' => 'required|integer|min:0',
            'limit_stok_event' => 'required|integer|min:0',
            'limit_dead_stock' => 'required|integer|min:0',
        ]);

        Setting::setSetting('event_months', $request->event_months ?? [], 'json');
        Setting::setSetting('limit_stok_normal', $request->limit_stok_normal, 'integer');
        Setting::setSetting('limit_stok_event', $request->limit_stok_event, 'integer');
        Setting::setSetting('limit_dead_stock', $request->limit_dead_stock, 'integer');

        LogService::log("Memperbarui konfigurasi sistem (Bulan Event & Limit Stok)", 'Setting', 1);

        return redirect()->back()->with('success', 'Pengaturan berhasil disimpan!');
    }
}
