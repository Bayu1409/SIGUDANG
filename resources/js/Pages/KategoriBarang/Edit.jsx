import React from "react";
import { useForm, Link } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";

export default function Edit({ kategori }) {

    const { data, setData, put } = useForm({

        nama_kategori: kategori.nama_kategori || "",
        deskripsi: kategori.deskripsi || ""

    });

    const submit = (e) => {

        e.preventDefault();

        put(`/kategori-barang/${kategori.id}`);

    };

    return (

        <AdminLayout>

            <div className="p-6">

                {/* HEADER */}

                <h2 className="text-2xl font-semibold mb-6">
                    Edit Kategori Barang
                </h2>

                {/* CARD */}

                <div className="bg-white p-6 rounded shadow max-w-lg">

                    <form onSubmit={submit}>

                        {/* Nama */}

                        <div className="mb-4">

                            <label className="block mb-1">
                                Nama Kategori
                            </label>

                            <input
                                type="text"
                                className="w-full border p-2 rounded"
                                value={data.nama_kategori}
                                onChange={(e) =>
                                    setData("nama_kategori", e.target.value)
                                }
                            />

                        </div>

                        {/* Deskripsi */}

                        <div className="mb-4">

                            <label className="block mb-1">
                                Deskripsi
                            </label>

                            <textarea
                                className="w-full border p-2 rounded"
                                value={data.deskripsi}
                                onChange={(e) =>
                                    setData("deskripsi", e.target.value)
                                }
                            />

                        </div>

                        {/* BUTTON */}

                        <div className="flex gap-2 mt-4">

                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                            >
                                Update
                            </button>

                            <Link
                                href="/kategori-barang"
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
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