import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { UserPlus, Save, ArrowLeft, Mail, User, Shield, Lock } from "lucide-react";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "admin",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("users.store"));
    };

    return (
        <AdminLayout
            header={
                <div className="flex items-center gap-3">
                    <Link
                        href={route("users.index")}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-all"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-500" />
                    </Link>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Tambah User Baru
                    </h2>
                </div>
            }
        >
            <Head title="Tambah User" />

            <div className="max-w-2xl mx-auto">
                <form 
                    onSubmit={handleSubmit}
                    className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
                >
                    <div className="p-8 space-y-6">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                                <User className="w-4 h-4 text-slate-400" />
                                Nama Lengkap
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData("name", e.target.value)}
                                className={`w-full rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 transition-all ${errors.name ? 'border-rose-500' : ''}`}
                                placeholder="Masukkan nama lengkap..."
                            />
                            {errors.name && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.name}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                                <Mail className="w-4 h-4 text-slate-400" />
                                Alamat Email
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData("email", e.target.value)}
                                className={`w-full rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 transition-all ${errors.email ? 'border-rose-500' : ''}`}
                                placeholder="nama@email.com"
                            />
                            {errors.email && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.email}</p>}
                        </div>

                        {/* Role */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                                <Shield className="w-4 h-4 text-slate-400" />
                                Pilih Hak Akses (Role)
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setData("role", "admin")}
                                    className={`p-4 rounded-xl border-2 transition-all text-left flex items-start gap-3 ${
                                        data.role === 'admin' 
                                        ? 'border-indigo-600 bg-indigo-50' 
                                        : 'border-slate-100 hover:border-slate-300'
                                    }`}
                                >
                                    <div className={`mt-1 w-4 h-4 rounded-full border-4 ${data.role === 'admin' ? 'border-indigo-600 bg-white' : 'border-slate-300'}`} />
                                    <div>
                                        <p className="font-bold text-slate-900 text-sm">Admin (Staf)</p>
                                        <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">Mencatat barang & transaksi utama.</p>
                                    </div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setData("role", "superadmin")}
                                    className={`p-4 rounded-xl border-2 transition-all text-left flex items-start gap-3 ${
                                        data.role === 'superadmin' 
                                        ? 'border-indigo-600 bg-indigo-50' 
                                        : 'border-slate-100 hover:border-slate-300'
                                    }`}
                                >
                                    <div className={`mt-1 w-4 h-4 rounded-full border-4 ${data.role === 'superadmin' ? 'border-indigo-600 bg-white' : 'border-slate-300'}`} />
                                    <div>
                                        <p className="font-bold text-slate-900 text-sm">Super Admin</p>
                                        <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">Kendali penuh sistem & aktivitas.</p>
                                    </div>
                                </button>
                            </div>
                            {errors.role && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.role}</p>}
                        </div>

                        {/* Passwords */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                                    <Lock className="w-4 h-4 text-slate-400" />
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData("password", e.target.value)}
                                    className={`w-full rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 transition-all ${errors.password ? 'border-rose-500' : ''}`}
                                />
                                {errors.password && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.password}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                                    Konfirmasi Password
                                </label>
                                <input
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData("password_confirmation", e.target.value)}
                                    className="w-full rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                        <Link
                            href={route("users.index")}
                            className="px-6 py-2.5 rounded-xl text-slate-600 font-bold hover:bg-slate-200 transition-all text-sm"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-sm active:scale-95 disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" />
                            Simpan User
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
