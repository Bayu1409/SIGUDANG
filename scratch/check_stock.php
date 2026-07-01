<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Barang;

$items = Barang::with(['barangMasuk', 'barangKeluar'])->get();
foreach ($items as $b) {
    echo "Item: {$b->nama_barang}\n";
    echo "  Column Stok: {$b->stok}\n";
    echo "  Calc Masuk: " . $b->barangMasuk->sum('jumlah') . "\n";
    echo "  Calc Keluar: " . $b->barangKeluar->sum('jumlah') . "\n";
    echo "  Diff (Masuk - Keluar): " . ($b->barangMasuk->sum('jumlah') - $b->barangKeluar->sum('jumlah')) . "\n";
    echo "-------------------\n";
}
