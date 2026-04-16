import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";

export default function LaporanDeadStock({ barang }) {
    const handleExport = () => {
        window.open(route("laporan.dead-stock.export"), "_blank");
    };

    return (
        <AdminLayout>
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800">
                        Laporan Dead Stock
                    </h2>
                    <button
                        onClick={handleExport}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow flex items-center gap-2"
                    >
                        <span>Unduh Excel</span>
                    </button>
                </div>

                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6" role="alert">
                    <p className="font-bold">Informasi</p>
                    <p>Halaman ini menampilkan barang yang <strong>tidak memiliki transaksi keluar (barang keluar)</strong> selama lebih dari 30 hari terakhir, namun masih memiliki stok.</p>
                </div>

                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <table className="min-w-full border border-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 border">No</th>
                                <th className="px-4 py-2 border">Kode Barang</th>
                                <th className="px-4 py-2 border">Nama Barang</th>
                                <th className="px-4 py-2 border">Kategori</th>
                                <th className="px-4 py-2 border">Stok</th>
                                <th className="px-4 py-2 border">Satuan</th>
                                <th className="px-4 py-2 border">Lama Mengendap</th>
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
                                        <td className="border px-4 py-2 font-bold">{item.stok}</td>
                                        <td className="border px-4 py-2">{item.satuan}</td>
                                        <td className="border px-4 py-2 text-red-600 font-semibold text-sm">
                                            {item.hari === 999 ? "Belum pernah ada transaksi keluar" : `${item.hari} Hari`}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center py-4">
                                        Tidak ada barang kategori dead stock (semua barang aktif bergerak)
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
