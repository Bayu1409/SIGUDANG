import React from "react";
import { useForm, Link } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";

// Komponen label dengan tanda wajib
const Label = ({ children, required }) => (
  <label className="block text-sm font-medium text-gray-700 mb-1">
    {children}
    {required && <span className="text-red-500 ml-1">*</span>}
  </label>
);

export default function Create({ barang, suppliers }) {

  const { data, setData, post, processing, errors } = useForm({
    barang_id: "",
    supplier_id: "",
    tanggal_masuk: "",
    jumlah: "",
    dokumen: null,
  });

  // Cari stok barang yang dipilih
  const selectedBarang = barang.find(
    (item) => String(item.id) === String(data.barang_id)
  );
  const stokSaatIni = selectedBarang ? Number(selectedBarang.stok) : null;
  const jumlahInput = Number(data.jumlah) || 0;
  const stokAkhir = stokSaatIni !== null ? stokSaatIni + jumlahInput : null;

  function handleSubmit(e) {
    e.preventDefault();
    post(route("barang-masuk.store"));
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Tambah Barang Masuk</h1>

      {/* Keterangan wajib */}
      <p className="text-sm text-gray-500 mb-4">
        Kolom bertanda <span className="text-red-500 font-bold">*</span> wajib diisi.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow max-w-lg">

        {/* Barang */}
        <div>
          <Label required>Barang</Label>
          <select
            className={`w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.barang_id ? "border-red-500" : ""}`}
            value={data.barang_id}
            onChange={(e) => setData("barang_id", e.target.value)}
          >
            <option value="">-- Pilih Barang --</option>
            {barang.map((item) => (
              <option key={item.id} value={item.id}>
                {item.nama_barang} (Stok: {item.stok})
              </option>
            ))}
          </select>
          {errors.barang_id && (
            <p className="text-red-500 text-xs mt-1">{errors.barang_id}</p>
          )}
        </div>

        {/* Supplier */}
        <div>
          <Label>Supplier (Asal Barang)</Label>
          <select
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={data.supplier_id}
            onChange={(e) => setData("supplier_id", e.target.value)}
          >
            <option value="">-- Pilih Supplier (Opsional) --</option>
            {suppliers.map((item) => (
              <option key={item.id} value={item.id}>
                {item.nama_supplier}
              </option>
            ))}
          </select>
        </div>

        {/* Tanggal */}
        <div>
          <Label required>Tanggal Masuk</Label>
          <input
            type="date"
            className={`w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.tanggal_masuk ? "border-red-500" : ""}`}
            value={data.tanggal_masuk}
            onChange={(e) => setData("tanggal_masuk", e.target.value)}
          />
          {errors.tanggal_masuk && (
            <p className="text-red-500 text-xs mt-1">{errors.tanggal_masuk}</p>
          )}
        </div>

        {/* Jumlah */}
        <div>
          <Label required>Jumlah</Label>
          <input
            type="number"
            min="1"
            className={`w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.jumlah ? "border-red-500" : ""}`}
            value={data.jumlah}
            onChange={(e) => setData("jumlah", e.target.value)}
            placeholder="Masukkan jumlah barang"
          />
          {errors.jumlah && (
            <p className="text-red-500 text-xs mt-1">{errors.jumlah}</p>
          )}
        </div>

        {/* Preview Stok Akhir */}
        {stokSaatIni !== null && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
            <p className="text-sm font-semibold text-blue-700">Preview Stok</p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Stok Saat Ini</span>
              <span className="font-medium text-gray-800">{stokSaatIni}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Jumlah Ditambahkan</span>
              <span className="font-medium text-green-600">+ {jumlahInput}</span>
            </div>
            <div className="border-t border-blue-200 pt-2 flex items-center justify-between">
              <span className="text-sm font-bold text-blue-700">Stok Akhir</span>
              <span className="text-lg font-bold text-blue-700">{stokAkhir}</span>
            </div>
          </div>
        )}

        {/* Dokumen */}
        <div>
          <Label>Upload Dokumen</Label>
          <input
            type="file"
            className="w-full border p-2 rounded text-sm"
            onChange={(e) => setData("dokumen", e.target.files[0])}
          />
          <p className="text-xs text-gray-400 mt-1">Format: PDF, JPG, PNG (maks 2MB)</p>
        </div>

        {/* Button */}
        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            disabled={processing}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2 rounded font-medium transition"
          >
            {processing ? "Menyimpan..." : "Simpan"}
          </button>
          <Link
            href={route("barang-masuk.index")}
            className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded font-medium transition"
          >
            Kembali
          </Link>
        </div>

      </form>
    </div>
  );
}

/* 🔥 WAJIB */
Create.layout = page => <AdminLayout children={page} />;