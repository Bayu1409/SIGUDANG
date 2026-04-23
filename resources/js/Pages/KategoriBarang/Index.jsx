import React, { useState, useEffect } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import Pagination from "@/Components/Pagination";

export default function Index({ kategori, filters = {} }) {
    const [search, setSearch] = useState(filters.search || "");

    const isInitialRender = React.useRef(true);
    
    useEffect(() => {
        if (isInitialRender.current) {
            isInitialRender.current = false;
            return;
        }

        const delay = setTimeout(() => {
            router.get(
                route("kategori-barang.index"),
                { search },
                { preserveState: true, replace: true, preserveScroll: true }
            );
        }, 300);
        return () => clearTimeout(delay);
    }, [search]);

    const handleDelete = (id) => {

        if (confirm("Yakin ingin menghapus kategori ini?")) {

            router.delete(`/kategori-barang/${id}`);

        }

    };

    return (

        <AdminLayout>

            <div className="p-6">

                {/* HEADER */}

                <div className="flex justify-between items-center mb-6">

                    <h2 className="text-2xl font-semibold text-gray-800">
                        Manajemen Kategori Barang
                    </h2>

                    <Link
                        href="/kategori-barang/create"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
                    >
                        + Tambah Kategori
                    </Link>

                </div>

                {/* SEARCH */}
                <div className="mb-4 bg-white p-4 rounded shadow">
                    <input
                        type="text"
                        placeholder="Cari kategori barang..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full md:w-1/3 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                {/* CARD */}

                <div className="bg-white shadow rounded-lg overflow-hidden">

                    <table className="min-w-full border border-gray-200">

                        <thead className="bg-gray-100">

                            <tr>

                                <th className="px-4 py-2 border">No</th>
                                <th className="px-4 py-2 border">Nama Kategori</th>
                                <th className="px-4 py-2 border">Deskripsi</th>
                                <th className="px-4 py-2 border">Aksi</th>

                            </tr>

                        </thead>

                        <tbody>

                            {kategori.data && kategori.data.length > 0 ? (

                                kategori.data.map((item, index) => (

                                    <tr key={item.id} className="text-center">

                                        <td className="border px-4 py-2">
                                            {kategori.from + index}
                                        </td>

                                        <td className="border px-4 py-2">
                                            {item.nama_kategori}
                                        </td>

                                        <td className="border px-4 py-2">
                                            {item.deskripsi ?? "-"}
                                        </td>

                                        <td className="border px-4 py-2 space-x-2">

                                            <Link
                                                href={`/kategori-barang/${item.id}/edit`}
                                                className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
                                            >
                                                Edit
                                            </Link>

                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                                            >
                                                Hapus
                                            </button>

                                        </td>

                                    </tr>

                                ))

                            ) : (

                                <tr>

                                    <td colSpan="4" className="text-center py-4">

                                        Data kategori belum tersedia

                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>
                {/* PAGINATION */}
                <Pagination links={kategori.links} />

            </div>

        </AdminLayout>

    );

}