import React, { useState, useEffect } from "react";
import { Link, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import Pagination from "@/Components/Pagination";
import ConfirmationModal from "@/Components/ConfirmationModal";

export default function Index({ supplier, filters = {} }) {
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
                route("supplier.index"),
                { search },
                { preserveState: true, replace: true, preserveScroll: true }
            );
        }, 300);
        return () => clearTimeout(delay);
    }, [search]);

    const handleDelete = () => {
        if (confirmDelete.id) {
            router.delete(`/supplier/${confirmDelete.id}`, {
                onSuccess: () => setConfirmDelete({ show: false, id: null }),
            });
        }
    };

    return (

        <AdminLayout>

            <div className="">

                {/* HEADER */}

                <div className="flex justify-between items-center mb-6">

                    <h2 className="text-2xl font-semibold text-gray-800">
                        Manajemen Supplier
                    </h2>

                    <Link
                        href="/supplier/create"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
                    >
                        + Tambah Supplier
                    </Link>

                </div>

                {/* SEARCH */}
                <div className="mb-4 bg-white p-4 rounded shadow">
                    <input
                        type="text"
                        placeholder="Cari nama, email, atau telepon supplier..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full md:w-1/3 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                {/* GRID SUPPLIER */}

                {supplier.data && supplier.data.length > 0 ? (

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {supplier.data.map((item) => (

                            <div
                                key={item.id}
                                className="bg-white rounded-xl shadow border p-5 hover:shadow-lg transition"
                            >

                                {/* AVATAR */}

                                <div className="flex flex-col items-center mb-4">

                                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl">

                                        👤

                                    </div>

                                    <h3 className="mt-2 font-semibold text-gray-800 text-center">

                                        {item.nama_supplier}

                                    </h3>

                                </div>

                                {/* DETAIL */}

                                <div className="space-y-2 text-sm text-gray-700">

                                    <p className="flex items-center gap-2">

                                        📧
                                        {item.email ?? "-"}

                                    </p>

                                    <p className="flex items-center gap-2">

                                        📞
                                        {item.telepon ?? "-"}

                                    </p>

                                    <p className="flex items-center gap-2">

                                        📍
                                        {item.alamat ?? "-"}

                                    </p>

                                </div>

                                {/* ACTION */}

                                <div className="flex justify-center gap-2 mt-4">

                                    <Link
                                        href={`/supplier/${item.id}/edit`}
                                        className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                                    >
                                        Edit
                                    </Link>

                                    <button
                                        onClick={() => setConfirmDelete({ show: true, id: item.id })}
                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                                    >
                                        Hapus
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                ) : (

                    <div className="bg-white p-6 rounded shadow text-center">

                        Data supplier belum tersedia

                    </div>

                )}

            </div>

            <Pagination links={supplier.links} />

            <ConfirmationModal
                show={confirmDelete.show}
                onClose={() => setConfirmDelete({ show: false, id: null })}
                onConfirm={handleDelete}
                title="Hapus Supplier"
                message="Apakah Anda yakin ingin menghapus supplier ini? Semua data terkait supplier ini akan tetap ada namun supplier tidak dapat ditemukan lagi di masa mendatang."
                type="danger"
                confirmText="Hapus Sekarang"
            />
        </AdminLayout>
    );
}