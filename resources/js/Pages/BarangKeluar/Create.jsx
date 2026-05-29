import { useForm, Link, Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { AlertCircle, ArrowRight, ChevronDown, FileUp, Minus, Package, Save } from "lucide-react";

// Komponen label dengan tanda wajib
const Label = ({ children, required }) => (
    <label className="block text-sm font-medium text-gray-700 mb-1">
        {children}
        {required && <span className="text-red-500 ml-1">*</span>}
    </label>
);

export default function Create({ barang }) {

    const { data, setData, post, errors, processing } = useForm({
        barang_id: "",
        tanggal_keluar: "",
        jumlah: "",
        dokumen: null,
    });

    // Preview stok akhir
    const selectedBarang = barang.find(
        (item) => String(item.id) === String(data.barang_id)
    );
    const stokSaatIni = selectedBarang ? Number(selectedBarang.stok) : null;
    const jumlahInput = Number(data.jumlah) || 0;
    const stokAkhir = stokSaatIni !== null ? stokSaatIni - jumlahInput : null;

    function submit(e) {
        e.preventDefault();
        post(route("barang-keluar.store"));
    }

    return (
        <div className="max-w-4xl mx-auto">
            <Head title="Tambah Barang Keluar" />

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Input Barang Keluar</h1>
                <p className="text-sm text-slate-500 mt-1">Catat pengeluaran barang dari gudang untuk mutasi atau penjualan.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-50 bg-slate-50/30">
                    <p className="text-sm text-slate-500 flex items-center gap-2">
                        <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
                        Kolom bertanda <span className="text-rose-500 font-bold">*</span> wajib diisi dengan benar.
                    </p>
                </div>

                <form onSubmit={submit} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* BARANG */}
                        <div className="space-y-1">
                            <Label required>Pilih Barang</Label>
                            <select
                                value={data.barang_id}
                                onChange={e => setData("barang_id", e.target.value)}
                                className={`w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all ${errors.barang_id ? "border-rose-500" : ""}`}
                            >
                                <option value="">-- Pilih Barang --</option>
                                {barang.map(item => (
                                    <option key={item.id} value={item.id}>
                                        {item.nama_barang} (Stok: {item.stok} {item.satuan?.nama})
                                    </option>
                                ))}
                            </select>
                            {errors.barang_id && (
                                <p className="text-rose-500 text-[10px] font-bold uppercase mt-1 ml-1">{errors.barang_id}</p>
                            )}
                        </div>

                        {/* TANGGAL */}
                        <div className="space-y-1">
                            <Label required>Tanggal Pengeluaran</Label>
                            <input
                                type="date"
                                value={data.tanggal_keluar}
                                onChange={e => setData("tanggal_keluar", e.target.value)}
                                className={`w-full bg-slate-50 border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all ${errors.tanggal_keluar ? "border-rose-500" : ""}`}
                            />
                            {errors.tanggal_keluar && (
                                <p className="text-rose-500 text-[10px] font-bold uppercase mt-1 ml-1">{errors.tanggal_keluar}</p>
                            )}
                        </div>

                        {/* JUMLAH */}
                        <div className="space-y-1">
                            <Label required>Jumlah Keluar</Label>
                            <input
                                type="number"
                                min="1"
                                value={data.jumlah}
                                onChange={e => setData("jumlah", e.target.value)}
                                className={`w-full bg-slate-50 border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all ${errors.jumlah ? "border-rose-500" : ""}`}
                                placeholder="0"
                            />
                            {errors.jumlah && (
                                <p className="text-rose-500 text-[10px] font-bold uppercase mt-1 ml-1">{errors.jumlah}</p>
                            )}
                        </div>
                    </div>

                    {/* Preview Stok Akhir */}
                    {stokSaatIni !== null && (
                        <div className={`border rounded-2xl p-6 transition-all ${stokAkhir < 0 ? "bg-rose-50 border-rose-100" : "bg-slate-50 border-slate-100"}`}>
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl shadow-sm border ${stokAkhir < 0 ? "bg-white border-rose-100" : "bg-white border-slate-100"}`}>
                                        <Package className={`w-6 h-6 ${stokAkhir < 0 ? "text-rose-500" : "text-slate-400"}`} />
                                    </div>
                                    <div>
                                        <p className={`text-xs font-bold uppercase tracking-widest ${stokAkhir < 0 ? "text-rose-400" : "text-slate-400"}`}>Estimasi Stok Akhir</p>
                                        <p className="text-sm font-semibold text-slate-700">{selectedBarang?.nama_barang}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6 text-center">
                                    <div>
                                        <span className="block text-[10px] font-bold text-slate-400 uppercase">Stok Awal</span>
                                        <span className="text-lg font-bold text-slate-700">{stokSaatIni}</span>
                                    </div>
                                    <div className="text-slate-300">
                                       <Minus className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <span className="block text-[10px] font-bold text-rose-400 uppercase">Jumlah Item</span>
                                        <span className="text-lg font-bold text-rose-600">{jumlahInput}</span>
                                    </div>
                                    <div className="text-slate-300">
                                       <ArrowRight className="w-5 h-5" />
                                    </div>
                                    <div className={`${stokAkhir < 0 ? "bg-rose-600 shadow-rose-200" : "bg-slate-800 shadow-slate-200"} px-5 py-2 rounded-xl text-white shadow-lg`}>
                                        <span className="block text-[10px] font-bold opacity-80 uppercase">Total Sisa</span>
                                        <span className="text-xl font-bold">{stokAkhir}</span>
                                    </div>
                                </div>
                            </div>
                            {stokAkhir < 0 && (
                                <div className="mt-4 flex items-center gap-2 text-rose-600 bg-white/50 p-3 rounded-lg border border-rose-100">
                                    <AlertCircle className="w-4 h-4" />
                                    <p className="text-xs font-bold uppercase tracking-tighter">
                                        Peringatan: Stok tidak mencukupi untuk transaksi ini!
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="space-y-1">
                        <Label>Dokumen Penunjang (Opsional)</Label>
                        <div className="group relative border-2 border-dashed border-slate-200 hover:border-rose-400 rounded-2xl p-8 transition-all bg-slate-50/30 hover:bg-rose-50/30 text-center cursor-pointer">
                            <input
                                type="file"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                onChange={e => setData("dokumen", e.target.files[0])}
                            />
                            <div className="flex flex-col items-center gap-2">
                                <div className="p-4 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                                   <FileUp className="w-8 h-8 text-slate-400 group-hover:text-rose-500" />
                                </div>
                                <p className="text-sm font-bold text-slate-700 mt-2">
                                    {data.dokumen ? data.dokumen.name : "Klik atau seret file dokumen"}
                                </p>
                                <p className="text-xs text-slate-400">PDF, JPG, PNG (Maks 2MB)</p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-50">
                        <Link
                            href={route("barang-keluar.index")}
                            className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-slate-700 transition"
                        >
                            Kembali
                        </Link>
                        <button
                            type="submit"
                            disabled={processing || (stokAkhir !== null && stokAkhir < 0)}
                            className="bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white px-10 py-3 rounded-xl font-bold shadow-lg shadow-rose-500/20 transition-all flex items-center gap-2"
                        >
                            {processing ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                   <Save className="w-4 h-4" />
                                   Simpan Transaksi
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

Create.layout = (page) => <AdminLayout children={page} />;