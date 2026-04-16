import React from "react";
import { useForm, Link } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";

export default function Edit({ barang, kategori, satuan }) {

    const { data, setData, put } = useForm({

        kode_barang: barang.kode_barang || "",
        nama_barang: barang.nama_barang || "",
        stok: barang.stok || "",
        kategori_id: barang.kategori_id || "",
        satuan_id: barang.satuan_id || ""

    });

    const submit = (e) => {

        e.preventDefault();

        put(route("barang.update", barang.id));

    };

    return (

        <AdminLayout>

            <div className="p-6 max-w-xl">

                {/* HEADER */}

                <div className="mb-6">

                    <h2 className="text-2xl font-semibold mt-2">
                        Edit Barang
                    </h2>

                </div>

                {/* CARD */}

                <div className="bg-white p-6 rounded shadow">

                    <form onSubmit={submit}>

                        {/* KODE BARANG */}

                        <div className="mb-4">

                            <label className="block mb-1">
                                Kode Barang
                            </label>

                            <input
                                type="text"
                                className="w-full border p-2 rounded"
                                value={data.kode_barang}
                                onChange={(e) =>
                                    setData("kode_barang", e.target.value)
                                }
                            />

                        </div>

                        {/* NAMA BARANG */}

                        <div className="mb-4">

                            <label className="block mb-1">
                                Nama Barang
                            </label>

                            <input
                                type="text"
                                className="w-full border p-2 rounded"
                                value={data.nama_barang}
                                onChange={(e) =>
                                    setData("nama_barang", e.target.value)
                                }
                            />

                        </div>

                        {/* KATEGORI */}

                        <div className="mb-4">

                            <label className="block mb-1">
                                Kategori
                            </label>

                            <select
                                className="w-full border p-2 rounded"
                                value={data.kategori_id}
                                onChange={(e) =>
                                    setData("kategori_id", e.target.value)
                                }
                            >

                                <option value="">
                                    -- Pilih Kategori --
                                </option>

                                {kategori.map((item) => (

                                    <option
                                        key={item.id}
                                        value={item.id}
                                    >
                                        {item.nama || item.nama_kategori}
                                    </option>

                                ))}

                            </select>

                        </div>

                        {/* SATUAN */}

                        <div className="mb-4">

                            <label className="block mb-1">
                                Satuan
                            </label>

                            <select
                                className="w-full border p-2 rounded"
                                value={data.satuan_id}
                                onChange={(e) =>
                                    setData("satuan_id", e.target.value)
                                }
                            >

                                <option value="">
                                    -- Pilih Satuan --
                                </option>

                                {satuan.map((item) => (

                                    <option
                                        key={item.id}
                                        value={item.id}
                                    >
                                        {item.nama}
                                    </option>

                                ))}

                            </select>

                        </div>

                        {/* STOK */}

                        <div className="mb-4">

                            <label className="block mb-1">
                                Stok
                            </label>
                        </div>

                        {/* BUTTON */}

                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                        >
                            Update
                        </button>

                        <Link
                            href={route("barang.index")}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded ml-2"
                        >
                            Kembali
                        </Link>

                    </form>

                </div>

            </div>

        </AdminLayout>

    );

}