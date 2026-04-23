import React from "react";
import { useForm, Link } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";

const Label = ({ children, required }) => (
  <label className="block text-sm font-medium text-gray-700 mb-1">
    {children}
    {required && <span className="text-red-500 ml-1">*</span>}
  </label>
);

export default function Edit({ supplier }) {

    const { data, setData, put, errors, processing } = useForm({
        nama_supplier: supplier.nama_supplier || "",
        email:         supplier.email || "",
        telepon:       supplier.telepon || "",
        alamat:        supplier.alamat || "",
    });

    const submit = (e) => {
        e.preventDefault();
        put(`/supplier/${supplier.id}`);
    };

    return (
        <AdminLayout>
            <div className="p-6">
                <div className="max-w-2xl mx-auto">

                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">Edit Supplier</h2>
                    <p className="text-sm text-gray-500 mb-6">
                        Kolom bertanda <span className="text-red-500 font-bold">*</span> wajib diisi.
                    </p>

                    <form
                        onSubmit={submit}
                        className="bg-white shadow rounded-xl p-6 space-y-4"
                    >

                        {/* Nama Supplier */}
                        <div>
                            <Label required>Nama Supplier</Label>
                            <input
                                type="text"
                                value={data.nama_supplier}
                                onChange={(e) => setData("nama_supplier", e.target.value)}
                                className={`mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.nama_supplier ? "border-red-500" : ""}`}
                            />
                            {errors.nama_supplier && (
                                <p className="text-red-500 text-xs mt-1">{errors.nama_supplier}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <Label>Email</Label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData("email", e.target.value)}
                                className={`mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.email ? "border-red-500" : ""}`}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                            )}
                        </div>

                        {/* Telepon */}
                        <div>
                            <Label>Telepon</Label>
                            <input
                                type="text"
                                value={data.telepon}
                                onChange={(e) => setData("telepon", e.target.value)}
                                className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>

                        {/* Alamat */}
                        <div>
                            <Label>Alamat</Label>
                            <textarea
                                value={data.alamat}
                                onChange={(e) => setData("alamat", e.target.value)}
                                className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                rows="3"
                            />
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Link
                                href="/supplier"
                                className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded font-medium transition"
                            >
                                Kembali
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2 rounded font-medium transition"
                            >
                                {processing ? "Menyimpan..." : "Update"}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}