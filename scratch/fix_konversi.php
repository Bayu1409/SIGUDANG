<?php
use App\Models\Barang;
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$barangs = Barang::with('satuan')->get();
$count = 0;
foreach ($barangs as $b) {
    if (!$b->satuan) continue;
    $name = strtolower($b->satuan->nama);
    $old = $b->nilai_konversi;
    if (strpos($name, 'pack') !== false) {
        $b->nilai_konversi = 100;
    } elseif (strpos($name, 'kodi') !== false) {
        $b->nilai_konversi = 20;
    }
    
    if ($b->isDirty('nilai_konversi')) {
        $b->save();
        echo "Updated {$b->nama_barang}: {$old} -> {$b->nilai_konversi}\n";
        $count++;
    }
}
echo "Total updated: $count\n";
