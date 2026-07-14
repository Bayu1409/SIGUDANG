<?php

namespace App\Http\Controllers;

use App\Models\Satuan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SatuanController extends Controller
{

    public function index(Request $request)
    {
        $search = $request->search;

        $satuan = Satuan::when($search, function ($query, $search) {
                $query->where('nama', 'like', "%{$search}%");
            })
            ->orderBy('id', 'asc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Satuan/Index', [
            'satuan' => $satuan,
            'filters' => $request->only(['search'])
        ]);
    }

    public function create()
    {
        return Inertia::render('Satuan/Create');
    }

    public function store(Request $request)
{
    $request->validate([
        'nama' => 'required|string|max:255',
        'nilai_konversi_default' => 'required|integer|min:1',
    ]);

    Satuan::create([
        'nama' => $request->nama,
        'nilai_konversi_default' => $request->nilai_konversi_default,
    ]);

    return redirect()
        ->route('satuan.index')
        ->with('message', "Satuan \"{$request->nama}\" berhasil ditambahkan.");
}

    public function edit($id)
    {
        $satuan = Satuan::findOrFail($id);

        return Inertia::render('Satuan/Edit', [
            'satuan' => $satuan
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'nama' => 'required',
            'nilai_konversi_default' => 'required|integer|min:1',
        ]);

        $satuan = Satuan::findOrFail($id);

        $satuan->update([
            'nama' => $request->nama,
            'nilai_konversi_default' => $request->nilai_konversi_default,
        ]);

        return redirect()->route('satuan.index')->with('message', "Data satuan \"{$satuan->nama}\" berhasil diperbarui.");
    }

    public function destroy($id)
    {
        $satuan = Satuan::findOrFail($id);
        
        // Cek apakah satuan sedang digunakan oleh barang
        if ($satuan->barangs()->exists()) {
            return redirect()
                ->back()
                ->with('error', "Satuan '{$satuan->nama}' tidak dapat dihapus karena sedang digunakan oleh data barang.");
        }

        $nama = $satuan->nama;
        $satuan->delete();

        \App\Services\LogService::log("Menghapus satuan barang: {$nama}", 'Satuan', $id);

        return redirect()->route('satuan.index')->with('message', "Satuan \"{$nama}\" berhasil dihapus dari sistem.");
    }

}