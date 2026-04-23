import React, { useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";

export default function BarangMasuk({ data, filters }) {
    const { auth } = usePage().props;
    const [dari, setDari] = useState(filters.dari || "");
    const [sampai, setSampai] = useState(filters.sampai || "");
    const [search, setSearch] = useState("");

    const filteredData = data.filter(
        (item) =>
            (item.barang?.nama_barang || "").toLowerCase().includes(search.toLowerCase()) ||
            (item.barang?.kategori?.nama_kategori || "").toLowerCase().includes(search.toLowerCase()) ||
            (item.supplier?.nama_supplier || "").toLowerCase().includes(search.toLowerCase()) ||
            (item.barang?.kode_barang || "").toLowerCase().includes(search.toLowerCase())
    );

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
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Cari Barang / Supplier
                            </label>
                            <input
                                type="text"
                                placeholder="Ketik kata kunci..."
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
                                Terapkan Filter
                            </button>
                            <Link
                                href={route("laporan.barang-masuk")}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded shadow"
                            >
                                Reset
                            </Link>
                        </div>
                    </form>

                    <div className="mt-4 flex gap-2">
                        <span className="text-sm font-medium text-gray-700 self-center">Filter Cepat:</span>
                        <button type="button" onClick={() => setQuickDate('hari_ini')} className="text-xs bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-3 py-1 rounded-full font-medium transition">Hari Ini</button>
                        <button type="button" onClick={() => setQuickDate('bulan_ini')} className="text-xs bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-3 py-1 rounded-full font-medium transition">Bulan Ini</button>
                        <button type="button" onClick={() => setQuickDate('tahun_ini')} className="text-xs bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-3 py-1 rounded-full font-medium transition">Tahun Ini</button>
                    </div>
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
                            {filteredData.length > 0 ? (
                                filteredData.map((item, index) => (
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
