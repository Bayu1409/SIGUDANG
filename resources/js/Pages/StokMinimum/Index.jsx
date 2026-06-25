import React, { useState, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router, Link } from "@inertiajs/react";
import { AlertTriangle, Package, Search, ChevronDown, RotateCcw } from "lucide-react";

export default function Index({ barang, limit, is_event_month, kategoris = [], filters = {} }) {
    const [search, setSearch] = useState(filters.search || "");
    const [kategoriId, setKategoriId] = useState(filters.kategori_id || "");

    const isInitialRender = React.useRef(true);

    useEffect(() => {
        if (isInitialRender.current) { isInitialRender.current = false; return; }
        const delay = setTimeout(() => {
            router.get(
                route("stok-minimum.index"),
                { search, kategori_id: kategoriId },
                { preserveState: true, replace: true, preserveScroll: true }
            );
        }, 300);
        return () => clearTimeout(delay);
    }, [search, kategoriId]);

    return (
        <>
            <Head title="Stok Minimum" />

            <div className="flex justify-between items-center mb-6 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                <h2 className="text-xl font-bold text-slate-800">Monitoring Stok Minimum</h2>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${
                    is_event_month 
                    ? 'bg-orange-100 text-orange-700 border-orange-200' 
                    : 'bg-blue-100 text-blue-700 border-blue-200'
                }`}>
                    Batas Minimum: {limit} Unit ({is_event_month ? 'Bulan Event' : 'Bulan Normal'})
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden mb-6">
                <div className="p-4 bg-slate-50/50 border-b border-slate-100">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="relative flex-1 w-full">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                                <Search className="w-4 h-4" />
                            </span>
                            <input
                                type="text"
                                placeholder="Cari nama atau kode barang..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-white border-slate-200 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block pl-10 p-2 transition-all shadow-sm font-medium"
                            />
                        </div>

                        <div className="relative w-full md:w-64">
                            <select
                                value={kategoriId}
                                onChange={(e) => setKategoriId(e.target.value)}
                                className="w-full appearance-none bg-white border-slate-200 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block pl-4 pr-10 p-2 transition-all shadow-sm font-medium text-slate-700"
                            >
                                <option value="">Semua Kategori</option>
                                {kategoris.map((kat) => (
                                    <option key={kat.id} value={kat.id}>
                                        {kat.nama_kategori}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>

                        {(search || kategoriId) && (
                            <button
                                onClick={() => { setSearch(""); setKategoriId(""); }}
                                className="w-full md:w-auto px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-lg border border-slate-200 transition-all flex items-center justify-center gap-1.5"
                            >
                                <RotateCcw className="w-3.5 h-3.5" /> Reset
                            </button>
                        )}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                            <tr>
                                <th className="px-6 py-3">No</th>
                                <th className="px-6 py-3">Barang</th>
                                <th className="px-6 py-3">Kategori</th>
                                <th className="px-6 py-3">Stok</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {barang.length > 0 ? (
                                barang.map((item, index) => (
                                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-slate-500 text-center">
                                            {index + 1}
                                        </td>
                                        <td className="px-6 py-4 text-left">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-slate-100 rounded-lg overflow-hidden w-10 h-10 flex flex-shrink-0 items-center justify-center border border-slate-200">
                                                    {item.foto ? (
                                                        <img src={`/storage/${item.foto}`} alt={item.nama_barang} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Package className="w-5 h-5 text-slate-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900 leading-none">{item.nama_barang}</p>
                                                    <p className="text-[10px] text-slate-500 mt-1 font-mono uppercase">{item.kode_barang}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                                                {item.kategori?.nama_kategori || '-'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded w-fit">
                                                    {item.stok} {item.satuan?.nama}
                                                </span>
                                                {item.nilai_konversi > 1 && (
                                                    <span className="text-[10px] text-slate-400 mt-1 font-medium">
                                                        ({(item.stok * item.nilai_konversi).toLocaleString()} Unit/Biji)
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-700 border border-rose-200">
                                                <AlertTriangle className="w-3 h-3" />
                                                Min: {item.batas_minimum > 0 ? (item.batas_minimum * (item.nilai_konversi || 1)).toLocaleString() : limit.toLocaleString()} Unit
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <Link 
                                                href={route('barang-masuk.create', { barang_id: item.id })}
                                                className="inline-block text-xs bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-1.5 rounded-lg font-bold transition-all shadow-lg shadow-indigo-500/20"
                                            >
                                                Restock
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-2 text-slate-400">
                                            <Package className="w-10 h-10 mb-2 opacity-20" />
                                            <p className="text-sm font-medium">Stok aman atau tidak ada data yang cocok.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

Index.layout = (page) => <AdminLayout children={page} />;