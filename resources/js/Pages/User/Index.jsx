import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";
import { Users, UserPlus, Edit2, Trash2, Mail, ShieldCheck, ShieldAlert, AlertTriangle, Search, X } from "lucide-react";

export default function Index({ users }) {
    const [search, setSearch] = useState("");
    const [confirmDelete, setConfirmDelete] = useState({ show: false, id: null, name: "" });

    const filteredUsers = users.filter(u => 
        u.name.toLowerCase().includes(search.toLowerCase()) || 
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = () => {
        if (confirmDelete.id) {
            router.delete(route("users.destroy", confirmDelete.id), {
                onSuccess: () => setConfirmDelete({ show: false, id: null, name: "" }),
            });
        }
    };

    return (
        <AdminLayout>
            <Head title="Manajemen Pengguna" />

            <div className="flex justify-between items-center mb-6 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                        Manajemen Pengguna
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">Kelola data login petugas gudang dan tingkat akses (Superadmin/Admin).</p>
                </div>
                <Link
                    href={route("users.create")}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm font-bold transition-all shadow-lg shadow-indigo-500/20"
                >
                    <UserPlus className="w-4 h-4" />
                    Tambah Petugas
                </Link>
            </div>

            {/* Combined Filter & Search */}
            <div className="mb-6 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <div className="relative max-w-md">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                        <Search className="w-4 h-4" />
                    </span>
                    <input 
                        type="text" placeholder="Cari nama atau email petugas..."
                        value={search} onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 pl-10 pr-4 py-2 text-sm transition-all" 
                    />
                    {search && (
                        <button onClick={() => setSearch("")} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600">
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden mb-6">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Informasi Petugas</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Akses</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${user.role === 'superadmin' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                                                    <Users className="w-5 h-5" />
                                                </div>
                                                <div className="text-sm font-bold text-slate-900">{user.name}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight border ${user.role === 'superadmin'
                                                    ? 'bg-indigo-50 text-indigo-700 border-indigo-100'
                                                    : 'bg-slate-50 text-slate-600 border-slate-200'
                                                }`}>
                                                {user.role === 'superadmin' ? <ShieldCheck className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                            <div className="flex items-center gap-1.5">
                                                <Mail className="w-3.5 h-3.5 text-slate-400" />
                                                {user.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                            <div className="flex items-center justify-center gap-2">
                                                <Link
                                                    href={route("users.edit", user.id)}
                                                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                                    title="Edit User"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => setConfirmDelete({ show: true, id: user.id, name: user.name })}
                                                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                                    title="Hapus User"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center gap-2 text-slate-300">
                                            <Users className="w-12 h-12 opacity-20" />
                                            <p className="text-sm font-medium">Petugas tidak ditemukan.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Confirmation Modal */}
            {confirmDelete.show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center">
                        <div className="flex justify-center mb-4">
                            <div className="bg-rose-100 p-4 rounded-full">
                                <AlertTriangle className="w-8 h-8 text-rose-600" />
                            </div>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Hapus Petugas?</h3>
                        <p className="text-sm text-slate-500 mb-8">
                            Akses login untuk <span className="font-bold text-slate-700">{confirmDelete.name}</span> akan dihapus selamanya.
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setConfirmDelete({ show: false, id: null, name: "" })}
                                className="flex-1 px-5 py-2.5 rounded-lg border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all text-sm">
                                Batal
                            </button>
                            <button onClick={handleDelete}
                                className="flex-1 px-5 py-2.5 rounded-lg bg-rose-600 text-white font-bold hover:bg-rose-700 transition-all text-sm shadow-lg shadow-rose-500/20">
                                Ya, Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
