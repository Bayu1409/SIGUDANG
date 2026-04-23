<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\BarangController;
use App\Http\Controllers\KategoriBarangController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\BarangMasukController;
use App\Http\Controllers\BarangKeluarController;
use App\Http\Controllers\SatuanController;
use App\Http\Controllers\StokController;
use App\Http\Controllers\StokMinimumController;
use App\Http\Controllers\DeadStockController;
use App\Http\Controllers\LaporanController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ActivityLogController;
use App\Http\Controllers\SettingController;

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| HALAMAN AWAL
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

/*
|--------------------------------------------------------------------------
| SEMUA ROUTE SETELAH LOGIN
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified'])->group(function () {

    /*
    |--------------------------------------------------------------------------
    | DASHBOARD
    |--------------------------------------------------------------------------
    */

    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');


    /*
    |--------------------------------------------------------------------------
    | MASTER DATA
    |--------------------------------------------------------------------------
    */

    // =========================
    // BARANG
    // =========================

    Route::prefix('barang')->group(function () {

        Route::get('/', [BarangController::class, 'index'])
            ->name('barang.index');

        Route::get('/create', [BarangController::class, 'create'])
            ->name('barang.create');

        Route::post('/', [BarangController::class, 'store'])
            ->name('barang.store');

        Route::get('/{id}/edit', [BarangController::class, 'edit'])
            ->name('barang.edit');

        Route::put('/{id}', [BarangController::class, 'update'])
            ->name('barang.update');

        Route::delete('/{id}', [BarangController::class, 'destroy'])
            ->name('barang.destroy');
    });


    // =========================
    // KATEGORI BARANG
    // =========================

    Route::prefix('kategori-barang')->group(function () {

        Route::get('/', [KategoriBarangController::class, 'index'])
            ->name('kategori-barang.index');

        Route::get('/create', [KategoriBarangController::class, 'create'])
            ->name('kategori-barang.create');

        Route::post('/', [KategoriBarangController::class, 'store'])
            ->name('kategori-barang.store');

        Route::get('/{id}/edit', [KategoriBarangController::class, 'edit'])
            ->name('kategori-barang.edit');

        Route::put('/{id}', [KategoriBarangController::class, 'update'])
            ->name('kategori-barang.update');

        Route::delete('/{id}', [KategoriBarangController::class, 'destroy'])
            ->name('kategori-barang.destroy');
    });


    // =========================
    // SATUAN
    // =========================

    Route::prefix('satuan')->group(function () {

        Route::get('/', [SatuanController::class, 'index'])
            ->name('satuan.index');

        Route::get('/create', [SatuanController::class, 'create'])
            ->name('satuan.create');

        Route::post('/', [SatuanController::class, 'store'])
            ->name('satuan.store');

        Route::get('/{id}/edit', [SatuanController::class, 'edit'])
            ->name('satuan.edit');

        Route::put('/{id}', [SatuanController::class, 'update'])
            ->name('satuan.update');

        Route::delete('/{id}', [SatuanController::class, 'destroy'])
            ->name('satuan.destroy');
    });


    // =========================
    // SUPPLIER
    // =========================

    Route::prefix('supplier')->group(function () {

        Route::get('/', [SupplierController::class, 'index'])
            ->name('supplier.index');

        Route::get('/create', [SupplierController::class, 'create'])
            ->name('supplier.create');

        Route::post('/', [SupplierController::class, 'store'])
            ->name('supplier.store');

        Route::get('/{id}/edit', [SupplierController::class, 'edit'])
            ->name('supplier.edit');

        Route::put('/{id}', [SupplierController::class, 'update'])
            ->name('supplier.update');

        Route::delete('/{id}', [SupplierController::class, 'destroy'])
            ->name('supplier.destroy');
    });


    /*
    |--------------------------------------------------------------------------
    | TRANSAKSI
    |--------------------------------------------------------------------------
    */

    // =========================
    // BARANG MASUK
    // =========================

    Route::prefix('barang-masuk')->group(function () {

        Route::get('/', [BarangMasukController::class, 'index'])
            ->name('barang-masuk.index');

        Route::get('/create', [BarangMasukController::class, 'create'])
            ->name('barang-masuk.create');

        Route::post('/', [BarangMasukController::class, 'store'])
            ->name('barang-masuk.store');

        Route::get('/{id}/edit', [BarangMasukController::class, 'edit'])
            ->name('barang-masuk.edit');

        Route::put('/{id}', [BarangMasukController::class, 'update'])
            ->name('barang-masuk.update');

        Route::delete('/{id}', [BarangMasukController::class, 'destroy'])
            ->name('barang-masuk.destroy');
    });


    // =========================
    // BARANG KELUAR
    // =========================

    Route::prefix('barang-keluar')->group(function () {

        Route::get('/', [BarangKeluarController::class, 'index'])
            ->name('barang-keluar.index');

        Route::get('/create', [BarangKeluarController::class, 'create'])
            ->name('barang-keluar.create');

        Route::post('/', [BarangKeluarController::class, 'store'])
            ->name('barang-keluar.store');

        Route::get('/{id}/edit', [BarangKeluarController::class, 'edit'])
            ->name('barang-keluar.edit');

        Route::put('/{id}', [BarangKeluarController::class, 'update'])
            ->name('barang-keluar.update');

        Route::delete('/{id}', [BarangKeluarController::class, 'destroy'])
            ->name('barang-keluar.destroy');
    });


    /*
    |--------------------------------------------------------------------------
    | LAPORAN
    |--------------------------------------------------------------------------
    */

    Route::prefix('laporan')->group(function () {

        // BARANG MASUK
        Route::get('/barang-masuk', [LaporanController::class, 'barangMasuk'])
            ->name('laporan.barang-masuk');
        Route::get('/barang-masuk/export', [LaporanController::class, 'exportBarangMasuk'])
            ->name('laporan.barang-masuk.export');

        // BARANG KELUAR
        Route::get('/barang-keluar', [LaporanController::class, 'barangKeluar'])
            ->name('laporan.barang-keluar');
        Route::get('/barang-keluar/export', [LaporanController::class, 'exportBarangKeluar'])
            ->name('laporan.barang-keluar.export');

        // STOK
        Route::get('/stok', [LaporanController::class, 'stok'])
            ->name('laporan.stok');
        Route::get('/stok/export', [LaporanController::class, 'exportStok'])
            ->name('laporan.stok.export');

        // DEAD STOCK
        Route::get('/dead-stock', [LaporanController::class, 'deadStock'])
            ->name('laporan.dead-stock');
        Route::get('/dead-stock/export', [LaporanController::class, 'exportDeadStock'])
            ->name('laporan.dead-stock.export');
    });

    /*
    |--------------------------------------------------------------------------
    | PENGATURAN / SETTINGS
    |--------------------------------------------------------------------------
    */
    Route::get('/setting', [SettingController::class, 'index'])->name('setting.index');
    Route::put('/setting', [SettingController::class, 'update'])->name('setting.update');

    /*
    |--------------------------------------------------------------------------
    | Superadmin Routes
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:superadmin')->group(function () {
        // User Management
        Route::resource('users', UserController::class);
        Route::get('/activity-logs', [ActivityLogController::class, 'index'])->name('activity-logs.index');
    });

});


/*
|--------------------------------------------------------------------------
| PROFILE
|--------------------------------------------------------------------------
*/

Route::middleware('auth')->group(function () {

    Route::get('/profile', [ProfileController::class, 'edit'])
        ->name('profile.edit');

    Route::patch('/profile', [ProfileController::class, 'update'])
        ->name('profile.update');

    Route::delete('/profile', [ProfileController::class, 'destroy'])
        ->name('profile.destroy');
});
/*
|--------------------------------------------------------------------------
| MONITORING STOK
|--------------------------------------------------------------------------
*/

    // =========================
    // STOK BARANG
    // =========================

    Route::get('/stok', [StokController::class, 'index'])
        ->name('stok.index');

    Route::get('/stok-minimum', function () {
        return inertia('StokMinimum/Index');
    })->name('stok-minimum.index');

    Route::get('/dead-stock', function () {
        return inertia('DeadStock/Index');
    })->name('dead-stock.index');

    // =========================
    // STOK MINIMUM
    // =========================

    Route::get('/stok-minimum', [StokMinimumController::class, 'index'])
        ->name('stok-minimum.index');

    // =========================
    // DEAD STOCK
    // =========================

    Route::get('/dead-stock', [DeadStockController::class, 'index'])
        ->name('dead-stock.index');



require __DIR__ . '/auth.php';
