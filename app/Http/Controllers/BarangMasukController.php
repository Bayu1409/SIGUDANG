<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use App\Models\BarangMasuk;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\LogService;
use Illuminate\Support\Facades\Storage;

class BarangMasukController extends Controller
{

    public function index(Request $request)
    {
        $search     = $request->search;
        $supplierId = $request->supplier_id;
        $barangId   = $request->barang_id;

        $barangMasuk = BarangMasuk::with([
            'barang.kategori',
            'barang.satuan',
            'supplier'
        ])
        ->when($search, function ($query, $search) {
             $query->whereHas('barang', function ($q) use ($search) {
                 $q->where('nama_barang', 'like', "%{$search}%")
                   ->orWhereHas('kategori', function ($q2) use ($search) {
                         $q2->where('nama_kategori', 'like', "%{$search}%");
                   });
             })->orWhereHas('supplier', function ($q) use ($search) {
                 $q->where('nama_supplier', 'like', "%{$search}%");
             });
        })
        ->when($supplierId, fn($q) => $q->where('supplier_id', $supplierId))
        ->when($barangId,   fn($q) => $q->where('barang_id', $barangId))
        ->latest()
        ->paginate(10)
        ->withQueryString();

        return Inertia::render('BarangMasuk/Index', [
            'barangMasuk' => $barangMasuk,
            'filters'     => $request->only(['search', 'supplier_id', 'barang_id']),
            'suppliers'   => Supplier::orderBy('nama_supplier')->get(['id', 'nama_supplier']),
            'barangs'     => Barang::orderBy('nama_barang')->get(['id', 'nama_barang']),
        ]);
    }


    public function create(Request $request)
    {
        $barang = Barang::all();
        $suppliers = Supplier::all();

        return Inertia::render('BarangMasuk/Create', [
            'barang'    => $barang,
            'suppliers' => $suppliers,
            'selectedBarangId' => $request->barang_id,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'supplier_id'  => 'required|exists:suppliers,id',
            'tanggal_masuk'=> 'required',
            'dokumen'      => 'required|file|mimes:pdf,jpg,jpeg,png|max:2048',
            'items'        => 'required|array|min:1',
            'items.*.barang_id' => 'required|exists:barangs,id',
            'items.*.jumlah'    => 'required|integer|min:1',
        ]);

        $dokumenPath = null;
        if ($request->hasFile('dokumen')) {
            $dokumenPath = $request->file('dokumen')->store('dokumen-masuk', 'public');
        }

        foreach ($request->items as $itemData) {
            $data = BarangMasuk::create([
                'barang_id'     => $itemData['barang_id'],
                'supplier_id'   => $request->supplier_id,
                'tanggal_masuk' => $request->tanggal_masuk,
                'jumlah'        => $itemData['jumlah'],
                'dokumen'       => $dokumenPath
            ]);

            // UPDATE STOK
            $barang = Barang::find($itemData['barang_id']);
            $barang->stok += $itemData['jumlah'];
            $barang->save();

            LogService::log("Input Barang Masuk: {$barang->nama_barang} ({$itemData['jumlah']})", 'BarangMasuk', $data->id);
        }

        return redirect()->route('barang-masuk.index')->with('message', count($request->items) . " jenis barang berhasil ditambahkan.");
    }

