import React, { useState, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router } from "@inertiajs/react";
import Pagination from "@/Components/Pagination";
import {
    Search,
    Package,
    Truck,
    ArrowDownToLine,
    ArrowUpFromLine,
    BoxesIcon,
    AlertTriangle,
    CheckCircle,
    X,
    TrendingUp,
} from "lucide-react";

export default function Index({ barang, filters = {}, config = {} }) {
    const [search, setSearch] = useState(filters.search || "");
    const [detailItem, setDetailItem] = useState(null);
    const stokLimit = config.stokMinimum || 10;

    const isInitialRender = React.useRef(true);

    useEffect(() => {
        if (isInitialRender.current) {
            isInitialRender.current = false;
            return;
        }
        const delay = setTimeout(() => {
            router.get(
                route("stok.index"),
                { search },
                { preserveState: true, replace: true, preserveScroll: true }
            );
        }, 300);
        return () => clearTimeout(delay);
    }, [search]);

    const getStokStatus = (stok) => {
        if (stok <= 0) return { label: "Habis", color: "text-rose-600", bg: "bg-rose-50 border-rose-200", dot: "bg-rose-500" };
        if (stok <= stokLimit) return { label: "Rendah", color: "text-amber-600", bg: "bg-amber-50 border-amber-200", dot: "bg-amber-500" };
        return { label: "Aman", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200", dot: "bg-emerald-500" };
    };

    return (
        <>
            <Head title="Monitoring Stok Barang" />

            {/* Header */}
            <div className="flex justify-between items-center mb-6 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                <div>
                    <h2 className="text-xl font-bold leading-tight text-slate-800">Monitoring Stok Barang</h2>
                    <p className="text-xs text-slate-500 mt-1">
                        Pantau stok real-time. Klik <span className="font-semibold text-indigo-600">Detail</span> untuk melihat rincian pasokan per supplier.
                    </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    Batas stok minimum: <span className="font-bold text-slate-700 ml-1">{stokLimit} unit</span>
                </div>
            </div>

            {/* Search */}
            <div className="mb-6 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <div className="relative max-w-sm">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                        <Search className="w-4 h-4" />
                    </span>
                    <input
                        type="text"
                        placeholder="Cari kode/nama barang atau kategori..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 pl-10 pr-4 py-2 text-sm transition-all"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden mb-6">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">No</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Barang</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Kategori</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Satuan</th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Total Masuk</th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Total Keluar</th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Stok Akhir</th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {barang.data && barang.data.length > 0 ? (
                                barang.data.map((item, index) => {
                                    const status = getStokStatus(item.stok);
                                    return (
                                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                                                {barang.from + index}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-slate-100 p-2 rounded-lg">
                                                        <Package className="w-4 h-4 text-slate-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900">{item.nama_barang}</p>
                                                        <p className="text-[10px] text-slate-400 font-mono uppercase">{item.kode_barang}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded uppercase">
                                                    {item.kategori}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600">{item.satuan}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex items-center gap-1 text-sm font-bold text-emerald-700">
                                                    <ArrowDownToLine className="w-3.5 h-3.5" />
                                                    {item.masuk}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex items-center gap-1 text-sm font-bold text-rose-700">
                                                    <ArrowUpFromLine className="w-3.5 h-3.5" />
                                                    {item.keluar}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`text-base font-extrabold ${status.color}`}>
                                                    {item.stok}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() => setDetailItem(item)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white text-xs font-bold transition-all border border-indigo-100 hover:border-indigo-600"
                                                >
                                                    <TrendingUp className="w-3.5 h-3.5" />
                                                    Detail
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="9" className="px-6 py-12 text-center text-slate-400">
                                        <div className="flex flex-col items-center gap-2">
                                            <Package className="w-10 h-10 opacity-20" />
                                            <p className="text-sm font-medium">Data stok belum tersedia.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Pagination links={barang.links} />

            {/* Detail Modal */}
            {detailItem && (
                <DetailModal
                    item={detailItem}
                    stokLimit={stokLimit}
                    onClose={() => setDetailItem(null)}
                />
            )}
        </>
    );
}

function DetailModal({ item, stokLimit, onClose }) {
    const getColor = (stok) => {
        if (stok <= 0) return "text-rose-600";
        if (stok <= stokLimit) return "text-amber-600";
        return "text-emerald-600";
    };

    // Calculate percentage per supplier for the bar chart
    const totalMasuk = item.masuk || 1;
    const colors = [
        "bg-indigo-500", "bg-violet-500", "bg-sky-500",
        "bg-teal-500", "bg-amber-500", "bg-rose-500",
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-start justify-between rounded-t-2xl z-10">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-100 p-2.5 rounded-xl">
                            <Package className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">{item.nama_barang}</h3>
                            <p className="text-xs text-slate-400 font-mono uppercase">{item.kode_barang}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-center">
                            <ArrowDownToLine className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                            <p className="text-2xl font-extrabold text-emerald-700">{item.masuk}</p>
                            <p className="text-xs text-emerald-600 font-medium mt-0.5">Total Masuk</p>
                        </div>
                        <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 text-center">
                            <ArrowUpFromLine className="w-5 h-5 text-rose-600 mx-auto mb-1" />
                            <p className="text-2xl font-extrabold text-rose-700">{item.keluar}</p>
                            <p className="text-xs text-rose-600 font-medium mt-0.5">Total Keluar</p>
                        </div>
                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-center">
                            <BoxesIcon className="w-5 h-5 text-slate-500 mx-auto mb-1" />
                            <p className={`text-2xl font-extrabold ${getColor(item.stok)}`}>{item.stok}</p>
                            <p className="text-xs text-slate-500 font-medium mt-0.5">Stok Akhir ({item.satuan})</p>
                        </div>
                    </div>

                    {/* Supplier Breakdown */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Truck className="w-4 h-4 text-indigo-500" />
                            <h4 className="text-sm font-bold text-slate-800">Rincian Barang Masuk per Supplier</h4>
                        </div>

                        {item.supplier_breakdown && item.supplier_breakdown.length > 0 ? (
                            <div className="space-y-3">
                                {item.supplier_breakdown.map((s, i) => {
                                    const pct = totalMasuk > 0 ? Math.round((s.total_jumlah / totalMasuk) * 100) : 0;
                                    const barColor = colors[i % colors.length];
                                    return (
                                        <div key={i} className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-3 h-3 rounded-full ${barColor}`} />
                                                    <span className="text-sm font-bold text-slate-800">{s.nama_supplier}</span>
                                                </div>
                                                <span className="text-sm font-extrabold text-emerald-700">
                                                    {s.total_jumlah} {item.satuan}
                                                </span>
                                            </div>

                                            {/* Progress bar */}
                                            <div className="h-2 bg-slate-200 rounded-full overflow-hidden mb-2">
                                                <div
                                                    className={`h-full rounded-full transition-all ${barColor}`}
                                                    style={{ width: `${pct}%` }}
                                                />
                                            </div>

                                            <div className="flex items-center justify-between text-xs text-slate-500">
                                                <span>{pct}% dari total masuk</span>
                                                <span className="flex items-center gap-3">
                                                    <span>{s.jumlah_transaksi}x transaksi</span>
                                                    <span>
                                                        Terakhir:{" "}
                                                        {new Date(s.terakhir_masuk).toLocaleDateString("id-ID", {
                                                            day: "numeric",
                                                            month: "short",
                                                            year: "numeric",
                                                        })}
                                                    </span>
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-slate-400">
                                <Truck className="w-10 h-10 opacity-20 mx-auto mb-2" />
                                <p className="text-sm">Belum ada data barang masuk untuk barang ini.</p>
                            </div>
                        )}
                    </div>

                    {/* Info Footer */}
                    <div className="bg-slate-50 rounded-xl p-4 flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <p className="text-xs text-slate-500">
                            Kategori: <span className="font-semibold text-slate-700">{item.kategori}</span>
                            {" · "}
                            Satuan: <span className="font-semibold text-slate-700">{item.satuan}</span>
                            {" · "}
                            {item.supplier_breakdown?.length || 0} supplier aktif
                        </p>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="sticky bottom-0 bg-white border-t border-slate-100 px-6 py-4 rounded-b-2xl">
                    <button
                        onClick={onClose}
                        className="w-full px-5 py-2.5 rounded-lg border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-all text-sm"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
}

Index.layout = (page) => <AdminLayout children={page} />;