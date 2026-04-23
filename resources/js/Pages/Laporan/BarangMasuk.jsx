import React, { useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";

export default function BarangMasuk({ data, filters }) {
    const { auth } = usePage().props;
    const [dari, setDari] = useState(filters.dari || "");
    const [sampai, setSampai] = useState(filters.sampai || "");

    const handleFilter = (e) => {
        e.preventDefault();
        router.get(route("laporan.barang-masuk"), { dari, sampai });
    };

    const handleExport = () => {
        const url = route("laporan.barang-masuk.export", { dari, sampai });
        window.open(url, "_blank");
    };

    return (
        <AdminLayout>
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800">
                        Laporan Barang Masuk
                    </h2>
                    <button
                        onClick={handleExport}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow flex items-center gap-2"
                    >
                        <span>Unduh Excel</span>
                    </button>
                </div>

                {/* FILTER */}
                <div className="bg-white p-4 shadow rounded-lg mb-6">
                    <form
                        onSubmit={handleFilter}
                        className="flex flex-wrap items-end gap-4"
                    >
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Dari Tanggal
                            </label>
                            <input
                                type="date"
                                value={dari}
                                onChange={(e) => setDari(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Sampai Tanggal
                            </label>
                            <input
                                type="date"
                                value={sampai}
                                onChange={(e) => setSampai(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
                            >
                                Filter
                            </button>
                            <Link
                                href={route("laporan.barang-masuk")}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded shadow"
                            >
                                Reset
                            </Link>
                        </div>
                    </form>
                </div>

                {/* TABLE */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <table className="min-w-full border border-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 border">No</th>
                                <th className="px-4 py-2 border">Tanggal</th>
                                <th className="px-4 py-2 border">Kode Barang</th>
                                <th className="px-4 py-2 border">Nama Barang</th>
                                <th className="px-4 py-2 border">Kategori</th>
                                <th className="px-4 py-2 border">Supplier</th>
                                <th className="px-4 py-2 border">Jumlah</th>
                                <th className="px-4 py-2 border">Satuan</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length > 0 ? (
                                data.map((item, index) => (
                                    <tr key={item.id} className="text-center">
                                        <td className="border px-4 py-2">{index + 1}</td>
                                        <td className="border px-4 py-2">{item.tanggal_masuk}</td>
                                        <td className="border px-4 py-2">{item.barang?.kode_barang}</td>
                                        <td className="border px-4 py-2">{item.barang?.nama_barang}</td>
                                        <td className="border px-4 py-2">{item.barang?.kategori?.nama_kategori || "-"}</td>
                                        <td className="border px-4 py-2">{item.supplier?.nama_supplier || "-"}</td>
                                        <td className="border px-4 py-2">{item.jumlah}</td>
                                        <td className="border px-4 py-2">{item.barang?.satuan?.nama || "-"}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center py-4">
                                        Data tidak ditemukan
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
