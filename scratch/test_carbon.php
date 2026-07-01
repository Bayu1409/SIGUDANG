<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Barang;
use Carbon\Carbon;

$today = Carbon::now();
$lastDateStr = "2026-06-25";
$lastDate = Carbon::parse($lastDateStr);

echo "Today: " . $today->toDateTimeString() . "\n";
echo "Last Date: " . $lastDate->toDateTimeString() . "\n";
echo "Diff In Days: " . $today->diffInDays($lastDate) . "\n";
echo "Diff In Days (absolute): " . $today->diffInDays($lastDate, true) . "\n";
echo "Diff In Days (non-absolute): " . $today->diffInDays($lastDate, false) . "\n";
