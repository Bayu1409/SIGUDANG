import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Index({ kategori }) {
    const { flash } = usePage().props;

    return (
        <AdminLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold">Manajemen Kategori</h2>
                    <Link
                        href={route('kategori.create')}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Tambah Kategori
                    </Link>
                </div>
            }
        >
            <Head title="Kategori" />

            {flash.success && (
                <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
                    {flash.success}
                </div>
            )}

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold">No</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Nama Kategori</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {kategori.map((item, index) => (
                            <tr key={item.id} className="border-b hover:bg-gray-50">
                                <td className="px-6 py-4">{index + 1}</td>
                                <td className="px-6 py-4">{item.nama_kategori}</td>
                                <td className="px-6 py-4 space-x-2">
                                    <Link
                                        href={route('kategori.edit', item.id)}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        Edit
                                    </Link>
                                    <Link
                                        href={route('kategori.destroy', item.id)}
                                        method="delete"
                                        as="button"
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        Hapus
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}