import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { Users, UserPlus, Edit2, Trash2, Mail, ShieldCheck, ShieldAlert } from "lucide-react";

export default function Index({ users }) {
    const { delete: destroy } = useForm();

    const handleDelete = (id, name) => {
        if (confirm(`Apakah Anda yakin ingin menghapus user "${name}"?`)) {
            destroy(route("users.destroy", id));
        }
    };

    return (
        <AdminLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Manajemen Pengguna
                    </h2>
                    <Link
                        href={route("users.create")}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold transition-all shadow-sm"
                    >
                        <UserPlus className="w-4 h-4" />
                        Tambah User
                    </Link>
                </div>
            }
        >
            <Head title="Manajemen User" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map((user) => (
                    <div key={user.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-2.5 rounded-xl ${user.role === 'superadmin' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-600'}`}>
                                    {user.role === 'superadmin' ? <ShieldCheck className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md border ${
                                    user.role === 'superadmin' 
                                    ? 'bg-indigo-50 text-indigo-700 border-indigo-100' 
                                    : 'bg-slate-50 text-slate-700 border-slate-200'
                                }`}>
                                    {user.role}
                                </span>
                            </div>
                            
                            <h3 className="text-lg font-bold text-slate-900">{user.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                                <Mail className="w-3.5 h-3.5" />
                                {user.email}
                            </div>
                        </div>

                        <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                            <Link
                                href={route("users.edit", user.id)}
                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                title="Edit User"
                            >
                                <Edit2 className="w-4 h-4" />
                            </Link>
                            {/* Jangan biarkan user hapus dirinya sendiri di list ini (opsional, sudah dicek di backend) */}
                            <button
                                onClick={() => handleDelete(user.id, user.name)}
                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                title="Hapus User"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {users.length === 0 && (
                <div className="bg-white p-10 rounded-xl border border-dashed border-slate-300 text-center text-slate-400">
                    <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>Belum ada user lain yang terdaftar.</p>
                </div>
            )}
        </AdminLayout>
    );
}
