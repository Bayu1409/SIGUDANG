import React from "react";
import { Link, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";

export default function Index({ kategori }) {

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

                            {kategori.length > 0 ? (

                                kategori.map((item, index) => (

                                    <tr key={item.id} className="text-center">

                                        <td className="border px-4 py-2">
                                            {index + 1}
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

            </div>

        </AdminLayout>

    );

}