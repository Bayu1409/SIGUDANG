import React, { useEffect, useState } from "react";
import SidebarAdmin from "@/Components/SidebarAdmin";
import { usePage, Link } from "@inertiajs/react";
import { AlertCircle, CheckCircle, Info, Menu, X, Package } from "lucide-react";

export default function AdminLayout({ children, header }) {
  const { auth, event, flash } = usePage().props;
  const [showFlash, setShowFlash] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showLowStockItems, setShowLowStockItems] = useState(false);

  useEffect(() => {
    if (flash && (flash.message || flash.error)) {
      setShowFlash(true);
      const timer = setTimeout(() => setShowFlash(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [flash]);

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans text-slate-900">
      <SidebarAdmin isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        {/* MOBILE HEADER */}
        <header className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-[90]">
          <div className="flex items-center gap-3">
             <div className="bg-indigo-600 p-1.5 rounded-lg shadow-sm">
                <Menu className="w-5 h-5 text-white" />
             </div>
             <span className="font-bold text-slate-800 tracking-tight">Sigudang</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <Menu className="w-6 h-6 text-slate-600" />
          </button>
        </header>

        {/* STICKY UNIFIED ALERTS (Visiable even when scrolling content) */}
        <div className="z-[80] shadow-md font-sans">
            {event?.is_event_month ? (
                /* BANNER KHUSUS BULAN RAMAI (Hanya 1 Banner) */
                <div className={`text-white px-6 py-3 flex items-center justify-between transition-all duration-500 ${
                event.is_all_stock_fulfilled 
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600' 
                : 'bg-gradient-to-r from-orange-500 to-rose-500 animate-pulse-slow'
                }`}>
                <div className="flex items-center gap-4">
                    <div className="bg-white/20 p-2 rounded-lg">
                        {event.is_all_stock_fulfilled ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    </div>
                    <div className="text-left">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 leading-none mb-1">Musim Ramai ({event.current_month})</h4>
                        <p className="text-sm font-bold tracking-tight">
                        {event.is_all_stock_fulfilled 
                            ? `Luar biasa! Target stok musim ini telah terpenuhi.`
                            : `Perhatian: ${event.low_stock_items.length} barang belum memenuhi ambang batas stok musim ramai.`
                        }
                        </p>
                    </div>
                </div>
                
                {!event.is_all_stock_fulfilled && (
                    <button 
                        onClick={() => setShowLowStockItems(!showLowStockItems)}
                        className="bg-white text-orange-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase shadow-lg hover:bg-slate-900 hover:text-white transition-all outline-none"
                    >
                        {showLowStockItems ? 'Tutup Detail' : 'Lihat Barang'}
                    </button>
                )}
                </div>
            ) : (
                /* BANNER BULAN NORMAL (Hanya muncul jika ada stok kritis) */
                event?.low_stock_items?.length > 0 && (
                <div className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between border-b border-white/10">
                    <div className="flex items-center gap-4">
                        <div className="bg-rose-600 p-2 rounded-lg">
                            <AlertCircle className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 leading-none mb-1">Status Stok ({event.current_month})</h4>
                            <p className="text-sm font-bold tracking-tight">Peringatan: {event.low_stock_items.length} item berada di bawah batas minimum.</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setShowLowStockItems(!showLowStockItems)}
                        className="border border-white/20 hover:bg-white/10 px-4 py-1.5 rounded-full text-[10px] font-black uppercase transition-all outline-none"
                    >
                        {showLowStockItems ? 'Sembunyikan' : 'Detail Barang'}
                    </button>
                </div>
                )
            )}

            {/* LIST DETAIL STOK (Dropdown style) */}
            {showLowStockItems && event?.low_stock_items?.length > 0 && (
                <div className="bg-white border-b border-slate-100 shadow-2xl max-h-72 overflow-y-auto animate-in slide-in-from-top duration-300">
                    <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {event.low_stock_items.map((item, idx) => (
                            <Link 
                                key={idx} 
                                href={route('stok-minimum.index')}
                                onClick={() => setShowLowStockItems(false)}
                                className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-indigo-600 hover:bg-white hover:shadow-xl hover:shadow-indigo-50/50 transition-all text-left"
                            >
                                <div className="bg-white p-3 rounded-xl shadow-sm text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shrink-0">
                                    <Package className="w-5 h-5" />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-xs font-black text-slate-800 truncate uppercase tracking-tight leading-none mb-1.5">{item.nama_barang}</p>
                                    <p className="text-[11px] text-rose-600 font-black leading-none group-hover:scale-105 transition-transform origin-left">Stok: {item.stok} Unit</p>
                                    <p className="text-[9px] text-slate-400 font-mono mt-1.5 leading-none">ID: {item.kode_barang}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <div className="px-5 py-3 bg-slate-50/50 border-t border-slate-100 flex justify-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic flex items-center gap-2">
                             <Info className="w-3 h-3" /> Klik pada kartu barang untuk melakukan restock instan
                        </p>
                    </div>
                </div>
            )}
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar-main">
          {/* FLASH MESSAGES */}
          {showFlash && flash && (flash.message || flash.error) && (
            <div className="fixed top-24 right-4 z-[9999] animate-bounce-in max-w-[90vw]">
              <div className={`p-4 rounded-2xl shadow-2xl border flex items-start gap-4 min-w-[300px] backdrop-blur-xl ${flash.message ? 'bg-white/90 border-emerald-100 text-emerald-800' : 'bg-white/90 border-rose-100 text-rose-800'
                }`}>
                <div className={`p-2 rounded-xl ${flash.message ? 'bg-emerald-100' : 'bg-rose-100'}`}>
                  {flash.message ? <CheckCircle className="w-5 h-5 text-emerald-600" /> : <AlertCircle className="w-5 h-5 text-rose-600" />}
                </div>
                <div className="flex-1 pt-0.5 text-left">
                  <p className="text-sm font-bold">{flash.message ? 'Berhasil Diperbarui' : 'Terjadi Kesalahan'}</p>
                  <p className="text-xs opacity-70 mt-1 leading-relaxed">{flash.message || flash.error}</p>
                </div>
                <button onClick={() => setShowFlash(false)} className="hover:bg-slate-200/50 p-1.5 rounded-xl transition-colors">
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>
          )}

          {header && (
            <div className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-100/80">
              <div className="px-6 py-6 lg:px-8">{header}</div>
            </div>
          )}

          <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">
            {children}
          </div>
        </div>
      </main>

      <style>{`
        @keyframes bounce-in {
          0% { transform: translateX(100%) scale(0.9); opacity: 0; }
          70% { transform: translateX(-5%) scale(1.02); }
          100% { transform: translateX(0) scale(1); opacity: 1; }
        }
        .animate-bounce-in {
          animation: bounce-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; filter: brightness(1); }
          50% { opacity: 0.9; filter: brightness(1.1); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        .custom-scrollbar-main::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar-main::-webkit-scrollbar-track {
          background: #f8fafc;
        }
        .custom-scrollbar-main::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
          border: 2px solid #f8fafc;
        }
        .custom-scrollbar-main::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
}

