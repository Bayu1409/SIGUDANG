import React from "react";
import { useForm, Link, usePage, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Plus, Trash2, Save, Upload, Package, ArrowRight, LogOut, FileSpreadsheet, AlertCircle, X } from "lucide-react";

const Label = ({ children, required }) => (
  <label className="block text-sm font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
    {children}
    {required && <span className="text-rose-500 ml-1">*</span>}
  </label>
);

export default function Create({ barang, selectedBarangId }) {
  const { errors_import } = usePage().props;
  const { data, setData, post, processing, errors } = useForm({
    tanggal_keluar: "",
    penerima: "",
    dokumen: null,
    items: [
      { barang_id: selectedBarangId || "", jumlah: "" }
    ],
  });

  const addItem = () => {
    setData("items", [...data.items, { barang_id: "", jumlah: "" }]);
  };

  const removeItem = (index) => {
    const newItems = [...data.items];
    newItems.splice(index, 1);
    setData("items", newItems);
  };

  const updateItem = (index, field, value) => {
    const newItems = [...data.items];
    newItems[index][field] = value;
    setData("items", newItems);
  };

  function handleSubmit(e) {
    e.preventDefault();
    post(route("barang-keluar.store"));
  }

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      router.post(route('barang-keluar.import'), formData, {
        forceFormData: true,
        onSuccess: () => { e.target.value = null; }
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Input Barang Keluar</h1>
          <p className="text-slate-500 mt-1 font-medium italic">Catat pengeluaran stok barang secara massal atau import via CSV.</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-rose-600/10 text-rose-700 px-4 py-2 rounded-2xl border border-rose-100 flex items-center gap-2">
            <LogOut className="w-5 h-5" />
            <span className="font-bold text-sm">{data.items.length} Item Keluar</span>
          </div>
        </div>
      </div>

      {/* QUICK IMPORT SECTION */}
      <div className="mb-8 bg-emerald-50/50 border-2 border-dashed border-emerald-200 rounded-[2rem] p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-emerald-100">
            <FileSpreadsheet className="w-8 h-8 text-emerald-500" />
          </div>
          <div>
            <h4 className="font-black text-slate-800">Cepat dengan Import CSV</h4>
            <p className="text-xs text-slate-500 font-medium">Download template dan upload file CSV Anda.</p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <a
            href={route('barang-keluar.template')}
            className="flex-1 md:flex-none text-center px-6 py-3 bg-white border-2 border-emerald-100 text-emerald-600 rounded-xl font-bold text-xs hover:bg-emerald-50 transition-all shadow-sm"
          >
            Download Template
          </a>
          <label className="flex-1 md:flex-none cursor-pointer text-center px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold text-xs hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2">
            <Upload className="w-4 h-4" /> Import Sekarang
            <input type="file" className="hidden" accept=".csv" onChange={handleImport} />
          </label>
        </div>
      </div>

      {/* ERROR IMPORT */}
      {errors_import && errors_import.length > 0 && (
        <div className="mb-8 bg-rose-50 border-2 border-rose-100 rounded-[2rem] p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-rose-500" />
            <h4 className="font-black text-rose-800">Gagal Import ({errors_import.length} Error)</h4>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
            {errors_import.map((err, i) => (
              <li key={i} className="text-xs text-rose-600 flex items-start gap-2 bg-white/50 p-2 rounded-lg">
                <span className="font-bold">#{i+1}</span>
                {err}
              </li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* HEADER INFO: SHARED DATA */}
        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <Label required>Tanggal Keluar</Label>
                <input
                  type="date"
                  className={`w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl focus:ring-4 focus:ring-rose-100 focus:border-rose-500 transition-all font-bold text-slate-700 ${errors.tanggal_keluar ? "border-rose-300 bg-rose-50" : ""}`}
                  value={data.tanggal_keluar}
                  onChange={(e) => setData("tanggal_keluar", e.target.value)}
                />
                {errors.tanggal_keluar && <p className="text-rose-500 text-[10px] font-black uppercase mt-2 ml-1">{errors.tanggal_keluar}</p>}
              </div>

              <div>
                <Label required>Tujuan / Penerima (Pelanggan)</Label>
                <input
                  type="text"
                  placeholder="Nama Pelanggan atau Instansi"
                  className={`w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl focus:ring-4 focus:ring-rose-100 focus:border-rose-500 transition-all font-bold text-slate-700 ${errors.penerima ? "border-rose-300 bg-rose-50" : ""}`}
                  value={data.penerima}
                  onChange={(e) => setData("penerima", e.target.value)}
                />
                {errors.penerima && <p className="text-rose-500 text-[10px] font-black uppercase mt-2 ml-1">{errors.penerima}</p>}
              </div>
            </div>

            <div className="space-y-1">
              <Label required>Lampiran Dokumen (Nota/Bukti)</Label>
              <div className="group relative border-2 border-dashed border-slate-200 hover:border-rose-400 rounded-3xl p-8 transition-all bg-slate-50/30 hover:bg-rose-50/10 text-center cursor-pointer flex items-center justify-center">
                <input
                  type="file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={(e) => setData("dokumen", e.target.files[0])}
                />
                <div className="flex flex-col items-center gap-3">
                  <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6 text-slate-400 group-hover:text-rose-500" />
                  </div>
                  <div className="max-w-[200px]">
                    <p className="text-sm font-black text-slate-800 truncate">
                      {data.dokumen ? data.dokumen.name : "Pilih dokumen transaksi"}
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">PDF/JPG (Maks 2MB)</p>
                  </div>
                </div>
              </div>
              {errors.dokumen && <p className="text-rose-500 text-[10px] font-black uppercase mt-2 ml-1">{errors.dokumen}</p>}
            </div>
          </div>
        </div>

        {/* ITEMS LIST */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
              <Package className="w-5 h-5 text-rose-500" />
              Daftar Barang yang Keluar
            </h3>
            <button
              type="button"
              onClick={addItem}
              className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-xl font-bold text-xs shadow-lg shadow-rose-200 hover:bg-slate-900 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Tambah Baris
            </button>
          </div>

          <div className="space-y-4">
            {data.items.map((item, index) => {
              const currentBarang = barang.find(b => b.id == item.barang_id);
              const errorKey = `items.${index}.jumlah`;
              const hasError = errors[errorKey];

              return (
                <div key={index} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 group hover:shadow-xl transition-all relative">
                  {data.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="absolute -top-3 -right-3 bg-rose-500 text-white p-2 rounded-xl shadow-lg hover:bg-rose-600 transition-all opacity-0 group-hover:opacity-100 z-10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
                    <div className="lg:col-span-1 text-xs font-black text-slate-300 text-center pb-4">
                      #{index + 1}
                    </div>

                    <div className="lg:col-span-7">
                      <Label required>Nama Barang</Label>
                      <select
                        className={`w-full bg-slate-50 border-2 border-slate-100 p-3.5 rounded-2xl focus:ring-4 focus:ring-rose-100 focus:border-rose-500 transition-all font-bold text-slate-700 ${errors[`items.${index}.barang_id`] ? "border-rose-300 bg-rose-50" : ""}`}
                        value={item.barang_id}
                        onChange={(e) => updateItem(index, "barang_id", e.target.value)}
                      >
                        <option value="">-- Pilih Barang --</option>
                        {barang.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.nama_barang} (Tersedia: {b.stok} {b.satuan?.nama})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="lg:col-span-4">
                      <Label required>Jumlah ({currentBarang?.satuan?.nama || 'Unit'})</Label>
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          min="1"
                          className={`w-full bg-slate-50 border-2 border-slate-100 p-3.5 rounded-2xl focus:ring-4 focus:ring-rose-100 focus:border-rose-500 transition-all font-black text-slate-700 placeholder:text-slate-300 ${hasError ? "border-rose-300 bg-rose-50" : ""}`}
                          value={item.jumlah}
                          onChange={(e) => updateItem(index, "jumlah", e.target.value)}
                          placeholder={`0 ${currentBarang?.satuan?.nama || ''}`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* MINI PREVIEW */}
                  {currentBarang && item.jumlah > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 text-[11px] font-bold">
                        <div className="flex items-center gap-2 text-slate-400">
                          <span className="uppercase tracking-widest text-[9px]">Stok:</span>
                          <span className="text-slate-600">{currentBarang.stok}</span>
                        </div>
                        <ArrowRight className="w-3 h-3 text-rose-300" />
                        <div className="flex items-center gap-2 text-rose-600">
                          <span className="uppercase tracking-widest text-[9px]">Keluar:</span>
                          <span>-{item.jumlah}</span>
                        </div>
                        <ArrowRight className="w-3 h-3 text-rose-300" />
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${Number(currentBarang.stok) < Number(item.jumlah) ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-600'}`}>
                          <span className="uppercase tracking-widest text-[9px]">Sisa:</span>
                          <span>{Number(currentBarang.stok) - Number(item.jumlah)} {currentBarang.satuan?.nama}</span>
                        </div>
                      </div>

                      {/* Info Konversi untuk referensi monitoring */}
                      <div className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Monitoring Sistem (Unit/Biji)</p>
                        <p className="text-[11px] font-bold text-slate-600">
                          {((Number(currentBarang.stok) - Number(item.jumlah)) * (currentBarang.nilai_konversi || 1)).toLocaleString()} Unit
                        </p>
                      </div>
                    </div>
                  )}

                  {hasError && (
                    <p className="text-rose-600 text-[10px] font-black uppercase mt-3 italic flex items-center gap-2">
                      <span className="w-1 h-1 bg-rose-600 rounded-full animate-ping"></span>
                      {hasError}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* SUBMIT SECTION */}
        <div className="fixed bottom-0 left-0 right-0 lg:left-72 bg-white/80 backdrop-blur-xl border-t border-slate-100 p-6 z-[100] flex items-center justify-between px-10 shadow-2xl">
          <Link
            href={route("barang-keluar.index")}
            className="text-sm font-black text-slate-400 hover:text-slate-900 transition uppercase tracking-widest"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={processing}
            className="group bg-slate-900 hover:bg-rose-600 disabled:opacity-50 text-white px-12 py-4 rounded-2xl font-black text-sm shadow-2xl shadow-rose-200 transition-all flex items-center gap-3 active:scale-95"
          >
            {processing ? (
              <div className="w-5 h-5 border-3 border-white/20 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <Save className="w-5 h-5 group-hover:animate-bounce" />
                Catat {data.items.length} Barang Keluar
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

Create.layout = (page) => <AdminLayout children={page} />;