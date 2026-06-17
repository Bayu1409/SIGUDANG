import React, { useState, useEffect } from "react";
import { router, Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import Pagination from "@/Components/Pagination";
import ConfirmationModal from "@/Components/ConfirmationModal";
import { Search, ChevronDown, Download, RotateCcw, Calendar, Folder, Clock, AlertTriangle } from "lucide-react";

export default function DeadStock({ barang, filters = {}, kategoris = [], limit_dead_stock = 30 }) {
    const [sampai, setSampai] = useState(filters.sampai || "");
    const [search, setSearch] = useState(filters.search || "");
    const [kategoriId, setKategoriId] = useState(filters.kategori_id || "");

    const [showExportConfirm, setShowExportConfirm] = useState(false);

    const isInitialRender = React.useRef(true);

    useEffect(() => {
        if (isInitialRender.current) { isInitialRender.current = false; return; }
        const delay = setTimeout(() => {
            router.get(route("laporan.dead-stock"),
                { sampai, search, kategori_id: kategoriId },
                { preserveState: true, replace: true, preserveScroll: true });
        }, 500);
        return () => clearTimeout(delay);
    }, [search, sampai, kategoriId]);

    const performExport = () => {
        setShowExportConfirm(false);
        const url = route("laporan.dead-stock.export", { sampai, search, kategori_id: kategoriId });
        window.open(url, "_blank");
    };

    const resetFilters = () => {
        setSampai(""); setSearch(""); setKategoriId("");
    };

    return (
        <AdminLayout>
            <Head title="Laporan Dead Stock" />
            <div className="p-6">

                {/* HEADER */}
                <div className="flex justify-between items-center mb-6 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 tracking-tight">
                            Laporan Dead Stock
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">
                            Daftar barang yang tidak ada pergerakan keluar dalam jangka waktu lama.
                        </p>
                    </div>
                    <button
                        onClick={() => setShowExportConfirm(true)}
                        disabled={!barang?.data || barang.data.length === 0}
                        title={(!barang?.data || barang.data.length === 0) ? "Tidak ada data untuk diunduh" : "Unduh Laporan Excel"}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-emerald-600 disabled:shadow-none"
                    >
                        <Download className="w-4 h-4" /> Unduh Excel
                    </button>
                </div>

                {/* FILTER CARD */}
                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">

                        {/* Tanggal Referensi */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                <Calendar className="w-3 h-3" /> Tanggal Referensi
                            </label>
                            <input
                                type="date"
                                value={sampai}
                                onChange={(e) => setSampai(e.target.value)}
                                className="w-full rounded-lg border-slate-200 text-sm focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                            />
                        </div>

                        {/* Kategori */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                <Folder className="w-3 h-3" /> Kategori
                            </label>
                            <div className="relative">
                                <select
                                    value={kategoriId}
                                    onChange={(e) => setKategoriId(e.target.value)}
                                    className="w-full rounded-lg border-slate-200 text-sm appearance-none pr-10 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                >
                                    <option value="">Semua Kategori</option>
                                    {kategoris.map(k => (
                                        <option key={k.id} value={k.id}>{k.nama_kategori}</option>
                                    ))}
                                </select>
                                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                        </div>

                        {/* Cari Barang */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                <Search className="w-3 h-3" /> Cari Barang
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Ketik kode/nama..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="flex-1 rounded-lg border-slate-200 text-sm focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                />
                                <button
                                    onClick={resetFilters}
                                    className="px-4 py-2 rounded-lg text-slate-500 hover:bg-slate-50 text-xs font-bold transition-all border border-slate-200 flex items-center gap-1.5"
                                >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Kriteria Info - DINAMIS mengikuti pengaturan */}
                    <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-100 flex items-start gap-3">
                        <Clock className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                        <p className="text-[11px] text-amber-700 font-medium">
                            Kriteria: Barang dengan stok &gt; 0 yang tidak pernah keluar lebih dari{" "}
                            <strong className="text-amber-800">{limit_dead_stock} hari</strong>
                            {" "}/ tidak ada transaksi keluar.{" "}

                        </p>
                    </div>
                </div>

                {/* TABLE */}
                <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden mb-6">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-100">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">No</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Informasi Barang</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Kategori</th>
                                    <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Stok Tersisa</th>
                                    <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Lama Mengendap</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {barang.data && barang.data.length > 0 ? (
                                    barang.data.map((item, index) => (
                                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                                                {barang.from + index}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-bold text-slate-900">{item.nama_barang}</div>
                                                <div className="text-[10px] text-slate-400 font-mono uppercase">{item.kode_barang}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                                                    {item.kategori}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center font-bold text-slate-700 text-sm">
                                                {item.stok}{" "}
                                                <span className="text-[10px] text-slate-400 font-normal">{item.satuan}</span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {item.hari >= 999 ? (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-100">
                                                        <AlertTriangle className="w-3 h-3" />
                                                        Belum Pernah Keluar
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100">
                                                        {item.hari} Hari
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-16">
                                            <div className="flex flex-col items-center gap-2 text-slate-300">
                                                <Clock className="w-12 h-12 opacity-20" />
                                                <p className="text-sm font-medium">Tidak ada barang dead stock saat ini.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <Pagination links={barang.links} />

                <ConfirmationModal
                    show={showExportConfirm}
                    onClose={() => setShowExportConfirm(false)}
                    onConfirm={performExport}
                    title="Konfirmasi Unduh Laporan"
                    message="Apakah Anda yakin ingin mengunduh laporan Dead Stock dalam format Excel?"
                    confirmText="Ya, Unduh"
                    type="info"
                />
            </div>
        </AdminLayout>
    );
}
