import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link } from "@inertiajs/react";
import { AlertTriangle, Package, Calendar } from "lucide-react";

export default function Index({ barang, limit_dead_stock }) {
    return (
        <AdminLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-800">Monitoring Dead Stock</h2>
                    <div className="flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold border border-amber-200">
                        <Calendar className="w-3.5 h-3.5" />
                        Threshold: {limit_dead_stock} Hari
                    </div>
                </div>
            }
        >
            <Head title="Dead Stock" />

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 bg-slate-50/50 border-b border-slate-100">
                    <p className="text-sm text-slate-600 max-w-2xl">
                        Daftar barang di bawah ini adalah barang yang tidak memiliki aktivitas Keluar selama lebih dari 
                        <strong> {limit_dead_stock} hari</strong> namun masih memiliki sisa stok di gudang.
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                            <tr>
                                <th className="px-6 py-3">No</th>
                                <th className="px-6 py-3">Informasi Barang</th>
                                <th className="px-6 py-3">Kategori</th>
                                <th className="px-6 py-3">Stok Saat Ini</th>
                                <th className="px-6 py-3">Hari Tanpa Transaksi</th>
                                <th className="px-6 py-3">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {barang.length > 0 ? barang.map((item, index) => (
                                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        {index + 1}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-slate-100 p-2 rounded-lg text-slate-400">
                                                <Package className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 leading-none">{item.nama_barang}</p>
                                                <p className="text-[10px] text-slate-500 mt-1 font-mono">{item.kode_barang}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        {item.kategori}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-bold text-slate-700">
                                            {item.stok} {item.satuan}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-extrabold text-rose-600">{item.hari} Hari</span>
                                            <AlertTriangle className="w-4 h-4 text-rose-500" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link 
                                            href={`/barang/${item.id}/edit`}
                                            className="text-xs bg-white text-slate-600 hover:bg-slate-50 px-3 py-1.5 rounded-lg font-bold transition-all border border-slate-200 shadow-sm"
                                        >
                                            Kelola Barang
                                        </Link>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3 text-slate-400">
                                            <div className="bg-emerald-50 text-emerald-500 p-4 rounded-full">
                                                <Package className="w-8 h-8" />
                                            </div>
                                            <p className="text-sm italic">Tidak ada barang yang tergolong Dead Stock saat ini.</p>
                                        </div>
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
