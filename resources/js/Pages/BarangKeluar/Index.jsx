import React, { useState, useEffect } from "react";
import { Link, router, Head, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import Pagination from "@/Components/Pagination";
import { ArrowUpFromLine, FileText, Package, Printer, Search, Trash2, X } from "lucide-react";

export default function Index({ barangKeluar, filters = {} }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search || "");
    const [showPrintModal, setShowPrintModal] = useState(false);
    const isInitialRender = React.useRef(true);

    // Tampilkan modal cetak setelah input berhasil
    useEffect(() => {
        try {
            if (flash && flash.print_id) {
                setShowPrintModal(true);
            }
        } catch (e) {
            // silently ignore
        }
    }, []);

    useEffect(() => {
        if (isInitialRender.current) { isInitialRender.current = false; return; }
        const delay = setTimeout(() => {
            router.get(route("barang-keluar.index"),
                { search },
                { preserveState: true, replace: true, preserveScroll: true });
        }, 300);
        return () => clearTimeout(delay);
    }, [search]);

    const hasFilter = !!search;

    return (
        <>
            <Head title="Barang Keluar" />

            {/* HEADER */}
            <div className="flex justify-between items-center mb-6 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                <div>
                    <h2 className="text-xl font-bold leading-tight text-slate-800">Barang Keluar</h2>
                    <p className="text-xs text-slate-500 mt-1">Kelola pengeluaran stok barang.</p>
                </div>
                <Link href={route("barang-keluar.create")}
                    className="bg-rose-600 text-white px-5 py-2.5 rounded-lg font-bold shadow-lg shadow-rose-500/20 hover:bg-rose-700 transition-all flex items-center gap-2">
                    <ArrowUpFromLine className="w-4 h-4" /> Input Barang Keluar
                </Link>
            </div>

            {/* FILTER */}
            <div className="mb-6 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
                    <div className="relative flex-1 min-w-[200px]">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                            <Search className="w-4 h-4" />
                        </span>
                        <input type="text" placeholder="Cari nama barang atau kategori..."
                            value={search} onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 focus:border-rose-500 focus:ring-rose-500 pl-10 pr-4 py-2 text-sm transition-all" />
                    </div>
                    {hasFilter && (
                        <button onClick={() => setSearch("")}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-slate-500 hover:bg-slate-100 text-xs font-semibold transition-all border border-slate-200">
                            <X className="w-3.5 h-3.5" /> Reset
                        </button>
                    )}
                </div>
            </div>

            {/* TABEL */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden mb-6">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">No</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Barang</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Kategori</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Satuan</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Tujuan / Penerima</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Tanggal & Waktu</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Jumlah</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Dokumen</th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {barangKeluar && barangKeluar.data && barangKeluar.data.length > 0
                                ? barangKeluar.data.map((item, index) => (
                                    <BarangKeluarRow
                                        key={item.id}
                                        item={item}
                                        no={(barangKeluar.from || 1) + index}
                                    />
                                ))
                                : (
                                    <tr>
                                        <td colSpan="9" className="px-6 py-12 text-center text-slate-400">
                                            <div className="flex flex-col items-center gap-2">
                                                <Package className="w-10 h-10 opacity-20" />
                                                <p className="text-sm font-medium">Data barang keluar belum tersedia.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Pagination links={barangKeluar?.links || []} />

            {/* MODAL CETAK NOTA */}
            {showPrintModal && flash && flash.print_id && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 text-center">
                        <div className="flex justify-center mb-5">
                            <div className="bg-emerald-100 p-5 rounded-2xl">
                                <Printer className="w-10 h-10 text-emerald-600" />
                            </div>
                        </div>

                        <h3 className="text-xl font-black text-slate-800 mb-2">Barang Keluar Berhasil Dicatat!</h3>
                        <p className="text-sm text-slate-500 mb-3">{flash.message}</p>
                        <p className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg inline-block mb-5">
                            No. Transaksi: {flash.kode_transaksi}
                        </p>
                        <p className="text-sm text-slate-500 mb-6">
                            Apakah Anda ingin mencetak nota serah terima barang sekarang?
                        </p>

                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={() => setShowPrintModal(false)}
                                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-all text-sm">
                                Lewati
                            </button>
                            <a
                                href={route('barang-keluar.print', flash.print_id)}
                                target="_blank"
                                rel="noreferrer"
                                onClick={() => setShowPrintModal(false)}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-slate-900 transition-all shadow-lg shadow-indigo-200">
                                <Printer className="w-4 h-4" />
                                Cetak Nota Sekarang
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

function BarangKeluarRow({ item, no }) {
    const [showConfirm, setShowConfirm] = useState(false);

    const handleDelete = () => {
        router.delete(route("barang-keluar.destroy", item.id), {
            onSuccess: () => setShowConfirm(false),
        });
    };

    return (
        <>
            <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 text-sm text-slate-500 font-medium">{no}</td>
                <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-slate-100 rounded-lg overflow-hidden w-10 h-10 flex flex-shrink-0 items-center justify-center border border-slate-200">
                            {item.barang?.foto ? (
                                <img src={`/storage/${item.barang.foto}`} alt={item.barang.nama_barang} className="w-full h-full object-cover" />
                            ) : (
                                <Package className="w-5 h-5 text-slate-400" />
                            )}
                        </div>
                        <div>
                            <div className="font-bold text-slate-900 text-sm">{item.barang?.nama_barang}</div>
                            <div className="text-[10px] text-slate-400 font-medium">{item.barang?.kode_barang}</div>
                        </div>
                    </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{item.barang?.kategori?.nama_kategori || "-"}</td>
                <td className="px-6 py-4 text-sm text-slate-600">
                    <span className="px-2 py-1 bg-slate-100 rounded text-xs">{item.barang?.satuan?.nama || "-"}</span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 font-bold italic">{item.penerima || "-"}</td>
                <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                    {new Date(item.created_at).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}
                </td>
                <td className="px-6 py-4">
                    <span className="text-sm font-bold text-rose-600">{item.jumlah}</span>
                </td>
                <td className="px-6 py-4 text-sm">
                    {item.dokumen ? (
                        <a href={`/storage/${item.dokumen}`} target="_blank" rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-rose-600 hover:text-rose-800 font-bold transition-colors">
                            <FileText className="w-4 h-4" /> Lihat
                        </a>
                    ) : <span className="text-slate-300">-</span>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                        <a href={route('barang-keluar.print', item.id)} target="_blank" rel="noreferrer"
                            className="p-2 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="Cetak Nota">
                            <Printer className="w-5 h-5" />
                        </a>
                        <button onClick={() => setShowConfirm(true)}
                            className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all" title="Hapus">
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                </td>
            </tr>

            {showConfirm && (
                <tr><td colSpan="9" className="p-0">
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center">
                            <div className="flex justify-center mb-4">
                                <div className="bg-rose-100 p-4 rounded-full"><Trash2 className="w-8 h-8 text-rose-600" /></div>
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 mb-2">Hapus Data Barang Keluar?</h3>
                            <p className="text-sm text-slate-500 mb-6">
                                Data barang keluar <span className="font-semibold text-slate-700">{item.barang?.nama_barang}</span> akan
                                dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.
                            </p>
                            <div className="flex gap-3 justify-center">
                                <button onClick={() => setShowConfirm(false)}
                                    className="px-5 py-2.5 rounded-lg border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-all text-sm">
                                    Batal
                                </button>
                                <button onClick={handleDelete}
                                    className="px-5 py-2.5 rounded-lg bg-rose-600 text-white font-bold hover:bg-rose-700 transition-all text-sm shadow-lg shadow-rose-500/20">
                                    Ya, Hapus
                                </button>
                            </div>
                        </div>
                    </div>
                </td></tr>
            )}
        </>
    );
}

Index.layout = (page) => <AdminLayout children={page} />;