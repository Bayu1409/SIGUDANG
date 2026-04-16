import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";

export default function LaporanStok({ barang }) {
    const handleExport = () => {
        window.open(route("laporan.stok.export"), "_blank");
    };

    return (
        <AdminLayout>
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800">
                        Laporan Stok Barang
                    </h2>
                    <button
                        onClick={handleExport}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
                    >
                        Unduh Excel
                    </button>
                </div>

                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <table className="min-w-full border border-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 border">No</th>
                                <th className="px-4 py-2 border">Kode Barang</th>
                                <th className="px-4 py-2 border">Nama Barang</th>
                                <th className="px-4 py-2 border">Kategori</th>
                                <th className="px-4 py-2 border">Total Masuk</th>
                                <th className="px-4 py-2 border">Total Keluar</th>
                                <th className="px-4 py-2 border">Stok Sekarang</th>
                                <th className="px-4 py-2 border">Satuan</th>
                            </tr>
                        </thead>
                        <tbody>
                            {barang.length > 0 ? (
                                barang.map((item, index) => (
                                    <tr key={item.id} className="text-center">
                                        <td className="border px-4 py-2">{index + 1}</td>
                                        <td className="border px-4 py-2">{item.kode_barang}</td>
                                        <td className="border px-4 py-2">{item.nama_barang}</td>
                                        <td className="border px-4 py-2">{item.kategori}</td>
                                        <td className="border px-4 py-2 text-green-600 font-semibold">{item.masuk}</td>
                                        <td className="border px-4 py-2 text-red-600 font-semibold">{item.keluar}</td>
                                        <td className="border px-4 py-2 font-bold">{item.stok}</td>
                                        <td className="border px-4 py-2">{item.satuan}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center py-4">
                                        Data barang tidak tersedia
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
