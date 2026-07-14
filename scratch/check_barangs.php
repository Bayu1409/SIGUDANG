<?php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Barang;

$barangs = Barang::all();
foreach ($barangs as $b) {
    echo "ID: {$b->id} | Name: {$b->nama_barang} | Foto: {$b->foto}\n";
}
