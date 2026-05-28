import React, { useState, useEffect } from "react";
import { Link, router, Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import Pagination from "@/Components/Pagination";
import { Download, FileText, Package, Plus, Search, Trash2, Edit3 } from "lucide-react";

export default function Index({ barangMasuk, filters = {} }) {
    const [search, setSearch] = useState(filters.search || "");

    const isInitialRender = React.useRef(true);

    useEffect(() => {
        if (isInitialRender.current) {
            isInitialRender.current = false;
            return;
        }

        const delay = setTimeout(() => {
            router.get(
                route("barang-masuk.index"),
                { search },
                { preserveState: true, replace: true, preserveScroll: true }
            );
        }, 300);
        return () => clearTimeout(delay);
    }, [search]);

    return (
        <>
            <Head title="Barang Masuk" />

            <div className="flex justify-between items-center mb-6 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                <div>
                    <h2 className="text-xl font-bold leading-tight text-slate-800">
                        Barang Masuk
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">Kelola Barang Masuk.</p>
                </div>

                <Link
                    href={route("barang-masuk.create")}
                    className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-bold shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Input Barang Masuk
                </Link>
            </div>

            {/* SEARCH */}
            <div className="mb-6 bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="relative w-full md:w-1/3">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                        <Search className="w-4 h-4" />
                    </span>
                    <input
                        type="text"
                        placeholder="Cari barang, kategori, supplier..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 pl-10 pr-4 py-2 text-sm transition-all"
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden mb-6">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">No</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Barang</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Supplier</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Waktu & Tanggal</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Stok Masuk</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Dokumen</th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                            {barangMasuk.data && barangMasuk.data.length > 0 ? barangMasuk.data.map((item, index) => (
                                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                                        {barangMasuk.from + index}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-slate-900 text-sm">
                                            {item.barang?.nama_barang}
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded uppercase">
                                                {item.barang?.kategori?.nama_kategori || "-"}
                                            </span>
                                            <span className="text-[10px] text-slate-400">
                                                / {item.barang?.satuan?.nama || "-"}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-semibold text-slate-700">
                                            {item.supplier?.nama_supplier || "-"}
                                        </div>
                                        <div className="text-[10px] text-slate-400 mt-0.5 font-medium">Supplier</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                                        {new Date(item.created_at).toLocaleString("id-ID", {
                                            dateStyle: "medium",
                                            timeStyle: "short",
                                        })}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                                            {item.jumlah}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center text-sm">
                                        {item.dokumen ? (
                                            <a
                                                href={`/storage/${item.dokumen}`}
                                                target="_blank"
                                                className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 font-bold transition-colors"
                                            >
                                                <FileText className="w-4 h-4" />
                                                Lihat
                                            </a>
                                        ) : (
                                            <span className="text-slate-300">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <Link
                                                href={route("barang-masuk.edit", item.id)}
                                                className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                                                title="Edit Data"
                                            >
                                                <Edit3 className="w-5 h-5" />
                                            </Link>
                                            <Link
                                                href={route("barang-masuk.destroy", item.id)}
                                                method="delete"
                                                as="button"
                                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                                title="Hapus"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-slate-400">
                                        <div className="flex flex-col items-center gap-2">
                                            <Package className="w-10 h-10 opacity-20" />
                                            <p className="text-sm font-medium">Belum ada data barang masuk.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Pagination links={barangMasuk.links} />
        </>
    );
}

Index.layout = (page) => <AdminLayout children={page} />;