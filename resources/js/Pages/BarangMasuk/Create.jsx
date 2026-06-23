import React, { useEffect } from "react";
import { useForm, Link } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Plus, Trash2, Save, Upload, Package, ArrowRight, ClipboardList } from "lucide-react";

const Label = ({ children, required }) => (
  <label className="block text-sm font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
    {children}
    {required && <span className="text-rose-500 ml-1">*</span>}
  </label>
);

export default function Create({ barang, suppliers, selectedBarangId }) {
  const { data, setData, post, processing, errors } = useForm({
    supplier_id: "",
    tanggal_masuk: "",
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
    post(route("barang-masuk.store"));
  }

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Input Barang Masuk</h1>
          <p className="text-slate-500 mt-1 font-medium italic">Catat kedatangan stok baru dari supplier secara massal.</p>
        </div>
        <div className="bg-indigo-600/10 text-indigo-700 px-4 py-2 rounded-2xl border border-indigo-100 flex items-center gap-2">
           <ClipboardList className="w-5 h-5" />
           <span className="font-bold text-sm">{data.items.length} Item Terdata</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* HEADER INFO: SHARED DATA */}
        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <Label required>Supplier Pengirim</Label>
                <select
                  className={`w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all font-bold text-slate-700 ${errors.supplier_id ? "border-rose-300 bg-rose-50" : ""}`}
                  value={data.supplier_id}
                  onChange={(e) => setData("supplier_id", e.target.value)}
                >
                  <option value="">-- Pilih Supplier --</option>
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>{s.nama_supplier}</option>
                  ))}
                </select>
                {errors.supplier_id && <p className="text-rose-500 text-[10px] font-black uppercase mt-2 ml-1">{errors.supplier_id}</p>}
              </div>

              <div>
                <Label required>Tanggal Kedatangan</Label>
                <input
                  type="date"
                  className={`w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all font-bold text-slate-700 ${errors.tanggal_masuk ? "border-rose-300 bg-rose-50" : ""}`}
                  value={data.tanggal_masuk}
                  onChange={(e) => setData("tanggal_masuk", e.target.value)}
                />
                {errors.tanggal_masuk && <p className="text-rose-500 text-[10px] font-black uppercase mt-2 ml-1">{errors.tanggal_masuk}</p>}
              </div>
            </div>

            <div className="space-y-1 mt-auto">
              <Label required>Lampiran Dokumen (Nota/Surat Jalan)</Label>
              <div className="group relative border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-3xl p-8 transition-all bg-slate-50/30 hover:bg-indigo-50/10 text-center cursor-pointer min-h-[160px] flex items-center justify-center">
                <input
                  type="file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={(e) => setData("dokumen", e.target.files[0])}
                />
                <div className="flex flex-col items-center gap-3">
                  <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                     <Upload className="w-6 h-6 text-slate-400 group-hover:text-indigo-500" />
                  </div>
                  <div className="max-w-[200px]">
                    <p className="text-sm font-black text-slate-800 truncate">
                      {data.dokumen ? data.dokumen.name : "Klik atau seret dokumen ke sini"}
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Maks 2MB (PDF/JPG)</p>
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
               <Package className="w-5 h-5 text-indigo-500" />
               Daftar Barang yang Diterima
            </h3>
            <button
              type="button"
              onClick={addItem}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-xs shadow-lg shadow-indigo-200 hover:bg-slate-900 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Tambah Baris
            </button>
          </div>

          <div className="space-y-4">
            {data.items.map((item, index) => {
              const currentBarang = barang.find(b => b.id == item.barang_id);
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
                        className={`w-full bg-slate-50 border-2 border-slate-100 p-3.5 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all font-bold text-slate-700 ${errors[`items.${index}.barang_id`] ? "border-rose-300" : ""}`}
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
                          className={`w-full bg-slate-50 border-2 border-slate-100 p-3.5 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all font-black text-slate-700 placeholder:text-slate-300 ${errors[`items.${index}.jumlah`] ? "border-rose-300" : ""}`}
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
                          <ArrowRight className="w-3 h-3 text-indigo-300" />
                          <div className="flex items-center gap-2 text-emerald-600">
                             <span className="uppercase tracking-widest text-[9px]">Masuk:</span>
                             <span>+{item.jumlah}</span>
                          </div>
                          <ArrowRight className="w-3 h-3 text-indigo-300" />
                          <div className="flex items-center gap-2 text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                             <span className="uppercase tracking-widest text-[9px]">Hasil:</span>
                             <span>{Number(currentBarang.stok) + Number(item.jumlah)} {currentBarang.satuan?.nama}</span>
                          </div>
                      </div>

                      {/* Info Konversi untuk referensi monitoring */}
                      <div className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Monitoring Sistem (Unit/Biji)</p>
                          <p className="text-[11px] font-bold text-slate-600">
                             {( (Number(currentBarang.stok) + Number(item.jumlah)) * (currentBarang.nilai_konversi || 1) ).toLocaleString()} Unit
                          </p>
                      </div>
                    </div>
                  )}

                  {(errors[`items.${index}.barang_id`] || errors[`items.${index}.jumlah`]) && (
                    <p className="text-rose-500 text-[10px] font-black uppercase mt-3 italic flex items-center gap-2">
                       <span className="w-1 h-1 bg-rose-500 rounded-full animate-ping"></span>
                       Mohon lengkapi data barang #{index + 1} di atas.
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
            href={route("barang-masuk.index")}
            className="text-sm font-black text-slate-400 hover:text-slate-900 transition uppercase tracking-widest"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={processing}
            className="group bg-slate-900 hover:bg-indigo-600 disabled:opacity-50 text-white px-12 py-4 rounded-2xl font-black text-sm shadow-2xl shadow-indigo-200 transition-all flex items-center gap-3 active:scale-95"
          >
            {processing ? (
              <div className="w-5 h-5 border-3 border-white/20 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <Save className="w-5 h-5 group-hover:animate-bounce" />
                Daftarkan {data.items.length} Barang
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

Create.layout = (page) => <AdminLayout children={page} />;