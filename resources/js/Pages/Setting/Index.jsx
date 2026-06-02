import React, { useState } from "react";
import { useForm, usePage, Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Settings, Save, Calendar, BarChart3, Clock, AlertTriangle, CheckCircle2 } from "lucide-react";

const MONTHS = [
    { value: 1, label: "Januari" }, { value: 2, label: "Februari" },
    { value: 3, label: "Maret" }, { value: 4, label: "April" },
    { value: 5, label: "Mei" }, { value: 6, label: "Juni" },
    { value: 7, label: "Juli" }, { value: 8, label: "Agustus" },
    { value: 9, label: "September" }, { value: 10, label: "Oktober" },
    { value: 11, label: "November" }, { value: 12, label: "Desember" }
];

export default function SettingIndex({ settings }) {
    const { flash } = usePage().props;
    const [showConfirm, setShowConfirm] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        event_months: Array.isArray(settings.event_months) ? settings.event_months : [],
        limit_stok_normal: settings.limit_stok_normal || 10,
        limit_stok_event: settings.limit_stok_event || 50,
        limit_dead_stock: settings.limit_dead_stock || 30,
    });

    const toggleMonth = (monthValue) => {
        const current = [...data.event_months];
        if (current.includes(monthValue)) {
            setData("event_months", current.filter(m => m !== monthValue));
        } else {
            setData("event_months", [...current, monthValue]);
        }
    };

    const submit = (e) => {
        if (e) e.preventDefault();
        put(route("setting.update"), {
            onSuccess: () => setShowConfirm(false),
        });
    };

    return (
        <AdminLayout>
            <Head title="Pengaturan Sistem" />

            <div className="max-w-4xl mx-auto p-2">
                <div className="flex justify-between items-center mb-6 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                            <Settings className="w-5 h-5 text-indigo-500" />
                            Pengaturan Sistem
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">Konfigurasi ambang batas stok dan penjadwalan bulan event.</p>
                    </div>
                </div>

                {flash?.success && (
                    <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="text-sm font-medium">{flash.success}</span>
                    </div>
                )}

                <form onSubmit={(e) => { e.preventDefault(); setShowConfirm(true); }} className="space-y-6">

                    {/* Event Configuration */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-6 border-b border-slate-50 bg-slate-50/30">
                            <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-indigo-500" />
                                Kalender Event (Bulan Sibuk)
                            </h3>
                            <p className="text-[11px] text-slate-500 mt-1">
                                Pilih bulan-bulan dengan lonjakan permintaan tinggi. Stok minimum akan otomatis meningkat pada bulan tersebut.
                            </p>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                {MONTHS.map((m) => {
                                    const isSelected = data.event_months.includes(m.value);
                                    return (
                                        <button
                                            type="button" key={m.value}
                                            onClick={() => toggleMonth(m.value)}
                                            className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all flex items-center justify-center gap-2 ${isSelected
                                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200'
                                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                                }`}
                                        >
                                            {m.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Stock Thresholds */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-6 border-b border-slate-50 bg-slate-50/30">
                            <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                <BarChart3 className="w-4 h-4 text-indigo-500" />
                                Batas Stok
                            </h3>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                    Limit Stok Bulan Normal
                                </label>
                                <input
                                    type="number"
                                    value={data.limit_stok_normal}
                                    onChange={e => setData('limit_stok_normal', e.target.value)}
                                    className="w-full rounded-xl border-slate-200 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    min="0"
                                />
                                <p className="text-[10px] text-slate-400 italic">Peringatan muncul jika stok di bawah angka ini pada bulan normal.</p>
                                {errors.limit_stok_normal && <div className="text-rose-500 text-xs mt-1">{errors.limit_stok_normal}</div>}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                    Limit Stok Bulan Event
                                </label>
                                <input
                                    type="number"
                                    value={data.limit_stok_event}
                                    onChange={e => setData('limit_stok_event', e.target.value)}
                                    className="w-full rounded-xl border-slate-200 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    min="0"
                                />
                                <p className="text-[10px] text-slate-400 italic">Peringatan stok kritis muncul lebih awal pada bulan yang ditandai sebagai 'Event'.</p>
                                {errors.limit_stok_event && <div className="text-rose-500 text-xs mt-1">{errors.limit_stok_event}</div>}
                            </div>
                        </div>
                    </div>

                    {/* Dead Stock Threshold */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-6 border-b border-slate-50 bg-slate-50/30">
                            <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-amber-500" />
                                Kriteria Dead Stock (Barang Mengendap)
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="space-y-1.5 max-w-sm">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                    Batas Maksimal Inaktif (Hari)
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={data.limit_dead_stock}
                                        onChange={e => setData('limit_dead_stock', e.target.value)}
                                        className="w-full rounded-xl border-slate-200 text-sm focus:ring-indigo-500 focus:border-indigo-500 pr-12"
                                        min="1"
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400 text-xs font-bold">
                                        HARI
                                    </div>
                                </div>
                                <p className="text-[10px] text-slate-400 italic">Barang dianggap 'Dead Stock' jika tidak ada aktivitas keluar melampaui angka ini.</p>
                                {errors.limit_dead_stock && <div className="text-rose-500 text-xs mt-1">{errors.limit_dead_stock}</div>}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit" disabled={processing}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" />
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </form>

                {/* Confirmation Overlay */}
                {showConfirm && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full animate-in zoom-in-95">
                            <div className="flex justify-center mb-6">
                                <div className="bg-indigo-100 p-4 rounded-full">
                                    <AlertTriangle className="w-8 h-8 text-indigo-600" />
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 text-center mb-2">Simpan Pengaturan?</h3>
                            <p className="text-sm text-slate-500 text-center mb-8">
                                Perubahan ini akan segera berdampak pada kriteria laporan dan notifikasi stok di seluruh sistem.
                            </p>
                            <div className="flex gap-3">
                                <button onClick={() => setShowConfirm(false)}
                                    className="flex-1 px-5 py-2.5 rounded-lg border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all text-sm">
                                    Batal
                                </button>
                                <button onClick={submit}
                                    className="flex-1 px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all text-sm shadow-lg shadow-indigo-500/20">
                                    Ya, Simpan
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
