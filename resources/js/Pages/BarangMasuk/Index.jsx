import React, { useState, useEffect } from "react";
import { Link, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import Pagination from "@/Components/Pagination";

export default function Index({ barangMasuk, filters = {} }) {
    const [search, setSearch] = useState(filters.search || "");

    const isInitialRender = React.useRef(true);

    useEffect(() => {
        if (isInitialRender.current) {
            isInitialRender.current = false;
            return;
        }

        const delay = setTimeout(() => {
            router.get(
                route("barang-masuk.index"),
                { search },
                { preserveState: true, replace: true, preserveScroll: true }
            );
        }, 300);
        return () => clearTimeout(delay);
    }, [search]);

    return (
        <>
            <div className="flex justify-between items-center mb-6 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                <h2 className="text-xl font-bold leading-tight text-slate-800">
                    Barang Masuk
                </h2>

                <Link
                    href={route("barang-masuk.create")}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold shadow hover:bg-blue-700 transition"
                >
                    + Input Barang Masuk
                </Link>
            </div>

            {/* SEARCH */}
            <div className="mb-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <input
                    type="text"
                    placeholder="Cari nama barang, kategori, atau supplier..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full md:w-1/3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-blue-500 px-3 py-2 text-sm"
                />
            </div>

            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden overflow-x-auto">

                <table className="min-w-full">

                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>

                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">No</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Barang</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Kategori</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Satuan</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Supplier</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Tanggal & Waktu</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Jumlah</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Dokumen</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase text-center">Aksi</th>

                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                        {barangMasuk.data && barangMasuk.data.map((item, index) => (
                            <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">

                                <td className="px-6 py-4 text-sm text-slate-500">{barangMasuk.from + index}</td>

                                {/* NAMA BARANG */}
                                <td className="px-6 py-4 text-sm font-bold text-slate-900">{item.barang?.nama_barang}</td>

                                {/* KATEGORI */}
                                <td className="px-6 py-4 text-sm text-slate-600">
                                    {item.barang?.kategori?.nama_kategori || "-"}
                                </td>

                                {/* SATUAN */}
                                <td className="px-6 py-4 text-sm text-slate-600">
                                    {item.barang?.satuan?.nama || "-"}
                                </td>

                                {/* SUPPLIER */}
                                <td className="px-6 py-4 text-sm text-slate-600">
                                    {item.supplier?.nama_supplier || "-"}
                                </td>

                                {/* TANGGAL & WAKTU */}
                                <td className="px-6 py-4 text-sm text-slate-600 font-mono">
                                    {new Date(item.created_at).toLocaleString("id-ID", {
                                        dateStyle: "medium",
                                        timeStyle: "short",
                                    })}
                                </td>

                                {/* JUMLAH */}
                                <td className="px-6 py-4 text-sm font-bold text-slate-900">{item.jumlah}</td>

                                {/* DOKUMEN */}
                                <td className="px-6 py-4 text-sm">
                                    {item.dokumen ? (
                                        <a
                                            href={`/storage/${item.dokumen}`}
                                            target="_blank"
                                            className="text-indigo-600 hover:text-indigo-800 font-semibold underline"
                                        >
                                            Lihat
                                        </a>
                                    ) : (
                                        <span className="text-slate-300">-</span>
                                    )}
                                </td>

                                {/* AKSI */}
                                <td className="px-6 py-4 flex gap-2 justify-center">
                                    <Link
                                        href={route("barang-masuk.edit", item.id)}
                                        className="bg-amber-100 text-amber-700 hover:bg-amber-500 hover:text-white px-3 py-1 rounded-lg text-xs font-bold transition"
                                    >
                                        Edit
                                    </Link>

                                    <Link
                                        href={route("barang-masuk.destroy", item.id)}
                                        method="delete"
                                        as="button"
                                        className="bg-rose-100 text-rose-700 hover:bg-rose-600 hover:text-white px-3 py-1 rounded-lg text-xs font-bold transition"
                                    >
                                        Hapus
                                    </Link>
                                </td>

                            </tr>
                        ))}
                    </tbody>

                </table>

            </div>

            <div className="mt-6">
                <Pagination links={barangMasuk.links} />
            </div>
        </>
    );
}

Index.layout = (page) => <AdminLayout children={page} />;