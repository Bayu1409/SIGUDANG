<?php

namespace App\Http\Controllers;

use App\Models\KategoriBarang;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KategoriBarangController extends Controller
{

    public function index()
    {
        $kategori = KategoriBarang::all();

        return Inertia::render('KategoriBarang/Index', [
            'kategori' => $kategori
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

        $kategori->delete();

        return redirect()->route('kategori-barang.index');
    }

}