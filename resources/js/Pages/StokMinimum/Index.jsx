import React, { useState, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router } from "@inertiajs/react";
import { AlertTriangle, Package, Search } from "lucide-react";

export default function Index({ barang, limit, is_event_month, filters = {} }) {
    const [search, setSearch] = useState(filters.search || "");

    useEffect(() => {
        const delay = setTimeout(() => {
            router.get(
                route("stok-minimum.index"),
                { search },
                { preserveState: true, replace: true }
            );
        }, 300);
        return () => clearTimeout(delay);
    }, [search]);

    return (
        <AdminLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-800">Monitoring Stok Minimum</h2>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${
                        is_event_month 
                        ? 'bg-orange-100 text-orange-700 border-orange-200' 
                        : 'bg-blue-100 text-blue-700 border-blue-200'
                    }`}>
                        Threshold: {limit} Unit ({is_event_month ? 'Bulan Event' : 'Bulan Normal'})
                    </div>
                </div>
            }
        >
            <Head title="Stok Minimum" />

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-4 bg-slate-50/50 border-b border-slate-100">
                    <div className="relative max-w-sm">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                            <Search className="w-4 h-4" />
                        </span>
                        <input
                            type="text"
                            placeholder="Cari barang..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-white border-slate-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2"
                        />
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
                                <th className="px-6 py-3">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {barang.length > 0 ? barang.map((item, index) => (
                                <tr key={item.id} className="hover:bg-slate-50 transition-colors text-center">
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        {index + 1}
                                    </td>
                                    <td className="px-6 py-4 text-left">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-slate-100 p-2 rounded-lg text-slate-400">
                                                <Package className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 leading-none">{item.nama_barang}</p>
                                                <p className="text-[10px] text-slate-500 mt-1 font-mono">{item.kode_barang}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        {item.kategori?.nama_kategori || '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-bold text-rose-600">
                                            {item.stok} {item.satuan?.nama}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-100">
                                            <AlertTriangle className="w-3 h-3" />
                                            Limit Stok
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button 
                                            onClick={() => window.location.href = `/barang-masuk/create?barang_id=${item.id}`}
                                            className="text-xs bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-1.5 rounded-lg font-bold transition-all shadow-sm"
                                        >
                                            Restock
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-2 text-slate-400">
                                            <Package className="w-10 h-10 mb-2 opacity-20" />
                                            <p className="text-sm font-medium">Semua stok barang aman.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}