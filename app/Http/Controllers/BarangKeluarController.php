<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use App\Models\BarangKeluar;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\LogService;

class BarangKeluarController extends Controller
{

    public function index()
    {
        $barangKeluar = BarangKeluar::with([
            'barang.kategori',
            'barang.satuan'
        ])->get();

        return Inertia::render('BarangKeluar/Index', [
            'barangKeluar' => $barangKeluar
        ]);
    }

    public function create()
    {
        $barang = Barang::all();

        return Inertia::render('BarangKeluar/Create', [
            'barang' => $barang
        ]);
    }

    public function store(Request $request)
    {

        $request->validate([
            'barang_id' => 'required',
            'tanggal_keluar' => 'required',
            'jumlah' => 'required|integer',
            'dokumen' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048'
        ]);

        $barang = Barang::find($request->barang_id);

        // VALIDASI STOK
        if ($request->jumlah > $barang->stok) {

            return back()->withErrors([
                'jumlah' => 'Jumlah melebihi stok tersedia'
            ]);

        }

        $dokumenPath = null;

        if ($request->hasFile('dokumen')) {

            $dokumenPath = $request
                ->file('dokumen')
                ->store('dokumen-keluar', 'public');

        }

        $data = BarangKeluar::create([
            'barang_id' => $request->barang_id,
            'tanggal_keluar' => $request->tanggal_keluar,
            'jumlah' => $request->jumlah,
            'dokumen' => $dokumenPath
        ]);

        /*
        KURANGI STOK
        */

        $barang->stok -= $request->jumlah;
        $barang->save();

        LogService::log("Input Barang Keluar: {$barang->nama_barang} ({$request->jumlah})", 'BarangKeluar', $data->id);

        return redirect()->route('barang-keluar.index');

    }

    /*
    =========================
    EDIT
    =========================
    */

    public function edit($id)
    {

        $barangKeluar =
            BarangKeluar::findOrFail($id);

        $barang =
            Barang::all();

        return Inertia::render(
            'BarangKeluar/Edit',
            [
                'barangKeluar' =>
                    $barangKeluar,

                'barang' =>
                    $barang
            ]
        );

    }

    /*
    =========================
    UPDATE
    =========================
    */

    public function update(Request $request, $id)
    {

        $request->validate([
            'barang_id' => 'required',
            'tanggal_keluar' => 'required',
            'jumlah' => 'required|integer'
        ]);

        $data =
            BarangKeluar::findOrFail($id);

        /*
        TAMBAH STOK LAMA DULU
        */

        $barangLama =
            Barang::find($data->barang_id);

        if ($barangLama) {

            $barangLama->stok +=
                $data->jumlah;

            $barangLama->save();

        }

        /*
        CEK STOK BARU
        */

        $barangBaru =
            Barang::find(
                $request->barang_id
            );

        if (
            $request->jumlah >
            $barangBaru->stok
        ) {

            return back()->withErrors([
                'jumlah' =>
                'Jumlah melebihi stok tersedia'
            ]);

        }

        /*
        UPDATE DATA
        */

        $data->update([
            'barang_id' =>
                $request->barang_id,

            'tanggal_keluar' =>
                $request->tanggal_keluar,

            'jumlah' =>
                $request->jumlah
        ]);

        /*
        KURANGI STOK BARU
        */

        $barangBaru->stok -=
            $request->jumlah;

        $barangBaru->save();

        LogService::log("Update Barang Keluar: {$barangBaru->nama_barang} (ID: {$data->id})", 'BarangKeluar', $data->id);

        return redirect()->route(
            'barang-keluar.index'
        );

    }

    /*
    =========================
    DELETE
    =========================
    */

    public function destroy($id)
    {
        $data =
            BarangKeluar::findOrFail($id);

        $barang =
            Barang::find(
                $data->barang_id
            );

        // TAMBAH STOK KEMBALI
        if ($barang) {

            $barang->stok +=
                $data->jumlah;

            $barang->save();

        }

        $namaBarang = $barang->nama_barang ?? 'Unknown';
        $data->delete();

        LogService::log("Hapus Barang Keluar: {$namaBarang} (ID: {$id})", 'BarangKeluar', $id);

        return redirect()->route(
            'barang-keluar.index'
        );

    }

}