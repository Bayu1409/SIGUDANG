import React, { useEffect, useState } from "react";
import SidebarAdmin from "@/Components/SidebarAdmin";
import { usePage } from "@inertiajs/react";
import { AlertCircle, CheckCircle, Info } from "lucide-react";

export default function AdminLayout({ children, header }) {
  const { event, flash } = usePage().props;
  const [showFlash, setShowFlash] = useState(true);

  useEffect(() => {
    if (flash && (flash.message || flash.error)) {
      setShowFlash(true);
      const timer = setTimeout(() => setShowFlash(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [flash]);

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans">
      <SidebarAdmin />
      <main className="flex-1 flex flex-col">
        {/* EVENT ALERT BANNER */}
        {event?.is_event_month && (
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-2 flex items-center justify-between shadow-sm animate-pulse-slow">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm font-semibold">
                Peringatan: Saat ini memasuki bulan {event.current_month} (Musim Ramai). 
                Stok minimum akan ditingkatkan secara otomatis!
              </span>
            </div>
          </div>
        )}

        {/* FLASH MESSAGES */}
        {showFlash && flash && (flash.message || flash.error) && (
          <div className="fixed top-4 right-4 z-[9999] animate-bounce-in">
             <div className={`p-4 rounded-xl shadow-2xl border-l-4 flex items-center gap-3 min-w-[300px] ${
               flash.message ? 'bg-white border-emerald-500 text-emerald-800' : 'bg-white border-rose-500 text-rose-800'
             }`}>
                {flash.message ? <CheckCircle className="w-5 h-5 text-emerald-500" /> : <AlertCircle className="w-5 h-5 text-rose-500" />}
                <div className="flex-1">
                  <p className="text-sm font-bold">{flash.message ? 'Berhasil!' : 'Terjadi Kesalahan'}</p>
                  <p className="text-xs opacity-80">{flash.message || flash.error}</p>
                </div>
                <button onClick={() => setShowFlash(false)} className="hover:bg-slate-100 p-1 rounded-full transition-colors">
                  <Info className="w-4 h-4 opacity-50" />
                </button>
             </div>
          </div>
        )}

        {header && (
          <div className="bg-white shadow-sm border-b border-slate-100">
            <div className="px-6 py-4">{header}</div>
          </div>
        )}
        <div className="flex-1 p-6">
          {children}
        </div>
      </main>
      <style>{`
        @keyframes bounce-in {
          0% { transform: translateY(-100%) scale(0.9); opacity: 0; }
          70% { transform: translateY(10%) scale(1.05); }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.9; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
