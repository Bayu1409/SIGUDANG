import React, { useMemo, useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
  Users,
  ClipboardList,
  LogOut,
  LayoutDashboard,
  Package,
  Layers,
  Truck,
  ArrowDownToLine,
  ArrowUpFromLine,
  BarChart3,
  AlertTriangle,
  FileText,
  Boxes,
  X,
  Settings,
  Tag
} from "lucide-react";

export default function Sidebar({ className = "", isOpen, onClose }) {

  const [openManagement, setOpenManagement] = useState(true);
  const [openTransaksi, setOpenTransaksi] = useState(true);
  const [openMonitoring, setOpenMonitoring] = useState(true);
  const [openLaporan, setOpenLaporan] = useState(true);

  const managementItems = useMemo(
    () => [
      {
        label: "Manajemen Barang",
        href: route("barang.index"),
        routeName: "barang.index",
        icon: Package,
      },
      {
        label: "Manajemen Kategori Barang",
        href: route("kategori-barang.index"),
        routeName: "kategori-barang.index",
        icon: Layers,
      },
      {
        label: "Manajemen Satuan",
        href: route("satuan.index"),
        routeName: "satuan.index",
        icon: Tag,
      },
      {
        label: "Manajemen Supplier",
        href: route("supplier.index"),
        routeName: "supplier.index",
        icon: Truck,
      },
    ],
    []
  );

  const transaksiItems = useMemo(
    () => [
      {
        label: "Barang Masuk",
        href: route("barang-masuk.index"),
        routeName: "barang-masuk.index",
        icon: ArrowDownToLine,
      },
      {
        label: "Barang Keluar",
        href: route("barang-keluar.index"),
        routeName: "barang-keluar.index",
        icon: ArrowUpFromLine,
      },
    ],
    []
  );

  const monitoringItems = useMemo(
    () => [
      {
        label: "Stok Barang",
        href: route("stok.index"),
        routeName: "stok.index",
        icon: BarChart3,
      },
      {
        label: "Stok Minimum",
        href: route("stok-minimum.index"),
        routeName: "stok-minimum.index",
        icon: AlertTriangle,
      },
      {
        label: "Dead Stock",
        href: route("dead-stock.index"),
        routeName: "dead-stock.index",
        icon: Package,
      },
    ],
    []
  );

  const laporanItems = useMemo(
    () => [
      {
        label: "Laporan Barang Masuk",
        href: route("laporan.barang-masuk"),
        routeName: "laporan.barang-masuk",
        icon: FileText,
      },
      {
        label: "Laporan Barang Keluar",
        href: route("laporan.barang-keluar"),
        routeName: "laporan.barang-keluar",
        icon: FileText,
      },
      {
        label: "Laporan Stok",
        href: route("laporan.stok"),
        routeName: "laporan.stok",
        icon: FileText,
      },
      {
        label: "Laporan Dead Stock",
        href: route("laporan.dead-stock"),
        routeName: "laporan.dead-stock",
        icon: FileText,
      },
    ],
    []
  );

  const superadminItems = useMemo(
    () => [
      {
        label: "Manajemen Pengguna",
        href: route("users.index"),
        routeName: "users.index",
        icon: Users,
      },
      {
        label: "Log Aktivitas",
        href: route("activity-logs.index"),
        routeName: "activity-logs.index",
        icon: ClipboardList,
      },
    ],
    []
  );

  const { auth } = usePage().props;
  const isSuperAdmin = auth.user?.role === "superadmin";

  const [openSuperadmin, setOpenSuperadmin] = useState(true);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-[101] w-72 bg-slate-900 text-slate-100 border-r border-slate-800 transition-transform duration-300 ease-in-out transform lg:translate-x-0 lg:static lg:h-screen lg:sticky lg:top-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          className,
        ].join(" ")}
      >
        <div className="flex flex-col h-full">
          {/* HEADER */}
          <div className="px-6 py-8 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20">
                <Boxes className="w-6 h-6 text-white" />
              </div>
              <div className="overflow-hidden">
                <div className="text-lg font-bold tracking-tight text-white leading-tight">
                  Sigudang
                </div>
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400 mt-0.5">
                  {isSuperAdmin ? "Super Admin" : "Admin Dashboard"}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-800 text-slate-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation with Custom Scrollbar */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
            
            {/* DASHBOARD */}
            <div>
              <Link
                href={route("dashboard")}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                  route().current('dashboard')
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <LayoutDashboard className="w-5 h-5" />
                <span className="font-semibold">Dashboard</span>
              </Link>
            </div>

            {/* MONITORING STOK */}
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setOpenMonitoring(v => !v)}
                className="w-full flex items-center justify-between px-4 py-2 text-left text-indigo-400 font-bold uppercase text-[10px] tracking-[0.2em] hover:text-indigo-300 transition-colors bg-indigo-500/5 rounded-lg mb-1"
              >
                <span>Monitoring</span>
                <span>{openMonitoring ? "−" : "+"}</span>
              </button>

              {openMonitoring && (
                <div className="mt-1 space-y-1">
                  {monitoringItems.map((item) => (
                    <Link
                      key={item.routeName}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm font-medium ${
                        route().current(item.routeName) || route().current(item.routeName + ".*")
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                          : "text-slate-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {item.icon && <item.icon className="w-4 h-4 opacity-70" />}
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* INVENTORY */}
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setOpenManagement(v => !v)}
                className="w-full flex items-center justify-between px-4 py-2 text-left text-emerald-400 font-bold uppercase text-[10px] tracking-[0.2em] hover:text-emerald-300 transition-colors bg-emerald-500/5 rounded-lg mb-1"
              >
                <span>Inventory</span>
                <span>{openManagement ? "−" : "+"}</span>
              </button>

              {openManagement && (
                <div className="mt-1 space-y-1">
                  {managementItems.map((item) => (
                    <Link
                      key={item.routeName}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm font-medium ${
                        route().current(item.routeName) || route().current(item.routeName + ".*")
                          ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                          : "text-slate-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {item.icon && <item.icon className="w-4 h-4 opacity-70" />}
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* MUTASI */}
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setOpenTransaksi(v => !v)}
                className="w-full flex items-center justify-between px-4 py-2 text-left text-amber-400 font-bold uppercase text-[10px] tracking-[0.2em] hover:text-amber-300 transition-colors bg-amber-500/5 rounded-lg mb-1"
              >
                <span>Mutasi Barang</span>
                <span>{openTransaksi ? "−" : "+"}</span>
              </button>

              {openTransaksi && (
                <div className="mt-1 space-y-1">
                  {transaksiItems.map((item) => (
                    <Link
                      key={item.routeName}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm font-medium ${
                        route().current(item.routeName) || route().current(item.routeName + ".*")
                          ? "bg-amber-600 text-white shadow-lg shadow-amber-500/20"
                          : "text-slate-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {item.icon && <item.icon className="w-4 h-4 opacity-70" />}
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* REPORT */}
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setOpenLaporan(v => !v)}
                className="w-full flex items-center justify-between px-4 py-2 text-left text-rose-400 font-bold uppercase text-[10px] tracking-[0.2em] hover:text-rose-300 transition-colors bg-rose-500/5 rounded-lg mb-1"
              >
                <span>Report & Analysis</span>
                <span>{openLaporan ? "−" : "+"}</span>
              </button>

              {openLaporan && (
                <div className="mt-1 space-y-1">
                  {laporanItems.map((item) => (
                    <Link
                      key={item.routeName}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm font-medium ${
                        route().current(item.routeName) || route().current(item.routeName + ".export")
                          ? "bg-rose-600 text-white shadow-lg shadow-rose-500/20"
                          : "text-slate-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {item.icon && <item.icon className="w-4 h-4 opacity-70" />}
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* ADMINISTRATOR */}
            {isSuperAdmin && (
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => setOpenSuperadmin(v => !v)}
                  className="w-full flex items-center justify-between px-4 py-2 text-left text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] hover:text-slate-300 transition-colors bg-slate-500/5 rounded-lg mb-1"
                >
                  <span>Administrator</span>
                  <span>{openSuperadmin ? "−" : "+"}</span>
                </button>

                {openSuperadmin && (
                  <div className="mt-1 space-y-1">
                    {superadminItems.map((item) => (
                      <Link
                        key={item.routeName}
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm font-medium ${
                          route().current(item.routeName) || route().current(item.routeName + ".*")
                            ? "bg-slate-600 text-white shadow-lg shadow-slate-500/20"
                            : "text-slate-400 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {(() => {
                          const Icon = item.icon;
                          return <Icon className="w-4 h-4 opacity-70" />;
                        })()}
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* FOOTER */}
          <div className="p-4 border-t border-white/5 space-y-2 bg-slate-900/50 backdrop-blur-xl">
            <Link
              href={route("setting.index")}
              className="group w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-indigo-500/10 hover:text-indigo-400 font-medium transition-all"
            >
              <Settings className="w-5 h-5 transition-transform group-hover:rotate-45" />
              <span>Kontrol Stok & Event</span>
            </Link>

            <div className="px-4 py-2 flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300 border border-slate-700">
                {auth.user?.name?.charAt(0) || 'A'}
              </div>
              <div className="flex-1 overflow-hidden text-[10px]">
                <p className="text-slate-200 font-bold truncate">{auth.user?.name}</p>
                <p className="text-slate-500 truncate">{auth.user?.email}</p>
              </div>
            </div>

            <Link
              href={route("logout")}
              method="post"
              as="button"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 font-semibold transition-all group"
            >
              <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              <span>Sign Out</span>
            </Link>
          </div>
        </div>
      </aside>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </>
  );
}