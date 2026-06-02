<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use App\Models\BarangKeluar;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\LogService;

class BarangKeluarController extends Controller
{

    public function index(Request $request)
    {
        $search   = $request->search;
        $barangId = $request->barang_id;

        $barangKeluar = BarangKeluar::with([
            'barang.kategori',
            'barang.satuan'
        ])
        ->when($search, function ($query, $search) {
             $query->whereHas('barang', function ($q) use ($search) {
                 $q->where('nama_barang', 'like', "%{$search}%")
                   ->orWhereHas('kategori', function ($q2) use ($search) {
                         $q2->where('nama_kategori', 'like', "%{$search}%");
                   });
             });
        })
        ->when($barangId, fn($q) => $q->where('barang_id', $barangId))
        ->latest()
        ->paginate(10)
        ->withQueryString();

        return Inertia::render('BarangKeluar/Index', [
            'barangKeluar' => $barangKeluar,
            'filters'      => $request->only(['search', 'barang_id']),
            'barangs'      => Barang::orderBy('nama_barang')->get(['id', 'nama_barang']),
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

        return redirect()->route('barang-keluar.index')->with('message', "Data barang keluar {$barang->nama_barang} berhasil ditambahkan.");

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

        return redirect()->route('barang-keluar.index')->with('message', "Data barang keluar {$barangBaru->nama_barang} berhasil diperbarui.");

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

        return redirect()->route('barang-keluar.index')->with('message', "Data barang keluar {$namaBarang} berhasil dihapus.");

    }

}