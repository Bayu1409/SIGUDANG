import React, { useEffect, useState } from "react";
import SidebarAdmin from "@/Components/SidebarAdmin";
import { usePage } from "@inertiajs/react";
import { AlertCircle, CheckCircle, Info, Menu } from "lucide-react";

export default function AdminLayout({ children, header }) {
  const { auth, event, flash } = usePage().props;
  const [showFlash, setShowFlash] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
      
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
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

        <div className="flex-1 overflow-y-auto custom-scrollbar-main">
          {/* EVENT ALERT BANNER */}
          {event?.is_event_month && (
            <div className={`text-white px-6 py-2.5 flex items-center justify-between shadow-sm animate-pulse-slow ${
              event.is_all_stock_fulfilled 
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500' 
              : 'bg-gradient-to-r from-orange-500 to-amber-500'
            }`}>
              <div className="flex items-center gap-3">
                {event.is_all_stock_fulfilled ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                <span className="text-xs sm:text-sm font-semibold">
                  {event.is_all_stock_fulfilled 
                    ? `Selamat! Semua stok barang sudah memenuhi target musim ${event.current_month}.`
                    : `Peringatan: Saat ini memasuki bulan ${event.current_month} (Musim Ramai). Stok minimum akan ditingkatkan secara otomatis!`
                  }
                </span>
              </div>
            </div>
          )}

          {/* FLASH MESSAGES */}
          {showFlash && flash && (flash.message || flash.error) && (
            <div className="fixed top-20 right-4 z-[9999] animate-bounce-in max-w-[90vw]">
              <div className={`p-4 rounded-2xl shadow-2xl border flex items-start gap-4 min-w-[300px] backdrop-blur-xl ${flash.message ? 'bg-white/90 border-emerald-100 text-emerald-800' : 'bg-white/90 border-rose-100 text-rose-800'
                }`}>
                <div className={`p-2 rounded-xl ${flash.message ? 'bg-emerald-100' : 'bg-rose-100'}`}>
                  {flash.message ? <CheckCircle className="w-5 h-5 text-emerald-600" /> : <AlertCircle className="w-5 h-5 text-rose-600" />}
                </div>
                <div className="flex-1 pt-0.5">
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

