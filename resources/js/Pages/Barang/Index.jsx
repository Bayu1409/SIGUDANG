import React, { useState, useEffect } from "react";
import { Link, router, Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import Pagination from "@/Components/Pagination";
import { Edit3, Package, Plus, Search, Trash2, Box, ChevronDown, X } from "lucide-react";

export default function Index({ barang, filters = {}, kategoris = [] }) {
    const [search, setSearch]       = useState(filters.search || "");
    const [kategoriId, setKategoriId] = useState(filters.kategori_id || "");
    const [confirmDelete, setConfirmDelete] = useState({ show: false, id: null, name: "" });

    const isInitialRender = React.useRef(true);

    useEffect(() => {
        if (isInitialRender.current) { isInitialRender.current = false; return; }
        const delay = setTimeout(() => {
            router.get(route("barang.index"), { search, kategori_id: kategoriId },
                { preserveState: true, replace: true, preserveScroll: true });
        }, 300);
        return () => clearTimeout(delay);
    }, [search, kategoriId]);

    const handleDelete = () => {
        if (confirmDelete.id) {
            router.delete(`/barang/${confirmDelete.id}`, {
                onSuccess: () => setConfirmDelete({ show: false, id: null, name: "" }),
            });
        }
    };

    const resetFilters = () => { setSearch(""); setKategoriId(""); };
    const hasFilter = search || kategoriId;

    return (
        <>
            <Head title="Manajemen Barang" />

            <div className="flex justify-between items-center mb-6 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                <div>
                    <h2 className="text-xl font-bold leading-tight text-slate-800">Katalog Master Barang</h2>
                    <p className="text-xs text-slate-500 mt-1">Kelola data induk barang, kategori, dan satuan stok.</p>
                </div>
                <Link href={route("barang.create")}
                    className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-bold shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Tambah Barang
                </Link>
            </div>

            {/* FILTER */}
            <div className="mb-6 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                    {/* Search */}
                    <div className="relative flex-1 min-w-0">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                            <Search className="w-4 h-4" />
                        </span>
                        <input type="text" placeholder="Cari nama, kode barang..."
                            value={search} onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 pl-10 pr-4 py-2 text-sm transition-all" />
                    </div>

                    {/* Dropdown Kategori */}
                    <div className="relative min-w-[180px]">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                            <ChevronDown className="w-4 h-4" />
                        </span>
                        <select value={kategoriId} onChange={(e) => setKategoriId(e.target.value)}
                            className="w-full appearance-none rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 pl-9 pr-4 py-2 text-sm transition-all bg-white text-slate-700">
                            <option value="">Semua Kategori</option>
                            {kategoris.map((k) => (
                                <option key={k.id} value={k.id}>{k.nama_kategori}</option>
                            ))}
                        </select>
                    </div>

                    {/* Reset */}
                    {hasFilter && (
                        <button onClick={resetFilters}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-slate-500 hover:bg-slate-100 text-xs font-semibold transition-all border border-slate-200">
                            <X className="w-3.5 h-3.5" /> Reset
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden mb-6">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">No</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Informasi Barang</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Kategori</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Satuan</th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {barang.data && barang.data.length > 0 ? (
                                barang.data.map((item, index) => (
                                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium">{barang.from + index}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-slate-100 p-2 rounded-lg text-slate-400"><Box className="w-5 h-5" /></div>
                                                <div>
                                                    <div className="text-sm font-bold text-slate-900">{item.nama_barang}</div>
                                                    <div className="text-[10px] text-slate-400 uppercase tracking-tight font-medium">{item.kode_barang}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                                                {item.kategori?.nama_kategori || "-"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{item.satuan?.nama || "-"}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <Link href={route("barang.edit", item.id)}
                                                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="Edit Barang">
                                                    <Edit3 className="w-5 h-5" />
                                                </Link>
                                                <button onClick={() => setConfirmDelete({ show: true, id: item.id, name: item.nama_barang })}
                                                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all" title="Hapus Barang">
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                                        <div className="flex flex-col items-center gap-2">
                                            <Package className="w-10 h-10 opacity-20" />
                                            <p className="text-sm font-medium">Daftar barang masih kosong.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Pagination links={barang.links} />

            {/* Confirmation Modal */}
            {confirmDelete.show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center">
                        <div className="flex justify-center mb-4">
                            <div className="bg-rose-100 p-4 rounded-full"><Trash2 className="w-8 h-8 text-rose-600" /></div>
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">Hapus Barang?</h3>
                        <p className="text-sm text-slate-500 mb-6">
                            Barang <span className="font-semibold text-slate-700">{confirmDelete.name}</span> akan
                            dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.
                        </p>
                        <div className="flex gap-3 justify-center">
                            <button onClick={() => setConfirmDelete({ show: false, id: null, name: "" })}
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
            )}
        </>
    );
}

Index.layout = (page) => <AdminLayout children={page} />;