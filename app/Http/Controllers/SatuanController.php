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
    ]);

    Satuan::create([
        'nama' => $request->nama,
    ]);

    return redirect()
        ->route('satuan.index')
        ->with('success', 'Satuan berhasil ditambahkan');
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
            'nama_satuan' => 'required'
        ]);

        $satuan = Satuan::findOrFail($id);

        $satuan->update([
            'nama_satuan' => $request->nama_satuan
        ]);

        return redirect()->route('satuan.index');
    }

    public function destroy($id)
    {
        $satuan = Satuan::findOrFail($id);
        $nama = $satuan->nama;
        $satuan->delete();

        \App\Services\LogService::log("Menghapus satuan barang: {$nama}", 'Satuan', $id);

        return redirect()->route('satuan.index')->with('success', 'Satuan berhasil dihapus');
    }

}