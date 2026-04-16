import React from 'react';
import { useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Edit({ kategori }) {
    const { data, setData, put, processing, errors } = useForm({
        nama_kategori: kategori.nama_kategori,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('kategori.update', kategori.id));
    };

    return (
        <AdminLayout
            header={<h2 className="text-2xl font-semibold">Edit Kategori</h2>}
        >
            <Head title="Edit Kategori" />

            <div className="bg-white rounded-lg shadow p-6 max-w-md">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Nama Kategori</label>
                        <input
                            type="text"
                            value={data.nama_kategori}
                            onChange={(e) => setData('nama_kategori', e.target.value)}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-600"
                        />
                        {errors.nama_kategori && (
                            <div className="text-red-600 text-sm mt-1">{errors.nama_kategori}</div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        Update
                    </button>
                </form>
            </div>
        </AdminLayout>
    );
}