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

        KategoriBarang::create([
            'nama_kategori' => $request->nama_kategori,
            'deskripsi' => $request->deskripsi
        ]);

        return redirect()->route('kategori-barang.index');
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

        $kategori->update([
            'nama_kategori' => $request->nama_kategori,
            'deskripsi' => $request->deskripsi
        ]);

        return redirect()->route('kategori-barang.index');
    }

    public function destroy($id)
    {
        $kategori = KategoriBarang::findOrFail($id);
        $nama = $kategori->nama_kategori;
        $kategori->delete();

        \App\Services\LogService::log("Menghapus kategori barang: {$nama}", 'KategoriBarang', $id);

        return redirect()->route('kategori-barang.index')->with('success', 'Kategori berhasil dihapus');
    }

}