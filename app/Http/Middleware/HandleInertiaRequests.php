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
                'current_month' => \Carbon\Carbon::now()->translatedFormat('F'),
                'is_all_stock_fulfilled' => (function() use ($isEvent) {
                    $limit = $isEvent 
                        ? \App\Models\Setting::getSetting('limit_stok_event', 50) 
                        : \App\Models\Setting::getSetting('limit_stok_normal', 10);
                    
                    // Check if there are ANY items below the limit
                    $lowStockCount = \App\Models\Barang::where('stok', '<', $limit)->count();
                    return $lowStockCount === 0;
                })(),
            ],
            'flash' => [
                'message' => $request->session()->get('message'),
                'error' => $request->session()->get('error'),
            ],
        ];
    }
}
