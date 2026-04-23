<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use App\Models\BarangMasuk;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\LogService;

class BarangMasukController extends Controller
{

    public function index()
    {
        $barangMasuk = BarangMasuk::with([
            'barang.kategori',
            'barang.satuan',
            'supplier'
        ])->latest()->get();

        return Inertia::render('BarangMasuk/Index', [
            'barangMasuk' => $barangMasuk,
        ]);
    }

    public function create()
    {
        $barang = Barang::all();
        $suppliers = Supplier::all();

        return Inertia::render('BarangMasuk/Create', [
            'barang'    => $barang,
            'suppliers' => $suppliers,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'barang_id'    => 'required',
            'supplier_id'  => 'nullable|exists:suppliers,id',
            'tanggal_masuk'=> 'required',
            'jumlah'       => 'required|integer',
            'dokumen'      => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048'
        ]);

        $dokumenPath = null;

        if ($request->hasFile('dokumen')) {
            $dokumenPath = $request
                ->file('dokumen')
                ->store('dokumen-masuk', 'public');
        }

        $data = BarangMasuk::create([
            'barang_id'     => $request->barang_id,
            'supplier_id'   => $request->supplier_id,
            'tanggal_masuk' => $request->tanggal_masuk,
            'jumlah'        => $request->jumlah,
            'dokumen'       => $dokumenPath
        ]);

        /*
        UPDATE STOK
        */

        $barang = Barang::find($request->barang_id);
        $barang->stok += $request->jumlah;
        $barang->save();

        LogService::log("Input Barang Masuk: {$barang->nama_barang} ({$request->jumlah})", 'BarangMasuk', $data->id);

        return redirect()->route('barang-masuk.index');
    }

    public function edit($id)
    {
        $barangMasuk = BarangMasuk::findOrFail($id);
        $barang      = Barang::all();
        $suppliers   = Supplier::all();

        return Inertia::render('BarangMasuk/Edit', [
            'barangMasuk' => $barangMasuk,
            'barang'      => $barang,
            'suppliers'   => $suppliers,
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'barang_id'    => 'required',
            'supplier_id'  => 'nullable|exists:suppliers,id',
            'tanggal_masuk'=> 'required',
            'jumlah'       => 'required|integer'
        ]);

        $data = BarangMasuk::findOrFail($id);

        /*
        KURANGI STOK LAMA
        */

        $barangLama = Barang::find($data->barang_id);
        $barangLama->stok -= $data->jumlah;
        $barangLama->save();

        /*
        UPDATE DATA
        */

        $data->update([
            'barang_id'     => $request->barang_id,
            'supplier_id'   => $request->supplier_id,
            'tanggal_masuk' => $request->tanggal_masuk,
            'jumlah'        => $request->jumlah
        ]);

        /*
        TAMBAH STOK BARU
        */

        $barangBaru = Barang::find($request->barang_id);
        $barangBaru->stok += $request->jumlah;
        $barangBaru->save();

        LogService::log("Update Barang Masuk: {$barangBaru->nama_barang} (ID: {$data->id})", 'BarangMasuk', $data->id);

        return redirect()->route('barang-masuk.index');
    }

    public function destroy($id)
{
    $data = BarangMasuk::findOrFail($id);

    /*
    KURANGI STOK SAAT HAPUS
    */

    $barang = Barang::find($data->barang_id);

    // 🔥 CEK DULU AGAR TIDAK NULL
    if ($barang) {

        $barang->stok -= $data->jumlah;

        // Jaga agar stok tidak minus
        if ($barang->stok < 0) {
            $barang->stok = 0;
        }

        $barang->save();

    }

    /*
    HAPUS DATA
    */

    $namaBarang = $barang->nama_barang ?? 'Unknown';
    $data->delete();

    LogService::log("Hapus Barang Masuk: {$namaBarang} (ID: {$id})", 'BarangMasuk', $id);

    return redirect()->route('barang-masuk.index');
}

}