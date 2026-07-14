<?php

namespace App\Http\Controllers;

use App\Models\KategoriBarang;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KategoriBarangController extends Controller
{

    public function index(Request $request)
    {
        $search = $request->search;

        $kategori = KategoriBarang::when($search, function ($query, $search) {
            $query->where('nama_kategori', 'like', "%{$search}%")
                  ->orWhere('deskripsi', 'like', "%{$search}%");
        })->paginate(10)->withQueryString();

        return Inertia::render('KategoriBarang/Index', [
            'kategori' => $kategori,
            'filters' => $request->only(['search'])
        ]);
    }

    public function create()
    {
        return Inertia::render('KategoriBarang/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_kategori' => 'required'
        ]);

        $kategori = KategoriBarang::create([
            'nama_kategori' => $request->nama_kategori,
            'deskripsi' => $request->deskripsi
        ]);

        \App\Services\LogService::log("Menambah kategori baru: {$kategori->nama_kategori}", 'KategoriBarang', $kategori->id);

        return redirect()->route('kategori-barang.index')->with('message', "Kategori \"{$kategori->nama_kategori}\" berhasil ditambahkan.");
    }

    public function edit($id)
    {
        $kategori = KategoriBarang::findOrFail($id);

        return Inertia::render('KategoriBarang/Edit', [
            'kategori' => $kategori
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'nama_kategori' => 'required'
        ]);

        $kategori = KategoriBarang::findOrFail($id);
        $oldData = $kategori->only(['nama_kategori', 'deskripsi']);

        $kategori->update([
            'nama_kategori' => $request->nama_kategori,
            'deskripsi' => $request->deskripsi
        ]);

        $changes = [];
        foreach ($oldData as $key => $oldVal) {
            if ($kategori->{$key} != $oldVal) {
                $changes[$key] = ['old' => $oldVal, 'new' => $kategori->{$key}];
            }
        }

        \App\Services\LogService::log("Memperbarui kategori: {$kategori->nama_kategori}", 'KategoriBarang', $id, ['changes' => $changes]);

        return redirect()->route('kategori-barang.index')->with('message', "Data kategori \"{$kategori->nama_kategori}\" berhasil diperbarui.");
    }

    public function destroy($id)
    {
        $kategori = KategoriBarang::findOrFail($id);

        // Cek apakah kategori sedang digunakan oleh barang
        if ($kategori->barang()->exists()) {
            return redirect()
                ->back()
                ->with('error', "Kategori '{$kategori->nama_kategori}' tidak dapat dihapus karena sedang digunakan oleh data barang.");
        }

        $nama = $kategori->nama_kategori;
        $kategori->delete();

        \App\Services\LogService::log("Menghapus kategori barang: {$nama}", 'KategoriBarang', $id);

        return redirect()->route('kategori-barang.index')->with('message', "Kategori \"{$nama}\" berhasil dihapus dari sistem.");
    }

}