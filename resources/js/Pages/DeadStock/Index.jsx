import React, { useState, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router } from "@inertiajs/react";
import { Package, Search, ChevronDown, RotateCcw, Calendar, Folder, Clock } from "lucide-react";

export default function Index({ barang, limit_dead_stock, kategoris = [], filters = {} }) {
    const [search, setSearch]       = useState(filters.search || "");
    const [kategoriId, setKategoriId] = useState(filters.kategori_id || "");

    const isInitialRender = React.useRef(true);
    
    useEffect(() => {
        if (isInitialRender.current) { isInitialRender.current = false; return; }
        const delay = setTimeout(() => {
            router.get(route("dead-stock.index"),
                { search, kategori_id: kategoriId },
                { preserveState: true, replace: true, preserveScroll: true });
        }, 500);
        return () => clearTimeout(delay);
    }, [search, kategoriId]);

    const resetFilters = () => {
        setSearch(""); setKategoriId("");
    };

    return (
        <AdminLayout>
            <Head title="Monitoring Dead Stock" />
            <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Monitoring Dead Stock</h2>
                        <p className="text-xs text-slate-500 mt-1">Daftar barang yang sudah lama tidak keluar.</p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-700 rounded-lg text-xs font-bold border border-rose-100">
                        <Clock className="w-4 h-4" />
                        Batas : {limit_dead_stock} Hari
                    </div>
                </div>

                {/* Filter */}
                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm mb-6">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="relative flex-1 w-full">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                                <Search className="w-4 h-4" />
                            </span>
                            <input type="text" placeholder="Cari nama atau kode barang..." value={search} onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-white border-slate-200 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block pl-10 p-2 transition-all shadow-sm font-medium" />
                        </div>
                        <div className="relative w-full md:w-64">
                            <select value={kategoriId} onChange={(e) => setKategoriId(e.target.value)}
                                className="w-full appearance-none bg-white border-slate-200 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block pl-4 pr-10 p-2 transition-all shadow-sm font-medium text-slate-700">
                                <option value="">Semua Kategori</option>
                                {kategoris.map(k => (
                                    <option key={k.id} value={k.id}>{k.nama_kategori}</option>
                                ))}
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                        {(search || kategoriId) && (
                            <button onClick={resetFilters}
                                className="w-full md:w-auto px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-lg border border-slate-200 transition-all flex items-center justify-center gap-1.5">
                                <RotateCcw className="w-3.5 h-3.5" /> Reset
                            </button>
                        )}
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden mb-6">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-100">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-tight">No</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-tight">Barang</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-tight">Kategori</th>
                                    <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-tight">Sisa Stok</th>
                                    <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-tight whitespace-nowrap">Hari Mengendap</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {barang.length > 0 ? (
                                    barang.map((item, index) => (
                                        <tr key={index} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 text-sm text-slate-500 text-center font-medium">{index + 1}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-slate-100 p-2 rounded-lg text-slate-400">
                                                        <Package className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900 leading-none">{item.nama_barang}</p>
                                                        <p className="text-[10px] text-slate-400 mt-1 font-mono uppercase">{item.kode_barang}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                                                    {item.kategori}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="text-sm font-extrabold text-slate-700 bg-slate-50 px-2 py-1 rounded">
                                                    {item.stok} <span className="text-[10px] text-slate-400 font-normal uppercase tracking-tighter ml-0.5">{item.satuan}</span>
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-100 uppercase tracking-tight shadow-sm shadow-rose-500/5">
                                                    {item.hari === 999 ? "Belum Pernah Keluar" : `${item.hari} Hari`}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center gap-2 text-slate-300">
                                                <Package className="w-12 h-12 opacity-20" />
                                                <p className="text-sm font-medium">Tidak ada barang dead stock yang cocok.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
