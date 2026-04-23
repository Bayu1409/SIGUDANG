import React from "react";
import { useForm, Link } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";

const Label = ({ children, required }) => (
  <label className="block text-sm font-medium text-gray-700 mb-1">
    {children}
    {required && <span className="text-red-500 ml-1">*</span>}
  </label>
);

export default function Edit({ barang, kategori, satuan }) {

    const { data, setData, put, processing, errors } = useForm({
        kode_barang: barang.kode_barang || "",
        nama_barang: barang.nama_barang || "",
        stok:        barang.stok || "",
        kategori_id: barang.kategori_id || "",
        satuan_id:   barang.satuan_id || "",
    });

    const submit = (e) => {
        e.preventDefault();
        put(route("barang.update", barang.id));
    };

    return (
        <AdminLayout>
            <div className="p-6 max-w-xl">

                <div className="mb-6">
                    <h2 className="text-2xl font-semibold mt-2">Edit Barang</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Kolom bertanda <span className="text-red-500 font-bold">*</span> wajib diisi.
                    </p>
                </div>

                <div className="bg-white p-6 rounded shadow">
                    <form onSubmit={submit} className="space-y-4">

                        {/* KODE BARANG */}
                        <div>
                            <Label>Kode Barang</Label>
                            <input
                                type="text"
                                className="w-full border p-2 rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={data.kode_barang}
                                onChange={(e) => setData("kode_barang", e.target.value)}
                            />
                            {errors.kode_barang && (
                                <p className="text-red-500 text-xs mt-1">{errors.kode_barang}</p>
                            )}
                        </div>

                        {/* NAMA BARANG */}
                        <div>
                            <Label required>Nama Barang</Label>
                            <input
                                type="text"
                                className={`w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.nama_barang ? "border-red-500" : ""}`}
                                value={data.nama_barang}
                                onChange={(e) => setData("nama_barang", e.target.value)}
                            />
                            {errors.nama_barang && (
                                <p className="text-red-500 text-xs mt-1">{errors.nama_barang}</p>
                            )}
                        </div>

                        {/* KATEGORI */}
                        <div>
                            <Label>Kategori</Label>
                            <select
                                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={data.kategori_id}
                                onChange={(e) => setData("kategori_id", e.target.value)}
                            >
                                <option value="">-- Pilih Kategori --</option>
                                {kategori.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.nama || item.nama_kategori}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* SATUAN */}
                        <div>
                            <Label>Satuan</Label>
                            <select
                                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={data.satuan_id}
                                onChange={(e) => setData("satuan_id", e.target.value)}
                            >
                                <option value="">-- Pilih Satuan --</option>
                                {satuan.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.nama}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Stok info readonly */}
                        <div>
                            <Label>Stok Saat Ini</Label>
                            <div className="w-full border p-2 rounded bg-gray-100 text-gray-600 font-semibold">
                                {data.stok} unit
                            </div>
                            <p className="text-xs text-gray-400 mt-1">
                                Stok diubah melalui transaksi Barang Masuk / Barang Keluar.
                            </p>
                        </div>

                        {/* BUTTON */}
                        <div className="flex gap-2 pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2 rounded font-medium transition"
                            >
                                {processing ? "Menyimpan..." : "Update"}
                            </button>
                            <Link
                                href={route("barang.index")}
                                className="bg-gray-600 hover:bg-gray-700 text-white px-5 py-2 rounded font-medium transition"
                            >
                                Kembali
                            </Link>
                        </div>

                    </form>
                </div>

            </div>
        </AdminLayout>
    );
}