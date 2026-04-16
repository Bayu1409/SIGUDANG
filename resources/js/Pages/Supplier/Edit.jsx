import React from "react";
import { useForm, Link } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";

export default function Edit({ supplier }) {

    const { data, setData, put, errors } = useForm({

        nama_supplier: supplier.nama_supplier || "",
        email: supplier.email || "",
        telepon: supplier.telepon || "",
        alamat: supplier.alamat || "",

    });

    const submit = (e) => {

        e.preventDefault();

        put(`/supplier/${supplier.id}`);

    };

    return (

        <AdminLayout>

            <div className="p-6">

                {/* Container Tengah */}
                <div className="max-w-2xl mx-auto">

                    {/* Header */}
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">

                        Edit Supplier

                    </h2>

                    {/* Form */}
                    <form
                        onSubmit={submit}
                        className="bg-white shadow rounded-xl p-6 space-y-4"
                    >

                        {/* Nama Supplier */}
                        <div>

                            <label className="block text-sm font-medium text-gray-700">
                                Nama Supplier
                            </label>

                            <input
                                type="text"
                                value={data.nama_supplier}
                                onChange={(e) =>
                                    setData("nama_supplier", e.target.value)
                                }
                                className="mt-1 w-full border rounded px-3 py-2"
                            />

                            {errors.nama_supplier && (

                                <div className="text-red-500 text-sm">
                                    {errors.nama_supplier}
                                </div>

                            )}

                        </div>

                        {/* Email */}
                        <div>

                            <label className="block text-sm font-medium text-gray-700">
                                Email
                            </label>

                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                className="mt-1 w-full border rounded px-3 py-2"
                            />

                        </div>

                        {/* Telepon */}
                        <div>

                            <label className="block text-sm font-medium text-gray-700">
                                Telepon
                            </label>

                            <input
                                type="text"
                                value={data.telepon}
                                onChange={(e) =>
                                    setData("telepon", e.target.value)
                                }
                                className="mt-1 w-full border rounded px-3 py-2"
                            />

                        </div>

                        {/* Alamat */}
                        <div>

                            <label className="block text-sm font-medium text-gray-700">
                                Alamat
                            </label>

                            <textarea
                                value={data.alamat}
                                onChange={(e) =>
                                    setData("alamat", e.target.value)
                                }
                                className="mt-1 w-full border rounded px-3 py-2"
                                rows="3"
                            />

                        </div>

                        {/* Button */}
                        <div className="flex justify-end gap-2 pt-4">

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
                                Update
                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </AdminLayout>

    );

}