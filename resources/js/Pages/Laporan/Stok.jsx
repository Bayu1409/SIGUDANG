import React, { useState, useEffect } from "react";
import { Link, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import Pagination from "@/Components/Pagination";

export default function LaporanStok({ barang, filters = {} }) {
    const [dari, setDari] = useState(filters.dari || "");
    const [sampai, setSampai] = useState(filters.sampai || "");
    const [search, setSearch] = useState(filters.search || "");

    const isInitialRender = React.useRef(true);
    
    useEffect(() => {
        if (isInitialRender.current) {
            isInitialRender.current = false;
            return;
        }

        const delay = setTimeout(() => {
            router.get(
                route("laporan.stok"),
                { dari, sampai, search },
                { preserveState: true, replace: true, preserveScroll: true }
            );
        }, 300);
        return () => clearTimeout(delay);
    }, [search]);

    const handleFilter = (e) => {
        e.preventDefault();
        router.get(route("laporan.stok"), { dari, sampai, search });
    };

    const handleExport = () => {
        const url = route("laporan.stok.export", { dari, sampai, search });
        window.open(url, "_blank");
    };

    const setQuickDate = (type) => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = today.getMonth();

        const formatDate = (dateObj) => {
            const y = dateObj.getFullYear();
            const m = String(dateObj.getMonth() + 1).padStart(2, '0');
            const d = String(dateObj.getDate()).padStart(2, '0');
            return `${y}-${m}-${d}`;
        };

        if (type === 'hari_ini') {
            const str = formatDate(today);
            setDari(str);
            setSampai(str);
        } else if (type === 'bulan_ini') {
            const firstDay = new Date(yyyy, mm, 1);
            const lastDay = new Date(yyyy, mm + 1, 0); // hari terakhir bulan ini
            setDari(formatDate(firstDay));
            setSampai(formatDate(lastDay));
        } else if (type === 'tahun_ini') {
            const firstDay = new Date(yyyy, 0, 1);
            const lastDay = new Date(yyyy, 11, 31);
            setDari(formatDate(firstDay));
            setSampai(formatDate(lastDay));
        }
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

                {/* FILTER & SEARCH */}
                <div className="mb-6 bg-white p-4 shadow rounded-lg">
                    <form
                        onSubmit={handleFilter}
                        className="flex flex-wrap items-end gap-4 mb-4"
                    >
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Dari Tanggal (Opsional)
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
                                Sampai Tanggal (Opsional)
                            </label>
                            <input
                                type="date"
                                value={sampai}
                                onChange={(e) => setSampai(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex-grow">
                            <label className="block text-sm font-medium text-gray-700">
                                Cari Barang
                            </label>
                            <input
                                type="text"
                                placeholder="Ketik nama, kode, atau kategori..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
                            >
                                Terapkan Tanggal
                            </button>
                            <Link
                                href={route("laporan.stok")}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded shadow"
                            >
                                Reset
                            </Link>
                        </div>
                    </form>

                    <div className="flex gap-2 border-t pt-4">
                        <span className="text-sm font-medium text-gray-700 self-center">Filter Cepat:</span>
                        <button type="button" onClick={() => setQuickDate('hari_ini')} className="text-xs bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-3 py-1 rounded-full font-medium transition">Hari Ini</button>
                        <button type="button" onClick={() => setQuickDate('bulan_ini')} className="text-xs bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-3 py-1 rounded-full font-medium transition">Bulan Ini</button>
                        <button type="button" onClick={() => setQuickDate('tahun_ini')} className="text-xs bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-3 py-1 rounded-full font-medium transition">Tahun Ini</button>
                    </div>
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
                            {barang.data && barang.data.length > 0 ? (
                                barang.data.map((item, index) => (
                                    <tr key={item.id} className="text-center">
                                        <td className="border px-4 py-2 text-center">{barang.from + index}</td>
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

                <Pagination links={barang.links} />
            </div>
        </AdminLayout>
    );
}
