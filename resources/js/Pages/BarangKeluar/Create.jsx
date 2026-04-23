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

export default function Create({ barang }) {

  const { data, setData, post, errors, processing } = useForm({
    barang_id:      "",
    tanggal_keluar: "",
    jumlah:         "",
    dokumen:        null,
  });

  // Preview stok akhir
  const selectedBarang = barang.find(
    (item) => String(item.id) === String(data.barang_id)
  );
  const stokSaatIni = selectedBarang ? Number(selectedBarang.stok) : null;
  const jumlahInput = Number(data.jumlah) || 0;
  const stokAkhir   = stokSaatIni !== null ? stokSaatIni - jumlahInput : null;

  function submit(e) {
    e.preventDefault();
    post(route("barang-keluar.store"));
  }

  return (
    <AdminLayout header="Tambah Barang Keluar">

      <p className="text-sm text-gray-500 mb-4">
        Kolom bertanda <span className="text-red-500 font-bold">*</span> wajib diisi.
      </p>

      <form onSubmit={submit} className="bg-white p-6 rounded shadow space-y-4 max-w-lg">

        {/* BARANG */}
        <div>
          <Label required>Barang</Label>
          <select
            value={data.barang_id}
            onChange={e => setData("barang_id", e.target.value)}
            className={`w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.barang_id ? "border-red-500" : ""}`}
          >
            <option value="">-- Pilih Barang --</option>
            {barang.map(item => (
              <option key={item.id} value={item.id}>
                {item.nama_barang} (Stok: {item.stok})
              </option>
            ))}
          </select>
          {errors.barang_id && (
            <p className="text-red-500 text-xs mt-1">{errors.barang_id}</p>
          )}
        </div>

        {/* TANGGAL */}
        <div>
          <Label required>Tanggal Keluar</Label>
          <input
            type="date"
            value={data.tanggal_keluar}
            onChange={e => setData("tanggal_keluar", e.target.value)}
            className={`w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.tanggal_keluar ? "border-red-500" : ""}`}
          />
          {errors.tanggal_keluar && (
            <p className="text-red-500 text-xs mt-1">{errors.tanggal_keluar}</p>
          )}
        </div>

        {/* JUMLAH */}
        <div>
          <Label required>Jumlah</Label>
          <input
            type="number"
            min="1"
            value={data.jumlah}
            onChange={e => setData("jumlah", e.target.value)}
            className={`w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.jumlah ? "border-red-500" : ""}`}
            placeholder="Masukkan jumlah barang keluar"
          />
          {errors.jumlah && (
            <p className="text-red-500 text-xs mt-1">{errors.jumlah}</p>
          )}
        </div>

        {/* Preview Stok Akhir */}
        {stokSaatIni !== null && (
          <div className={`border rounded-lg p-4 space-y-2 ${stokAkhir < 0 ? "bg-red-50 border-red-200" : "bg-blue-50 border-blue-200"}`}>
            <p className={`text-sm font-semibold ${stokAkhir < 0 ? "text-red-700" : "text-blue-700"}`}>
              Preview Stok
            </p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Stok Saat Ini</span>
              <span className="font-medium text-gray-800">{stokSaatIni}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Jumlah Dikeluarkan</span>
              <span className="font-medium text-red-500">- {jumlahInput}</span>
            </div>
            <div className={`border-t pt-2 flex items-center justify-between ${stokAkhir < 0 ? "border-red-200" : "border-blue-200"}`}>
              <span className={`text-sm font-bold ${stokAkhir < 0 ? "text-red-700" : "text-blue-700"}`}>
                Stok Akhir
              </span>
              <span className={`text-lg font-bold ${stokAkhir < 0 ? "text-red-600" : "text-blue-700"}`}>
                {stokAkhir}
              </span>
            </div>
            {stokAkhir < 0 && (
              <p className="text-red-600 text-xs font-semibold">
                ⚠ Stok tidak mencukupi! Jumlah melebihi stok yang tersedia.
              </p>
            )}
          </div>
        )}

        {/* DOKUMEN */}
        <div>
          <Label>Dokumen</Label>
          <input
            type="file"
            onChange={e => setData("dokumen", e.target.files[0])}
            className="w-full border p-2 rounded text-sm"
          />
          <p className="text-xs text-gray-400 mt-1">Format: PDF, JPG, PNG (maks 2MB)</p>
        </div>

        {/* BUTTON */}
        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            disabled={processing}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-5 py-2 rounded font-medium transition"
          >
            {processing ? "Menyimpan..." : "Simpan"}
          </button>
          <Link
            href={route("barang-keluar.index")}
            className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded font-medium transition"
          >
            Kembali
          </Link>
        </div>

      </form>

    </AdminLayout>
  );
}