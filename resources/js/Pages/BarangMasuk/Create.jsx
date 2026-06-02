import React, { useEffect } from "react";
import { useForm, Link } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { ArrowRight, ChevronDown, Package, Save, Upload } from "lucide-react";

// Komponen label dengan tanda wajib
const Label = ({ children, required }) => (
  <label className="block text-sm font-medium text-gray-700 mb-1">
    {children}
    {required && <span className="text-red-500 ml-1">*</span>}
  </label>
);

export default function Create({ barang, suppliers, selectedBarangId }) {

  const { data, setData, post, processing, errors } = useForm({
    barang_id: selectedBarangId || "",
    supplier_id: "",
    tanggal_masuk: "",
    jumlah: "",
    dokumen: null,
  });

  // Auto-scroll to first error
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const firstErrorElement = document.querySelector(".border-rose-500");
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [errors]);

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
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Tambah Barang Masuk</h1>
        <p className="text-sm text-slate-500 mt-1">Input data mutasi barang masuk dengan informasi lengkap.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 bg-slate-50/30">
          <p className="text-sm text-slate-500 flex items-center gap-2">
            <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
            Kolom bertanda <span className="text-rose-500 font-bold">*</span> wajib diisi dengan benar.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Barang */}
            <div className="space-y-1">
              <Label required>Barang</Label>
              <select
                  className={`w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${errors.barang_id ? "border-rose-500" : ""}`}
                  value={data.barang_id}
                  onChange={(e) => setData("barang_id", e.target.value)}
                >
                  <option value="">-- Pilih Barang --</option>
                  {barang.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.nama_barang} (Stok: {item.stok} {item.satuan?.nama})
                    </option>
                  ))}
                </select>
              {errors.barang_id && (
                <p className="text-rose-500 text-[10px] font-bold uppercase mt-1 ml-1">{errors.barang_id}</p>
              )}
            </div>

            {/* Supplier */}
            <div className="space-y-1">
              <Label required>Supplier (Asal Barang)</Label>
                <select
                  className={`w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${errors.supplier_id ? "border-rose-500" : ""}`}
                  value={data.supplier_id}
                  onChange={(e) => setData("supplier_id", e.target.value)}
                >
                  <option value="">-- Pilih Supplier --</option>
                  {suppliers.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.nama_supplier}
                    </option>
                  ))}
                </select>
              {errors.supplier_id && (
                <p className="text-rose-500 text-[10px] font-bold uppercase mt-1 ml-1">{errors.supplier_id}</p>
              )}
            </div>

            {/* Tanggal */}
            <div className="space-y-1">
              <Label required>Tanggal Masuk</Label>
              <input
                type="date"
                className={`w-full bg-slate-50 border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${errors.tanggal_masuk ? "border-rose-500" : ""}`}
                value={data.tanggal_masuk}
                onChange={(e) => setData("tanggal_masuk", e.target.value)}
              />
              {errors.tanggal_masuk && (
                <p className="text-rose-500 text-[10px] font-bold uppercase mt-1 ml-1">{errors.tanggal_masuk}</p>
              )}
            </div>

            {/* Jumlah */}
            <div className="space-y-1">
              <Label required>Jumlah</Label>
              <input
                type="number"
                min="1"
                className={`w-full bg-slate-50 border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${errors.jumlah ? "border-rose-500" : ""}`}
                value={data.jumlah}
                onChange={(e) => setData("jumlah", e.target.value)}
                placeholder="0"
              />
              {errors.jumlah && (
                <p className="text-rose-500 text-[10px] font-bold uppercase mt-1 ml-1">{errors.jumlah}</p>
              )}
            </div>
          </div>

          {/* Preview Stok Akhir */}
          {stokSaatIni !== null && (
            <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-white p-3 rounded-xl shadow-sm border border-indigo-50">
                  <Package className="w-6 h-6 text-indigo-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Kalkulasi Stok</p>
                  <p className="text-sm font-semibold text-slate-600">
                    {selectedBarang?.nama_barang}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-8 text-center shrink-0">
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">Stok Awal</span>
                  <span className="text-lg font-bold text-slate-700">{stokSaatIni}</span>
                </div>
                <div className="text-indigo-300">
                   <ArrowRight className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-indigo-400 uppercase">Input</span>
                  <span className="text-lg font-bold text-emerald-600">+{jumlahInput}</span>
                </div>
                <div className="text-indigo-300">
                   <ArrowRight className="w-5 h-5" />
                </div>
                <div className="bg-indigo-600 px-4 py-1.5 rounded-xl text-white">
                  <span className="block text-[10px] font-bold text-indigo-200 uppercase">Stok Akhir</span>
                  <span className="text-lg font-bold">{stokAkhir}</span>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-1">
            <Label required>Upload Dokumen Pendukung</Label>
            <div className="group relative border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-2xl p-8 transition-all bg-slate-50/30 hover:bg-indigo-50/30 text-center cursor-pointer">
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={(e) => setData("dokumen", e.target.files[0])}
              />
              <div className="flex flex-col items-center gap-2">
                <div className="p-4 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                   <Upload className="w-8 h-8 text-slate-400 group-hover:text-indigo-500" />
                </div>
                <p className="text-sm font-bold text-slate-700 mt-2">
                  {data.dokumen ? data.dokumen.name : "Pilih File atau Drag & Drop"}
                </p>
                <p className="text-xs text-slate-400">PDF, JPG, PNG (Maks 2MB)</p>
              </div>
            </div>
            {errors.dokumen && (
              <p className="text-rose-500 text-[10px] font-bold uppercase mt-1">{errors.dokumen}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-50">
            <Link
              href={route("barang-masuk.index")}
              className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-slate-700 transition"
            >
              Batalkan
            </Link>
            <button
              type="submit"
              disabled={processing}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-10 py-3 rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2"
            >
              {processing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  Menyimpan...
                </>
              ) : (
                <>
                   <Save className="w-4 h-4" />
                   Simpan Data
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* 🔥 WAJIB */
Create.layout = page => <AdminLayout children={page} />;