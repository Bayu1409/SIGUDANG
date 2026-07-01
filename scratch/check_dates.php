<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Barang;
use Carbon\Carbon;

$today = Carbon::now();
echo "Today: " . $today->toDateString() . "\n";

$items = Barang::with(['barangKeluar'])->get();
foreach ($items as $b) {
    $lastKeluar = $b->barangKeluar->sortByDesc('tanggal_keluar')->first();
    if ($lastKeluar) {
        $lastDate = Carbon::parse($lastKeluar->tanggal_keluar);
        $diff = $today->diffInDays($lastDate);
        $lastDateStr = $lastDate->toDateString();
    } else {
        $diff = 999;
        $lastDateStr = "Never";
    }
    
    echo "Item: {$b->nama_barang}\n";
    echo "  Stok: {$b->stok}\n";
    echo "  Last Transaction: {$lastDateStr}\n";
    echo "  Diff In Days: {$diff}\n";
    echo "-------------------\n";
}
