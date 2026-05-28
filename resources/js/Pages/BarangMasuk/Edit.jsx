import { useForm, Link } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { ArrowRight, ChevronDown, FileUp, Lock, Minus, Package, Plus, Save } from "lucide-react";

// Komponen label dengan tanda wajib
const Label = ({ children, required }) => (
  <label className="block text-sm font-medium text-gray-700 mb-1">
    {children}
    {required && <span className="text-red-500 ml-1">*</span>}
  </label>
);

export default function Edit({ barangMasuk, barang, suppliers }) {

    const { data, setData, post, processing, errors } = useForm({
        _method: 'put',
        barang_id:     barangMasuk.barang_id,
        supplier_id:   barangMasuk.supplier_id ?? "",
        tanggal_masuk: barangMasuk.tanggal_masuk,
        jumlah:        barangMasuk.jumlah,
        dokumen:       null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Gunakan post dengan _method put agar upload file bekerja di Laravel
        post(route("barang-masuk.update", barangMasuk.id));
    };

    // Preview stok akhir
    const selectedBarang  = barang.find((item) => String(item.id) === String(data.barang_id));
    const stokSaatIni     = selectedBarang ? Number(selectedBarang.stok) : null;
    // Saat edit: stok saat ini sudah termasuk jumlah lama, jadi kita hitung dari stok - jumlah lama + jumlah baru
    const jumlahLama      = Number(barangMasuk.jumlah) || 0;
    const jumlahBaru      = Number(data.jumlah) || 0;
    const stokAkhir       = stokSaatIni !== null ? stokSaatIni - jumlahLama + jumlahBaru : null;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Edit Transaksi Masuk</h1>
                <p className="text-sm text-slate-500 mt-1">Perbarui data mutasi atau informasi supplier barang.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-50 bg-slate-50/30">
                    <p className="text-sm text-slate-500 flex items-center gap-2">
                        <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                        Pastikan data yang Anda perbarui sudah sesuai dengan dokumen fisik.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Barang */}
                        <div className="space-y-1">
                            <Label required>Barang</Label>
                            <div className="relative">
                                <select
                                    className={`w-full bg-slate-50 border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 appearance-none transition-all ${errors.barang_id ? "border-rose-500" : ""}`}
                                    value={data.barang_id}
                                    onChange={(e) => setData("barang_id", e.target.value)}
                                    disabled
                                >
                                    {barang.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.nama_barang} (Stok: {item.stok})
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                    <Lock className="w-4 h-4 text-slate-400" title="Item tidak dapat diubah" />
                                </div>
                            </div>
                            <p className="text-[10px] text-slate-400 ml-1 italic">Item barang tidak dapat diubah saat mode edit.</p>
                        </div>

                        {/* Supplier */}
                        <div className="space-y-1">
                            <Label required>Supplier (Asal Barang)</Label>
                            <div className="relative">
                                <select
                                    className={`w-full bg-slate-50 border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 appearance-none transition-all ${errors.supplier_id ? "border-rose-500" : ""}`}
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
                                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                    <ChevronDown className="w-4 h-4 text-slate-400" />
                                </div>
                            </div>
                            {errors.supplier_id && (
                                <p className="text-rose-500 text-[10px] font-bold uppercase mt-1">{errors.supplier_id}</p>
                            )}
                        </div>

                        {/* Tanggal */}
                        <div className="space-y-1">
                            <Label required>Tanggal Masuk</Label>
                            <input
                                type="date"
                                className={`w-full bg-slate-50 border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all ${errors.tanggal_masuk ? "border-rose-500" : ""}`}
                                value={data.tanggal_masuk}
                                onChange={(e) => setData("tanggal_masuk", e.target.value)}
                            />
                            {errors.tanggal_masuk && (
                                <p className="text-rose-500 text-[10px] font-bold uppercase mt-1">{errors.tanggal_masuk}</p>
                            )}
                        </div>

                        {/* Jumlah */}
                        <div className="space-y-1">
                            <Label required>Jumlah</Label>
                            <input
                                type="number"
                                min="1"
                                className={`w-full bg-slate-50 border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all ${errors.jumlah ? "border-rose-500" : ""}`}
                                value={data.jumlah}
                                onChange={(e) => setData("jumlah", e.target.value)}
                            />
                            {errors.jumlah && (
                                <p className="text-rose-500 text-[10px] font-bold uppercase mt-1">{errors.jumlah}</p>
                            )}
                        </div>
                    </div>

                    {/* Preview Stok Akhir */}
                    {stokSaatIni !== null && (
                        <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="bg-white p-3 rounded-xl shadow-sm border border-amber-50">
                                    <Package className="w-6 h-6 text-amber-500" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-amber-400 uppercase tracking-widest">Penyesuaian Stok</p>
                                    <p className="text-sm font-semibold text-slate-600">
                                        {selectedBarang?.nama_barang}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6 text-center shrink-0">
                                <div>
                                    <span className="block text-[10px] font-bold text-slate-400 uppercase">Stok Saat Ini</span>
                                    <span className="text-lg font-bold text-slate-700">{stokSaatIni}</span>
                                </div>
                                <div className="text-slate-300">
                                   <Minus className="w-4 h-4" />
                                </div>
                                <div>
                                    <span className="block text-[10px] font-bold text-rose-400 uppercase">Lama</span>
                                    <span className="text-lg font-bold text-rose-500">{jumlahLama}</span>
                                </div>
                                <div className="text-slate-300">
                                   <Plus className="w-4 h-4" />
                                </div>
                                <div>
                                    <span className="block text-[10px] font-bold text-emerald-400 uppercase">Baru</span>
                                    <span className="text-lg font-bold text-emerald-600">{jumlahBaru}</span>
                                </div>
                                <div className="text-amber-300">
                                   <ArrowRight className="w-5 h-5" />
                                </div>
                                <div className="bg-amber-500 px-4 py-1.5 rounded-xl text-white">
                                    <span className="block text-[10px] font-bold text-amber-100 uppercase">Hitung Akhir</span>
                                    <span className="text-lg font-bold">{stokAkhir}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="space-y-1">
                        <Label>Ganti Dokumen Pendukung (Opsional)</Label>
                        <div className="group relative border-2 border-dashed border-slate-200 hover:border-amber-400 rounded-2xl p-8 transition-all bg-slate-50/30 hover:bg-amber-50/30 text-center cursor-pointer">
                            <input
                                type="file"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                onChange={(e) => setData("dokumen", e.target.files[0])}
                            />
                            <div className="flex flex-col items-center gap-2">
                                <div className="p-4 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                                   <FileUp className="w-8 h-8 text-slate-400 group-hover:text-amber-500" />
                                </div>
                                <p className="text-sm font-bold text-slate-700 mt-2">
                                    {data.dokumen ? data.dokumen.name : "Klik untuk mengganti dokumen"}
                                </p>
                                <p className="text-xs text-slate-400">PDF, JPG, PNG (Biarkan kosong jika tidak ada perubahan)</p>
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
                            Kembali
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-10 py-3 rounded-xl font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
                        >
                            {processing ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                   <Save className="w-4 h-4" />
                                   Perbarui Data
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
Edit.layout = page => <AdminLayout children={page} />;