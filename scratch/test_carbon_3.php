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

echo "LastDate->diffInDays(Today) cast to int: " . (int)$lastDate->diffInDays($today) . "\n";
