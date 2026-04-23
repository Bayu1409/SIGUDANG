import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

const Label = ({ children, required }) => (
  <label className="block text-sm font-medium text-gray-700 mb-1">
    {children}
    {required && <span className="text-red-500 ml-1">*</span>}
  </label>
);

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        nama_kategori: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('kategori.store'));
    };

    return (
        <AdminLayout
            header={<h2 className="text-2xl font-semibold">Tambah Kategori</h2>}
        >
            <Head title="Tambah Kategori" />

            <div className="bg-white rounded-lg shadow p-6 max-w-md">
                <p className="text-sm text-gray-500 mb-4">
                    Kolom bertanda <span className="text-red-500 font-bold">*</span> wajib diisi.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label required>Nama Kategori</Label>
                        <input
                            type="text"
                            value={data.nama_kategori}
                            onChange={(e) => setData('nama_kategori', e.target.value)}
                            className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.nama_kategori ? "border-red-500" : ""}`}
                            placeholder="Contoh: Elektronik, Furnitur"
                        />
                        {errors.nama_kategori && (
                            <p className="text-red-500 text-xs mt-1">{errors.nama_kategori}</p>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 font-medium transition"
                        >
                            {processing ? "Menyimpan..." : "Simpan"}
                        </button>
                        <Link
                            href={route('kategori.index')}
                            className="px-5 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded font-medium transition"
                        >
                            Kembali
                        </Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}