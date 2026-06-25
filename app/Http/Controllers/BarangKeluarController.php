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
            'tanggal_keluar' => 'required',
            'penerima'       => 'required|string|max:255',
            'dokumen'        => 'required|file|mimes:pdf,jpg,jpeg,png|max:2048',
            'items'          => 'required|array|min:1',
            'items.*.barang_id' => 'required|exists:barangs,id',
            'items.*.jumlah'    => 'required|integer|min:1',
        ]);

        // CEK STOK SEMUA BARANG DULU
        foreach ($request->items as $idx => $itemData) {
            $barang = Barang::find($itemData['barang_id']);
            if ($itemData['jumlah'] > $barang->stok) {
                return back()->withErrors([
                    "items.{$idx}.jumlah" => "Jumlah melebihi stok ({$barang->stok}) untuk {$barang->nama_barang}"
                ]);
            }
        }

        $dokumenPath = null;
        if ($request->hasFile('dokumen')) {
            $dokumenPath = $request->file('dokumen')->store('dokumen-keluar', 'public');
        }

        $kodeTransaksi = 'OUT-' . date('Ymd') . '-' . strtoupper(bin2hex(random_bytes(3)));
        $firstData = null;

        foreach ($request->items as $idx => $itemData) {
            $data = BarangKeluar::create([
                'kode_transaksi' => $kodeTransaksi,
                'barang_id'      => $itemData['barang_id'],
                'tanggal_keluar' => $request->tanggal_keluar,
                'penerima'       => $request->penerima,
                'jumlah'         => $itemData['jumlah'],
                'dokumen'        => $dokumenPath
            ]);

            if ($idx === 0) $firstData = $data;

            // KURANGI STOK
            $barang = Barang::find($itemData['barang_id']);
            $barang->stok -= $itemData['jumlah'];
            $barang->save();

            LogService::log("Input Barang Keluar ke {$request->penerima}: {$barang->nama_barang} ({$itemData['jumlah']})", 'BarangKeluar', $data->id);
        }

        return redirect()->route('barang-keluar.index')->with([
            'message'         => count($request->items) . " jenis barang berhasil dicatat keluar ke {$request->penerima}.",
            'print_id'        => $firstData->id,
            'kode_transaksi'  => $kodeTransaksi,
        ]);
    }

    public function edit($id)
    {
        $barangKeluar = BarangKeluar::findOrFail($id);
        $barang = Barang::all();

        return Inertia::render('BarangKeluar/Edit', [
            'barangKeluar' => $barangKeluar,
            'barang' => $barang
        ]);
    }

    public function cetakNota($id)
    {
        $single = BarangKeluar::findOrFail($id);

        if ($single->kode_transaksi) {
            $items = BarangKeluar::with(['barang.kategori', 'barang.satuan'])
                ->where('kode_transaksi', $single->kode_transaksi)
                ->get();
        } else {
            $items = BarangKeluar::with(['barang.kategori', 'barang.satuan'])
                ->where('id', $id)
                ->get();
        }

        return Inertia::render('BarangKeluar/Print', [
            'items' => $items,
            'header' => $items->first()
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'barang_id' => 'required',
            'tanggal_keluar' => 'required',
            'jumlah' => 'required|integer'
        ]);

        $data = BarangKeluar::findOrFail($id);

        $barangLama = Barang::find($data->barang_id);
        if ($barangLama) {
            $barangLama->stok += $data->jumlah;
            $barangLama->save();
        }

        $barangBaru = Barang::find($request->barang_id);
        if ($request->jumlah > $barangBaru->stok) {
            return back()->withErrors(['jumlah' => 'Jumlah melebihi stok tersedia']);
        }

        $data->update([
            'barang_id' => $request->barang_id,
            'tanggal_keluar' => $request->tanggal_keluar,
            'jumlah' => $request->jumlah
        ]);

        $barangBaru->stok -= $request->jumlah;
        $barangBaru->save();

        LogService::log("Update Barang Keluar: {$barangBaru->nama_barang} (ID: {$data->id})", 'BarangKeluar', $data->id);

        return redirect()->route('barang-keluar.index')->with('message', "Data barang keluar {$barangBaru->nama_barang} berhasil diperbarui.");
    }

    public function destroy($id)
    {
        $data = BarangKeluar::findOrFail($id);
        $barang = Barang::find($data->barang_id);
        if ($barang) {
            $barang->stok += $data->jumlah;
            $barang->save();
        }

        $namaBarang = $barang->nama_barang ?? 'Unknown';
        $data->delete();

        LogService::log("Hapus Barang Keluar: {$namaBarang} (ID: {$id})", 'BarangKeluar', $id);

        return redirect()->route('barang-keluar.index')->with('message', "Data barang keluar {$namaBarang} berhasil dihapus.");
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
        $kodeTransaksi = 'IMP-OUT-' . date('Ymd') . '-' . strtoupper(bin2hex(random_bytes(3)));

        while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
            if (count($data) < 4) continue;

            $kodeBarang   = trim($data[0]);
            $penerima     = trim($data[1]);
            $tanggal      = trim($data[2]);
            $jumlah       = (int) trim($data[3]);

            $barang = Barang::where('kode_barang', $kodeBarang)->first();

            if (!$barang) {
                $errors[] = "Barang kode '{$kodeBarang}' tidak ditemukan.";
                continue;
            }

            if ($jumlah > $barang->stok) {
                $errors[] = "Stok tidak cukup untuk {$barang->nama_barang} (Kode: {$kodeBarang}).";
                continue;
            }

            $bk = BarangKeluar::create([
                'kode_transaksi' => $kodeTransaksi,
                'barang_id'      => $barang->id,
                'tanggal_keluar' => $tanggal,
                'penerima'       => $penerima,
                'jumlah'         => $jumlah,
                'dokumen'        => null
            ]);

            $barang->stok -= $jumlah;
            $barang->save();

            LogService::log("Import Barang Keluar: {$barang->nama_barang} ({$jumlah})", 'BarangKeluar', $bk->id);
            $imported++;
        }

        fclose($handle);

        $msg = "{$imported} data berhasil diimport.";
        if (count($errors) > 0) {
            $msg .= " Terdapat " . count($errors) . " error.";
        }

        return redirect()->back()->with('message', $msg)->with('errors_import', $errors);
    }

    public function downloadTemplate()
    {
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="template_barang_keluar.csv"',
        ];

        $callback = function () {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['kode_barang', 'penerima', 'tanggal_keluar', 'jumlah']);
            fputcsv($file, ['BRG-001', 'Toko Berkah', date('Y-m-d'), '5']);
            fputcsv($file, ['BRG-002', 'Bpk. Ahmad', date('Y-m-d'), '12']);
            fputcsv($file, ['BRG-003', 'Instansi Sejahtera', date('Y-m-d'), '30']);
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}