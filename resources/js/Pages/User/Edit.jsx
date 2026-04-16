import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { Save, ArrowLeft, Mail, User, Shield, Lock, AlertCircle } from "lucide-react";

export default function Edit({ user }) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name || "",
        email: user.email || "",
        password: "",
        password_confirmation: "",
        role: user.role || "admin",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("users.update", user.id));
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
                        Edit Profil Pengguna
                    </h2>
                </div>
            }
        >
            <Head title="Edit User" />

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
                            />
                            {errors.email && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.email}</p>}
                        </div>

                        {/* Role */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                                <Shield className="w-4 h-4 text-slate-400" />
                                Hak Akses (Role)
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
                                    </div>
                                </button>
                            </div>
                            {errors.role && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.role}</p>}
                        </div>

                        {/* Passwords Section */}
                        <div className="pt-6 border-t border-slate-100 space-y-4">
                            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3">
                                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                                <p className="text-xs text-amber-700 leading-relaxed font-medium">
                                    Biarkan kolom password **kosong** jika Anda tidak ingin mengubah password user ini.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                                        <Lock className="w-4 h-4 text-slate-400" />
                                        Password Baru
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
                            Simpan Perubahan
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
