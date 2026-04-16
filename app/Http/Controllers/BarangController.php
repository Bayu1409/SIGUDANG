<?php

namespace App\Http\Controllers;

use App\Models\Kategori;
use App\Models\Satuan;
use Inertia\Inertia;
use App\Models\Barang;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Services\LogService;

class BarangController extends Controller
{

    public function index()
{
    $barang = Barang::with([
        'kategori',
        'satuan'
    ])->get();

    return Inertia::render('Barang/Index', [
        'barang' => $barang
    ]);
}

    public function create()
{
    $kategoris = Kategori::all();
    $satuans = Satuan::all();

    return Inertia::render('Barang/Create', [
        'kategoris' => $kategoris,
        'satuans' => $satuans,
    ]);
}
    public function store(Request $request)
{
    $request->validate([
        'nama_barang' => 'required',
        'kategori_id' => 'required',
        'satuan_id' => 'required',
    ]);

    // Generate kode barang otomatis
    $kode = 'BRG-' . strtoupper(Str::random(5));

    $barang = Barang::create([
        'kode_barang' => $kode,
        'nama_barang' => $request->nama_barang,
        'kategori_id' => $request->kategori_id,
        'satuan_id' => $request->satuan_id,
        'supplier_id' => null, // sementara
    ]);

    LogService::log("Menambah barang baru: {$barang->nama_barang}", 'Barang', $barang->id);

    return redirect()
        ->route('barang.index')
        ->with('success', 'Barang berhasil ditambahkan');
}
    public function edit($id)
    {
    $barang = Barang::findOrFail($id);

    $kategori = Kategori::all();
    $satuan = Satuan::all();

    return Inertia::render('Barang/Edit', [
        'barang' => $barang,
        'kategori' => $kategori,
        'satuan' => $satuan
    ]);
    }

   public function update(Request $request, $id)
{
    $request->validate([
        'kode_barang' => 'required',
        'nama_barang' => 'required',
        'kategori_id' => 'required',
        'satuan_id' => 'required',
    ]);

    $barang = Barang::findOrFail($id);

    $barang->update([
        'kode_barang' => $request->kode_barang,
        'nama_barang' => $request->nama_barang,
        'kategori_id' => $request->kategori_id,
        'satuan_id' => $request->satuan_id,
    ]);

    LogService::log("Memperbarui data barang: {$barang->nama_barang}", 'Barang', $barang->id);

    return redirect()
        ->route('barang.index')
        ->with('success', 'Barang berhasil diupdate');
}

    public function destroy($id)
    {
        $barang = Barang::findOrFail($id);
        $nama = $barang->nama_barang;
        $barang->delete();

        LogService::log("Menghapus barang: {$nama}", 'Barang', $id);

        return redirect()->route('barang.index')->with('success', 'Barang berhasil dihapus');
    }

}