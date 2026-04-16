import React from "react";
import { useForm, Link } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";

export default function Create() {

    const { data, setData, post, errors } = useForm({

        nama_supplier: "",
        email: "",
        telepon: "",
        alamat: "",

    });

    const submit = (e) => {

        e.preventDefault();

        post("/supplier");

    };

    return (

        <AdminLayout>

            <div className="p-6">

                <div className="max-w-2xl mx-auto">

                    <h2 className="text-2xl font-semibold mb-6">
                        Tambah Supplier
                    </h2>

                    <form
                        onSubmit={submit}
                        className="bg-white shadow rounded-lg p-6 space-y-4"
                    >

                        {/* Nama */}

                        <div>

                            <label className="block mb-1">
                                Nama Supplier
                            </label>

                            <input
                                type="text"
                                value={data.nama_supplier}
                                onChange={(e) =>
                                    setData("nama_supplier", e.target.value)
                                }
                                className="w-full border rounded px-3 py-2"
                            />

                        </div>

                        {/* Email */}

                        <div>

                            <label className="block mb-1">
                                Email
                            </label>

                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                className="w-full border rounded px-3 py-2"
                            />

                        </div>

                        {/* Telepon */}

                        <div>

                            <label className="block mb-1">
                                Telepon
                            </label>

                            <input
                                type="text"
                                value={data.telepon}
                                onChange={(e) =>
                                    setData("telepon", e.target.value)
                                }
                                className="w-full border rounded px-3 py-2"
                            />

                        </div>

                        {/* Alamat */}

                        <div>

                            <label className="block mb-1">
                                Alamat
                            </label>

                            <textarea
                                value={data.alamat}
                                onChange={(e) =>
                                    setData("alamat", e.target.value)
                                }
                                className="w-full border rounded px-3 py-2"
                                rows="3"
                            />

                        </div>

                        {/* BUTTON */}

                        <div className="flex justify-end gap-2 pt-2">

                            <Link
                                href="/supplier"
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                            >
                                Kembali
                            </Link>

                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                            >
                                Simpan
                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </AdminLayout>

    );

}