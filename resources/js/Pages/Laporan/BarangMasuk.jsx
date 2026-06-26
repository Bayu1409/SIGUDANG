import React, { useState, useEffect } from "react";
import { Link, router, Head, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import Pagination from "@/Components/Pagination";
import ConfirmationModal from "@/Components/ConfirmationModal";
import { Search, ChevronDown, Download, RotateCcw, Calendar, Truck, Package } from "lucide-react";

export default function BarangMasuk({ data, filters = {}, suppliers = [], barangs = [] }) {
    const [dari, setDari]         = useState(filters.dari || "");
    const [sampai, setSampai]     = useState(filters.sampai || "");
    const [search, setSearch]     = useState(filters.search || "");
    const [supplierId, setSupplierId] = useState(filters.supplier_id || "");
    const [barangId, setBarangId]     = useState(filters.barang_id || "");

    const [showExportConfirm, setShowExportConfirm] = useState(false);

    const isInitialRender = React.useRef(true);
    
    useEffect(() => {
        if (isInitialRender.current) { isInitialRender.current = false; return; }
        const delay = setTimeout(() => {
            router.get(route("laporan.barang-masuk"),
                { dari, sampai, search, supplier_id: supplierId, barang_id: barangId },
                { preserveState: true, replace: true, preserveScroll: true });
        }, 500);
        return () => clearTimeout(delay);
    }, [search, dari, sampai, supplierId, barangId]);

    const setQuickDate = (type) => {
        const today = new Date();
        const formatDate = (dateObj) => {
            const y = dateObj.getFullYear();
            const m = String(dateObj.getMonth() + 1).padStart(2, '0');
            const d = String(dateObj.getDate()).padStart(2, '0');
            return `${y}-${m}-${d}`;
        };

        if (type === 'hari_ini') {
            const str = formatDate(today);
            setDari(str); setSampai(str);
        } else if (type === 'bulan_ini') {
            const first = new Date(today.getFullYear(), today.getMonth(), 1);
            const last = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            setDari(formatDate(first)); setSampai(formatDate(last));
        } else if (type === 'tahun_ini') {
            setDari(`${today.getFullYear()}-01-01`);
            setSampai(`${today.getFullYear()}-12-31`);
        }
    };

    const performExport = () => {
        setShowExportConfirm(false);
        const url = route("laporan.barang-masuk.export", { dari, sampai, search, supplier_id: supplierId, barang_id: barangId });
        window.open(url, "_blank");
    };

    const resetFilters = () => {
        setDari(""); setSampai(""); setSearch(""); setSupplierId(""); setBarangId("");
    };

    return (
        <>
            <Head title="Laporan Barang Masuk" />
            <div className="p-6">
                <div className="flex justify-between items-center mb-6 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Laporan Barang Masuk</h2>
                        <p className="text-xs text-slate-500 mt-1">Gunakan filter untuk menyaring data mutasi masuk.</p>
                    </div>
                    <button 
                        onClick={() => setShowExportConfirm(true)}
                        disabled={!data?.data || data.data.length === 0}
                        title={(!data?.data || data.data.length === 0) ? "Tidak ada data untuk diunduh" : "Unduh Laporan Excel"}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-emerald-600 disabled:shadow-none"
                    >
                        <Download className="w-4 h-4" /> Unduh Excel
                    </button>
                </div>

                {/* FILTER CARD */}
                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                        {/* Dari */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                <Calendar className="w-3 h-3" /> Dari Tanggal
                            </label>
                            <input type="date" value={dari} onChange={(e) => setDari(e.target.value)}
                                className="w-full rounded-lg border-slate-200 text-sm focus:ring-indigo-500 focus:border-indigo-500 transition-all" />
                        </div>
                        {/* Sampai */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                <Calendar className="w-3 h-3" /> Sampai Tanggal
                            </label>
                            <input type="date" value={sampai} onChange={(e) => setSampai(e.target.value)}
                                className="w-full rounded-lg border-slate-200 text-sm focus:ring-indigo-500 focus:border-indigo-500 transition-all" />
                        </div>
                        {/* Supplier */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                <Truck className="w-3 h-3" /> Supplier
                            </label>
                            <div className="relative">
                                <select value={supplierId} onChange={(e) => setSupplierId(e.target.value)}
                                    className="w-full rounded-lg border-slate-200 text-sm appearance-none pr-10 focus:ring-indigo-500 focus:border-indigo-500 transition-all">
                                    <option value="">Semua Supplier</option>
                                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.nama_supplier}</option>)}
                                </select>
                                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                        </div>
                        {/* Barang */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                <Package className="w-3 h-3" /> Barang
                            </label>
                            <div className="relative">
                                <select value={barangId} onChange={(e) => setBarangId(e.target.value)}
                                    className="w-full rounded-lg border-slate-200 text-sm appearance-none pr-10 focus:ring-indigo-500 focus:border-indigo-500 transition-all">
                                    <option value="">Semua Barang</option>
                                    {barangs.map(b => <option key={b.id} value={b.id}>{b.nama_barang}</option>)}
                                </select>
                                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                        </div>
                        {/* Search */}
                        <div className="space-y-1.5 relative">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                <Search className="w-3 h-3" /> Cari Keyword
                            </label>
                            <input type="text" placeholder="Ketik..." value={search} onChange={(e) => setSearch(e.target.value)}
                                className="w-full rounded-lg border-slate-200 text-sm focus:ring-indigo-500 focus:border-indigo-500 transition-all" />
                        </div>
                    </div>

                    <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-50">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-tight mr-1">Filter Cepat:</span>
                            {['hari_ini', 'bulan_ini', 'tahun_ini'].map(t => (
                                <button key={t} type="button" onClick={() => setQuickDate(t)}
                                    className="px-3 py-1.5 rounded-full text-[11px] font-bold bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200 transition-all capitalize">
                                    {t.replace('_', ' ')}
                                </button>
                            ))}
                        </div>
                        <button onClick={resetFilters}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-slate-500 hover:bg-slate-50 text-xs font-bold transition-all border border-slate-200">
                            <RotateCcw className="w-3.5 h-3.5" /> Reset Filter
                        </button>
                    </div>
                </div>

                {/* TABLE */}
                <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden mb-6">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-100">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">No</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Waktu & Tanggal</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Barang</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Kategori</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Supplier</th>
                                    <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase">Jumlah</th>
                                </tr>
							</thead>
                            <tbody className="divide-y divide-slate-100">
                                {data.data && data.data.length > 0 ? (
                                    data.data.map((item, index) => (
                                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4 text-sm text-slate-500 font-medium">{data.from + index}</td>
                                            <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                                                {new Date(item.created_at).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-bold text-slate-900">{item.barang?.nama_barang}</div>
                                                <div className="text-[10px] text-slate-400 font-mono">{item.barang?.kode_barang}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                                                    {item.barang?.kategori?.nama_kategori || "-"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-700 font-semibold">{item.supplier?.nama_supplier || "-"}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex items-center gap-1 text-sm font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                                                    {item.jumlah} <span className="text-[10px] text-emerald-400">{item.barang?.satuan?.nama}</span>
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center py-16">
                                            <div className="flex flex-col items-center gap-2 text-slate-300">
                                                <RotateCcw className="w-12 h-12 opacity-20" />
                                                <p className="text-sm font-medium">Tidak ada data ditemukan.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <Pagination links={data.links} />

                <ConfirmationModal
                    show={showExportConfirm}
                    onClose={() => setShowExportConfirm(false)}
                    onConfirm={performExport}
                    title="Konfirmasi Unduh Laporan"
                    message="Apakah Anda yakin ingin mengunduh laporan Barang Masuk dalam format Excel?"
                    confirmText="Ya, Unduh"
                    type="info"
                />
            </div>
        </>
    );
}

BarangMasuk.layout = (page) => <AdminLayout children={page} />;
