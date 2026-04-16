<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SupplierController extends Controller
{

    public function index()
    {

        $supplier = Supplier::all();

        return Inertia::render('Supplier/Index', [
            'supplier' => $supplier
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

        Supplier::create([
            'nama_supplier' => $request->nama_supplier,
            'alamat' => $request->alamat,
            'telepon' => $request->telepon,
            'email' => $request->email
        ]);

        return redirect()->route('supplier.index');

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

        $supplier->update([
            'nama_supplier' => $request->nama_supplier,
            'alamat' => $request->alamat,
            'telepon' => $request->telepon,
            'email' => $request->email
        ]);

        return redirect()->route('supplier.index');

    }

    public function destroy($id)
    {
        $supplier = Supplier::findOrFail($id);
        $nama = $supplier->nama_supplier;
        $supplier->delete();

        \App\Services\LogService::log("Menghapus supplier: {$nama}", 'Supplier', $id);

        return redirect()->route('supplier.index')->with('success', 'Supplier berhasil dihapus');
    }

}