    public function edit($id)
    {
        $barangMasuk = BarangMasuk::findOrFail($id);
        $barang      = Barang::all();
        $suppliers   = Supplier::all();

        return Inertia::render('BarangMasuk/Edit', [
            'barangMasuk' => $barangMasuk,
            'barang'      => $barang,
            'suppliers'   => $suppliers,
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'barang_id'    => 'required',
            'supplier_id'  => 'required|exists:suppliers,id',
            'tanggal_masuk'=> 'required',
            'jumlah'       => 'required|integer',
            'dokumen'      => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048'
        ]);

        $data = BarangMasuk::findOrFail($id);

        if ($request->hasFile('dokumen')) {
            // Hapus file lama jika ada
            if ($data->dokumen) {
                Storage::disk('public')->delete($data->dokumen);
            }
            $dokumenPath = $request->file('dokumen')->store('dokumen-masuk', 'public');
            $data->dokumen = $dokumenPath;
            $data->save();
        }

        /*
        KURANGI STOK LAMA
        */

        $barangLama = Barang::find($data->barang_id);
        $barangLama->stok -= $data->jumlah;
        $barangLama->save();

        /*
        UPDATE DATA
        */

        $data->update([
            'barang_id'     => $request->barang_id,
            'supplier_id'   => $request->supplier_id,
            'tanggal_masuk' => $request->tanggal_masuk,
            'jumlah'        => $request->jumlah
        ]);

        /*
        TAMBAH STOK BARU
        */

        $barangBaru = Barang::find($request->barang_id);
        $barangBaru->stok += $request->jumlah;
        $barangBaru->save();

        LogService::log("Update Barang Masuk: {$barangBaru->nama_barang} (ID: {$data->id})", 'BarangMasuk', $data->id);

        return redirect()->route('barang-masuk.index')->with('message', "Data barang masuk {$barangBaru->nama_barang} berhasil diperbarui.");
    }

    public function destroy($id)
    {
        $data = BarangMasuk::findOrFail($id);

        $barang = Barang::find($data->barang_id);

        if ($barang) {
            $barang->stok -= $data->jumlah;
            if ($barang->stok < 0) {
                $barang->stok = 0;
            }
            $barang->save();
        }

        $namaBarang = $barang->nama_barang ?? 'Unknown';
        $data->delete();

        LogService::log("Hapus Barang Masuk: {$namaBarang} (ID: {$id})", 'BarangMasuk', $id);

        return redirect()->route('barang-masuk.index')->with('message', "Data barang masuk {$namaBarang} berhasil dihapus.");
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:csv,txt|max:2048',
        ]);

        $file = $request->file('file');
        $handle = fopen($file->getRealPath(), 'r');
        
        fgetcsv($handle); // Skip header

        $imported = 0;
        $errors = [];

        while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
            if (count($data) < 4) continue;

            $kodeBarang   = trim($data[0]);
            $namaSupplier = trim($data[1]);
            $tanggal      = trim($data[2]);
            $jumlah       = (int) trim($data[3]);

            $barang = Barang::where('kode_barang', $kodeBarang)->first();
            $supplier = Supplier::where('nama_supplier', 'like', "%{$namaSupplier}%")->first();

            if (!$barang) {
                $errors[] = "Barang kode '{$kodeBarang}' tidak ditemukan.";
                continue;
            }

            if (!$supplier) {
                $errors[] = "Supplier '{$namaSupplier}' tidak ditemukan.";
                continue;
            }

            $bm = BarangMasuk::create([
                'barang_id'     => $barang->id,
                'supplier_id'   => $supplier->id,
                'tanggal_masuk' => $tanggal,
                'jumlah'        => $jumlah,
                'dokumen'       => null
            ]);

            $barang->stok += $jumlah;
            $barang->save();

            LogService::log("Import Barang Masuk: {$barang->nama_barang} ({$jumlah})", 'BarangMasuk', $bm->id);
            $imported++;
        }

        fclose($handle);

        $msg = "{$imported} data berhasil diimport.";
        if (count($errors) > 0) {
            $msg .= " Namun ada " . count($errors) . " error.";
        }

        return redirect()->back()->with('message', $msg)->with('errors_import', $errors);
    }

    public function downloadTemplate()
    {
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="template_barang_masuk.csv"',
        ];

        $callback = function () {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['kode_barang', 'nama_supplier', 'tanggal_masuk', 'jumlah']);
            fputcsv($file, ['BRG-001', 'Supplier A', date('Y-m-d'), '10']);
            fputcsv($file, ['BRG-002', 'Supplier B', date('Y-m-d'), '25']);
            fputcsv($file, ['BRG-003', 'Supplier C', date('Y-m-d'), '50']);
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}