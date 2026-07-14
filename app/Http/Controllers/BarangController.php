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

    public function index(Request $request)
    {
        $search     = $request->search;
        $kategoriId = $request->kategori_id;

        $barang = Barang::with(['kategori', 'satuan'])
        ->when($search, function ($query, $search) {
            $query->where('nama_barang', 'like', "%{$search}%")
                  ->orWhere('kode_barang', 'like', "%{$search}%")
                  ->orWhereHas('kategori', function($q) use ($search) {
                      $q->where('nama_kategori', 'like', "%{$search}%");
                  });
        })
        ->when($kategoriId, fn($q) => $q->where('kategori_id', $kategoriId))
        ->orderBy('id', 'desc')
        ->paginate(10)
        ->withQueryString();

        return Inertia::render('Barang/Index', [
            'barang'    => $barang,
            'filters'   => $request->only(['search', 'kategori_id']),
            'kategoris' => Kategori::orderBy('nama_kategori')->get(['id', 'nama_kategori']),
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
        'foto' => 'nullable|image|max:2048',
    ]);

    // Generate kode barang otomatis
    $kode = 'BRG-' . strtoupper(Str::random(5));

    $fotoPath = null;
    if ($request->hasFile('foto')) {
        $fotoPath = $request->file('foto')->store('barang', 'public');
    }

    $barang = Barang::create([
        'kode_barang' => $kode,
        'nama_barang' => $request->nama_barang,
        'kategori_id' => $request->kategori_id,
        'satuan_id' => $request->satuan_id,
        'foto' => $fotoPath,
        'supplier_id' => null, // sementara
        'batas_minimum' => $request->batas_minimum ?? 0,
        'nilai_konversi' => $request->nilai_konversi ?? 1,
    ]);

    LogService::log("Menambah barang baru: {$barang->nama_barang}", 'Barang', $barang->id);

    return redirect()
        ->route('barang.index')
        ->with('message', "Barang \"{$barang->nama_barang}\" berhasil ditambahkan.");
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
        'foto' => 'nullable|image|max:2048',
    ]);

    $barang = Barang::findOrFail($id);
    
    // Simpan data lama untuk perbandingan
    $oldData = $barang->only(['nama_barang', 'kode_barang', 'kategori_id', 'satuan_id', 'batas_minimum', 'nilai_konversi']);

    $fotoPath = $barang->foto;
    if ($request->hasFile('foto')) {
        // Hapus foto lama jika ada
        if ($barang->foto && \Illuminate\Support\Facades\Storage::disk('public')->exists($barang->foto)) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($barang->foto);
        }
        $fotoPath = $request->file('foto')->store('barang', 'public');
    }

    $barang->update([
        'kode_barang' => $request->kode_barang,
        'nama_barang' => $request->nama_barang,
        'kategori_id' => $request->kategori_id,
        'satuan_id' => $request->satuan_id,
        'batas_minimum' => $request->batas_minimum ?? 0,
        'nilai_konversi' => $request->nilai_konversi ?? 1,
        'foto' => $fotoPath,
    ]);

    // Ambil data yang berubah
    $changes = [];
    foreach ($oldData as $key => $oldLabel) {
        if ($barang->{$key} != $oldLabel) {
            $changes[$key] = [
                'old' => $oldLabel,
                'new' => $barang->{$key}
            ];
        }
    }

    LogService::log("Memperbarui data barang: {$barang->nama_barang}", 'Barang', $barang->id, ['changes' => $changes]);

    return redirect()
        ->route('barang.index')
        ->with('message', "Data barang \"{$barang->nama_barang}\" berhasil diperbarui.");
}

    public function destroy($id)
    {
        $barang = Barang::findOrFail($id);

        // Cek apakah barang memiliki riwayat transaksi
        if ($barang->barangMasuk()->exists() || $barang->barangKeluar()->exists()) {
            return redirect()
                ->back()
                ->with('error', "Barang '{$barang->nama_barang}' tidak dapat dihapus karena sudah memiliki riwayat transaksi.");
        }

        $nama = $barang->nama_barang;
        $barang->delete();

        LogService::log("Menghapus barang: {$nama}", 'Barang', $id);

        return redirect()->route('barang.index')->with('message', "Barang \"{$nama}\" berhasil dihapus dari sistem.");
    }

}