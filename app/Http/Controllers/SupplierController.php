<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SupplierController extends Controller
{

    public function index(Request $request)
    {
        $search = $request->search;

        $supplier = Supplier::when($search, function ($query, $search) {
            $query->where('nama_supplier', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('telepon', 'like', "%{$search}%");
        })->orderBy('id', 'desc')->paginate(9)->withQueryString();

        return Inertia::render('Supplier/Index', [
            'supplier' => $supplier,
            'filters' => $request->only(['search'])
        ]);

    }

    public function create()
    {

        return Inertia::render('Supplier/Create');

    }

    public function store(Request $request)
    {

        $request->validate([
            'nama_supplier' => 'required'
        ]);

        $supplier = Supplier::create([
            'nama_supplier' => $request->nama_supplier,
            'alamat' => $request->alamat,
            'telepon' => $request->telepon,
            'email' => $request->email
        ]);

        \App\Services\LogService::log("Menambah supplier baru: {$supplier->nama_supplier}", 'Supplier', $supplier->id);

        return redirect()->route('supplier.index')->with('message', 'Supplier berhasil ditambahkan');

    }

    public function edit($id)
    {

        $supplier = Supplier::findOrFail($id);

        return Inertia::render('Supplier/Edit', [
            'supplier' => $supplier
        ]);

    }

    public function update(Request $request, $id)
    {

        $request->validate([
            'nama_supplier' => 'required'
        ]);

        $supplier = Supplier::findOrFail($id);
        $oldData = $supplier->only(['nama_supplier', 'alamat', 'telepon', 'email']);

        $supplier->update([
            'nama_supplier' => $request->nama_supplier,
            'alamat' => $request->alamat,
            'telepon' => $request->telepon,
            'email' => $request->email
        ]);

        $changes = [];
        foreach ($oldData as $key => $oldVal) {
            if ($supplier->{$key} != $oldVal) {
                $changes[$key] = ['old' => $oldVal, 'new' => $supplier->{$key}];
            }
        }

        \App\Services\LogService::log("Memperbarui data supplier: {$supplier->nama_supplier}", 'Supplier', $id, ['changes' => $changes]);

        return redirect()->route('supplier.index')->with('message', 'Supplier berhasil diperbarui');

    }

    public function destroy($id)
    {
        $supplier = Supplier::findOrFail($id);
        $nama = $supplier->nama_supplier;
        $supplier->delete();

        \App\Services\LogService::log("Menghapus supplier: {$nama}", 'Supplier', $id);

        return redirect()->route('supplier.index')->with('message', 'Supplier berhasil dihapus');
    }

}