import React, { useState, useEffect } from "react";
import { Link, router, Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import Pagination from "@/Components/Pagination";
import ConfirmationModal from "@/Components/ConfirmationModal";
import { Edit3, Package, Plus, Search, Trash2, Box } from "lucide-react";

export default function Index({ barang, filters = {} }) {
    const [search, setSearch] = useState(filters.search || "");
    const [confirmDelete, setConfirmDelete] = useState({ show: false, id: null });

    const isInitialRender = React.useRef(true);

    useEffect(() => {
        if (isInitialRender.current) {
            isInitialRender.current = false;
            return;
        }

        const delay = setTimeout(() => {
            router.get(
                route("barang.index"),
                { search },
                { preserveState: true, replace: true, preserveScroll: true }
            );
        }, 300);
        return () => clearTimeout(delay);
    }, [search]);

    const handleDelete = () => {
        if (confirmDelete.id) {
            router.delete(`/barang/${confirmDelete.id}`, {
                onSuccess: () => setConfirmDelete({ show: false, id: null }),
            });
        }
    };

    return (
        <>
            <Head title="Manajemen Barang" />

            <div className="flex justify-between items-center mb-6 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                <div>
                    <h2 className="text-xl font-bold leading-tight text-slate-800">
                        Katalog Master Barang
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">Kelola data induk barang, kategori, dan satuan stok.</p>
                </div>

                <Link
                    href={route("barang.create")}
                    className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-bold shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Tambah Barang
                </Link>
            </div>

            {/* SEARCH */}
            <div className="mb-6 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <div className="relative max-w-sm">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                        <Search className="w-4 h-4" />
                    </span>
                    <input
                        type="text"
                        placeholder="Cari nama, kode, atau kategori..."
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
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium">
                                            {barang.from + index}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-slate-100 p-2 rounded-lg text-slate-400">
                                                    <Box className="w-5 h-5" />
                                                </div>
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
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                            {item.satuan?.nama || "-"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <Link
                                                    href={route("barang.edit", item.id)}
                                                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                                    title="Edit Barang"
                                                >
                                                    <Edit3 className="w-5 h-5" />
                                                </Link>
                                                <button
                                                    onClick={() => setConfirmDelete({ show: true, id: item.id })}
                                                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                                    title="Hapus Barang"
                                                >
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

            <ConfirmationModal
                show={confirmDelete.show}
                onClose={() => setConfirmDelete({ show: false, id: null })}
                onConfirm={handleDelete}
                title="Hapus Barang"
                message="Apakah Anda yakin ingin menghapus barang ini? Data yang dihapus tidak dapat dikembalikan."
                type="danger"
                confirmText="Hapus Sekarang"
            />
        </>
    );
}

Index.layout = (page) => <AdminLayout children={page} />;