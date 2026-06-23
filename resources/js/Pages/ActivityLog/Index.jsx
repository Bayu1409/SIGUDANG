import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";
import { ClipboardList, User as UserIcon, Clock, HardDrive } from "lucide-react";

export default function Index({ logs }) {
    return (
        <AdminLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Log Aktivitas Sistem
                </h2>
            }
        >
            <Head title="Log Aktivitas" />

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-2">
                        <ClipboardList className="w-5 h-5 text-indigo-500" />
                        <h3 className="text-lg font-bold text-slate-800">Riwayat Aksi Admin</h3>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                            <tr>
                                <th className="px-6 py-4">Waktu</th>
                                <th className="px-6 py-4">Admin</th>
                                <th className="px-6 py-4">Aktivitas</th>
                                <th className="px-6 py-4">Modul</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {logs.data.length > 0 ? logs.data.map((log) => (
                                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                                            {new Date(log.created_at).toLocaleString('id-ID', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center">
                                                <UserIcon className="w-4 h-4 text-indigo-600" />
                                            </div>
                                            <span className="text-sm font-semibold text-slate-900">{log.user?.name || 'Deleted User'}</span>
                                        </div>
                                    </td>
                                     <td className="px-6 py-4">
                                         <p className="text-sm font-bold text-slate-800">{log.activity}</p>
                                         {log.properties?.changes && Object.keys(log.properties.changes).length > 0 && (
                                             <div className="mt-2 space-y-1">
                                                 {Object.entries(log.properties.changes).map(([field, delta]) => (
                                                     <div key={field} className="text-[11px] flex flex-wrap items-center gap-1.5 bg-slate-50 border border-slate-100 rounded-lg p-2">
                                                         <span className="font-bold text-slate-400 uppercase tracking-tighter w-24">
                                                             {field.replace('_', ' ')}:
                                                         </span>
                                                         <span className="text-rose-500 line-through opacity-60">
                                                             {Array.isArray(delta.old) ? delta.old.join(', ') : delta.old}
                                                         </span>
                                                         <span className="text-slate-400">→</span>
                                                         <span className="text-emerald-600 font-black">
                                                             {Array.isArray(delta.new) ? delta.new.join(', ') : delta.new}
                                                         </span>
                                                     </div>
                                                 ))}
                                             </div>
                                         )}
                                     </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                                            <HardDrive className="w-3 h-3" />
                                            {log.model || 'General'}
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-10 text-center text-slate-400 italic">
                                        Belum ada rekaman aktivitas.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {logs.links && logs.links.length > 3 && (
                    <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-center gap-1">
                        {logs.links.map((link, idx) => (
                            <button
                                key={idx}
                                disabled={!link.url || link.active}
                                onClick={() => window.location.href = link.url}
                                className={`px-3 py-1 text-sm rounded-md transition-all ${
                                    link.active 
                                    ? 'bg-indigo-600 text-white font-bold' 
                                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 disabled:opacity-50'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
