import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link } from "@inertiajs/react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import {
    Package,
    Layers,
    ArrowUpCircle,
    ArrowDownCircle,
    AlertTriangle,
    Clock,
    TrendingUp
} from "lucide-react";

export default function Dashboard({ stats, lowStock, chartData, activities, config }) {
    
    // Stats Card Component
    const StatCard = ({ title, value, icon: Icon, color, href }) => (
        <Link 
            href={href}
            className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-all group cursor-pointer"
        >
            <div className={`p-3 rounded-lg ${color} group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
                <p className="text-sm font-medium text-slate-500">{title}</p>
                <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
            </div>
        </Link>
    );

    return (
        <AdminLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Dashboard Utama
                    </h2>
                    <div className="text-sm text-slate-500 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Status Gudang: <span className={`font-bold ${config.isRamai ? 'text-orange-500' : 'text-green-500'}`}>
                            {config.isRamai ? 'Musim Ramai' : 'Musim Normal'}
                        </span>
                    </div>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="space-y-6">
                
                {/* 1. STATS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard 
                        title="Total Barang" 
                        value={stats.total_barang} 
                        icon={Package} 
                        color="bg-indigo-600" 
                        href="/barang"
                    />
                    <StatCard 
                        title="Kategori" 
                        value={stats.total_kategori} 
                        icon={Layers} 
                        color="bg-blue-600" 
                        href="/kategori-barang"
                    />
                    <StatCard 
                        title="Masuk Hari Ini" 
                        value={stats.masuk_today} 
                        icon={ArrowUpCircle} 
                        color="bg-emerald-600" 
                        href="/barang-masuk"
                    />
                    <StatCard 
                        title="Keluar Hari Ini" 
                        value={stats.keluar_today} 
                        icon={ArrowDownCircle} 
                        color="bg-rose-600" 
                        href="/barang-keluar"
                    />
                </div>

                {/* 2. CHARTS & ACTIVITY */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* CHART */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-indigo-500" />
                                Tren Pergerakan Stok
                            </h3>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorMasuk" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="colorKeluar" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
                                            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} tick={{fill: '#94a3b8'}} dy={10} />
                                    <YAxis fontSize={11} tickLine={false} axisLine={false} tick={{fill: '#94a3b8'}} />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '12px', border: '1px solid #f1f5f9', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Legend iconType="circle" wrapperStyle={{paddingTop: '20px'}} />
                                    <Area 
                                        type="monotone" 
                                        dataKey="masuk" 
                                        name="Barang Masuk" 
                                        stroke="#4f46e5" 
                                        strokeWidth={3}
                                        fillOpacity={1} 
                                        fill="url(#colorMasuk)" 
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="keluar" 
                                        name="Barang Keluar" 
                                        stroke="#f43f5e" 
                                        strokeWidth={3}
                                        fillOpacity={1} 
                                        fill="url(#colorKeluar)" 
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* RECENT ACTIVITY */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                            Aktivitas Terbaru
                        </h3>
                        <div className="space-y-4">
                            {activities.length > 0 ? activities.map((act, idx) => (
                                <div key={idx} className="flex gap-3 items-start border-l-2 border-slate-100 pl-4 py-1">
                                    <div className={`mt-1 w-2 h-2 rounded-full ${act.type === 'masuk' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800 leading-none">{act.title}</p>
                                        <p className="text-xs text-slate-500 mt-1">{act.desc}</p>
                                        <p className="text-[10px] text-slate-400 mt-0.5 uppercase font-medium">{act.time}</p>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-sm text-slate-400 text-center py-10">Belum ada aktivitas</p>
                            )}
                        </div>
                    </div>

                </div>

                {/* 3. LOW STOCK WARNING */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-orange-500" />
                            Peringatan Stok Rendah
                        </h3>
                        <span className="text-xs font-medium bg-orange-100 text-orange-700 px-2.5 py-0.5 rounded-full border border-orange-200">
                            Threshold: {config.stokMinimum} Unit
                        </span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                                <tr>
                                    <th className="px-6 py-3">Barang</th>
                                    <th className="px-6 py-3">Kategori</th>
                                    <th className="px-6 py-3">Sisa Stok</th>
                                    <th className="px-6 py-3">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {lowStock.length > 0 ? lowStock.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-slate-900">
                                            {item.nama_barang}
                                            <p className="text-[10px] text-slate-400 font-mono">{item.kode_barang}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {item.kategori?.nama_kategori || '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-bold text-rose-600">
                                                {item.stok} {item.satuan?.nama}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button 
                                                onClick={() => window.location.href = `/barang-masuk/create?barang_id=${item.id}`}
                                                className="text-xs bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white px-3 py-1.5 rounded-lg font-bold transition-all border border-indigo-100"
                                            >
                                                Restock
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-10 text-center text-slate-400 italic text-sm">
                                            Stok semua barang aman!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </AdminLayout>
    );
}