import React, { useState } from "react";
import { useForm, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";

const MONTHS = [
    { value: 1, label: "Januari" },
    { value: 2, label: "Februari" },
    { value: 3, label: "Maret" },
    { value: 4, label: "April" },
    { value: 5, label: "Mei" },
    { value: 6, label: "Juni" },
    { value: 7, label: "Juli" },
    { value: 8, label: "Agustus" },
    { value: 9, label: "September" },
    { value: 10, label: "Oktober" },
    { value: 11, label: "November" },
    { value: 12, label: "Desember" }
];

export default function SettingIndex({ settings }) {
    const { flash } = usePage().props;

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
        e.preventDefault();
        put(route("setting.update"));
    };

    return (
        <AdminLayout
            header={
                <h2 className="text-xl font-semibold text-gray-800">
                    Pengaturan Sistem
                </h2>
            }
        >
            <div className="max-w-4xl bg-white p-8 rounded-xl shadow-md">
                
                {flash?.success && (
                    <div className="mb-6 p-4 bg-green-100 text-green-700 rounded border border-green-200">
                        {flash.success}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-8">
                    
                    {/* Event Months */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">
                            Konfigurasi Bulan Event (Pramuka)
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">
                            Pilih bulan-bulan di mana terjadi lonjakan permintaan (musim sibuk).
                            Bulan ini akan menggunakan "Limit Stok Kelangkaan Event".
                        </p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {MONTHS.map((m) => {
                                const isSelected = data.event_months.includes(m.value);
                                return (
                                    <button
                                        type="button"
                                        key={m.value}
                                        onClick={() => toggleMonth(m.value)}
                                        className={`px-4 py-2 text-sm rounded-lg border flex items-center justify-between transition-colors ${
                                            isSelected 
                                            ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        {m.label}
                                        {isSelected && (
                                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Stock Limits */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">
                            Konfigurasi Batas Stok
                        </h3>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Batas Stok Darurat (Bulan Normal)
                                </label>
                                <input
                                    type="number"
                                    value={data.limit_stok_normal}
                                    onChange={e => setData('limit_stok_normal', e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    min="0"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Peringatan muncul jika stok di bawah angka ini pada bulan biasa.
                                </p>
                                {errors.limit_stok_normal && <div className="text-red-500 text-xs mt-1">{errors.limit_stok_normal}</div>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Batas Stok Darurat (Bulan Event)
                                </label>
                                <input
                                    type="number"
                                    value={data.limit_stok_event}
                                    onChange={e => setData('limit_stok_event', e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    min="0"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Peringatan muncul lebih awal jika di bawah angka ini pada bulan event.
                                </p>
                                {errors.limit_stok_event && <div className="text-red-500 text-xs mt-1">{errors.limit_stok_event}</div>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Batas Dead Stock (Hari)
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={data.limit_dead_stock}
                                        onChange={e => setData('limit_dead_stock', e.target.value)}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pr-12"
                                        min="1"
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500 text-sm">
                                        Hari
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Barang dianggap terhenti perputaran stoknya jika tidak ada aktivitas keluar melampaui jumlah hari ini.
                                </p>
                                {errors.limit_dead_stock && <div className="text-red-500 text-xs mt-1">{errors.limit_dead_stock}</div>}
                            </div>

                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className={`px-6 py-2 bg-blue-600 text-white rounded-md font-semibold tracking-wide hover:bg-blue-700 shadow-md transition ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Pengaturan'}
                        </button>
                    </div>

                </form>

            </div>
        </AdminLayout>
    );
}
