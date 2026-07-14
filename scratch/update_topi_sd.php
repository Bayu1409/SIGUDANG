<?php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Barang;

$barang = Barang::where('nama_barang', 'like', '%Topi Sd%')->first();
if ($barang) {
    $barang->foto = 'barang/topi_sd.png';
    $barang->save();
    echo "Successfully updated Topi SD photo path to: " . $barang->foto . "\n";
} else {
    echo "Topi SD not found in the database.\n";
}
