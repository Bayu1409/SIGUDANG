import React, { useMemo, useState } from "react";
import { Link, usePage, router } from "@inertiajs/react";
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
  Tag,
  Menu
} from "lucide-react";
import ConfirmationModal from "./ConfirmationModal";

export default function Sidebar({ className = "", isOpen, onClose }) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem('sb-collapsed') === 'true';
    }
    return false;
  });

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem('sb-collapsed', isCollapsed);
    }
  }, [isCollapsed]);

  const handleLogout = () => {
    router.post(route("logout"));
  };

  const [openManagement, setOpenManagement] = useState(() => localStorage.getItem('sb-management') !== 'false');
  const [openTransaksi, setOpenTransaksi] = useState(() => localStorage.getItem('sb-transaksi') !== 'false');
  const [openMonitoring, setOpenMonitoring] = useState(() => localStorage.getItem('sb-monitoring') !== 'false');
  const [openLaporan, setOpenLaporan] = useState(() => localStorage.getItem('sb-laporan') !== 'false');

  React.useEffect(() => {
    localStorage.setItem('sb-management', openManagement);
  }, [openManagement]);

  React.useEffect(() => {
    localStorage.setItem('sb-transaksi', openTransaksi);
  }, [openTransaksi]);

  React.useEffect(() => {
    localStorage.setItem('sb-monitoring', openMonitoring);
  }, [openMonitoring]);

  React.useEffect(() => {
    localStorage.setItem('sb-laporan', openLaporan);
  }, [openLaporan]);

  // Preserve scroll position
  const navRef = React.useRef(null);
  React.useEffect(() => {
    const nav = navRef.current;
    if (nav) {
      const scrollPos = localStorage.getItem('sb-scroll');
      if (scrollPos) {
        nav.scrollTop = parseInt(scrollPos, 10);
      }

      const handleScroll = () => {
        localStorage.setItem('sb-scroll', nav.scrollTop);
      };

      nav.addEventListener('scroll', handleScroll);
      return () => nav.removeEventListener('scroll', handleScroll);
    }
  }, []);

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

  const [openSuperadmin, setOpenSuperadmin] = useState(() => localStorage.getItem('sb-superadmin') !== 'false');

  React.useEffect(() => {
    localStorage.setItem('sb-superadmin', openSuperadmin);
  }, [openSuperadmin]);

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
          "fixed inset-y-0 left-0 z-[101] bg-slate-900 text-slate-100 border-r border-slate-800 transition-all duration-300 ease-in-out transform lg:static lg:h-screen lg:sticky lg:top-0",
          isCollapsed ? "w-[88px]" : "w-72",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          className,
        ].join(" ")}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* HEADER */}
          <div className={`py-6 border-b border-white/5 flex transition-all duration-300 ${isCollapsed ? 'flex-col items-center px-4 gap-4' : 'flex-row items-center justify-between px-6'}`}>
            <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
              <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20 shrink-0">
                <Boxes className="w-6 h-6 text-white" />
              </div>
              {!isCollapsed && (
                <div className="overflow-hidden">
                  <div className="text-lg font-display font-bold tracking-tight text-white leading-tight truncate">
                    Sigudang
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400 mt-0.5 truncate">
                    {isSuperAdmin ? "Super Admin" : "Admin"}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex gap-2 shrink-0">
               <button
                 onClick={() => setIsCollapsed(!isCollapsed)}
                 className={`hidden lg:flex p-2 rounded-lg hover:bg-slate-800 text-slate-400 transition-colors justify-center items-center ${isCollapsed ? 'mx-auto' : ''}`}
                 title={isCollapsed ? "Perbesar Sidebar" : "Perkecil Sidebar"}
               >
                 <Menu className="w-5 h-5 shrink-0" />
               </button>
               <button
                 onClick={onClose}
                 className="lg:hidden p-2 rounded-lg hover:bg-slate-800 text-slate-400 transition-colors shrink-0"
                 title="Tutup Sidebar"
               >
                 <X className="w-5 h-5 shrink-0" />
               </button>
            </div>
          </div>

          <nav ref={navRef} className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">

            {/* DASHBOARD */}
            <div>
              <Link
                href={route("dashboard")}
                className={`flex items-center gap-3 py-3 rounded-xl transition-all group ${route().current('dashboard')
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                  } ${isCollapsed ? 'justify-center px-0 mx-2' : 'px-4'}`}
                title="Dashboard"
              >
                <LayoutDashboard className="w-5 h-5 shrink-0" />
                {!isCollapsed && <span className="font-semibold truncate">Dashboard</span>}
              </Link>
            </div>

            {/* MONITORING STOK */}
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => !isCollapsed && setOpenMonitoring(v => !v)}
                className={`w-full flex items-center text-indigo-400 font-bold uppercase text-[10px] tracking-[0.2em] transition-colors rounded-lg ${isCollapsed ? 'justify-center py-4 bg-transparent mb-0 cursor-default' : 'justify-between px-4 py-2 hover:text-indigo-300 bg-indigo-500/5 mb-1 cursor-pointer'}`}
                title="Monitoring"
              >
                {isCollapsed ? (
                  <div className="w-8 h-px bg-indigo-500/30"></div>
                ) : (
                  <>
                    <span>Monitoring</span>
                    <span>{openMonitoring ? "−" : "+"}</span>
                  </>
                )}
              </button>

              {(openMonitoring || isCollapsed) && (
                <div className="mt-1 space-y-1">
                  {monitoringItems.map((item) => (
                    <Link
                      key={item.routeName}
                      href={item.href}
                      className={`flex items-center gap-3 py-2.5 rounded-xl transition-all text-sm font-medium ${isCollapsed ? 'justify-center px-0 mx-2' : 'px-4'} ${route().current(item.routeName) || route().current(item.routeName + ".*")
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                          : "text-slate-400 hover:text-white hover:bg-white/5"
                        }`}
                      title={item.label}
                    >
                      {item.icon && <item.icon className="w-5 h-5 opacity-70 shrink-0" />}
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* INVENTORY */}
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => !isCollapsed && setOpenManagement(v => !v)}
                className={`w-full flex items-center text-emerald-400 font-bold uppercase text-[10px] tracking-[0.2em] transition-colors rounded-lg ${isCollapsed ? 'justify-center py-4 bg-transparent mb-0 cursor-default' : 'justify-between px-4 py-2 hover:text-emerald-300 bg-emerald-500/5 mb-1 cursor-pointer'}`}
                title="Inventory"
              >
                {isCollapsed ? (
                  <div className="w-8 h-px bg-emerald-500/30"></div>
                ) : (
                  <>
                    <span>Inventory</span>
                    <span>{openManagement ? "−" : "+"}</span>
                  </>
                )}
              </button>

              {(openManagement || isCollapsed) && (
                <div className="mt-1 space-y-1">
                  {managementItems.map((item) => (
                    <Link
                      key={item.routeName}
                      href={item.href}
                      className={`flex items-center gap-3 py-2.5 rounded-xl transition-all text-sm font-medium ${isCollapsed ? 'justify-center px-0 mx-2' : 'px-4'} ${route().current(item.routeName) || route().current(item.routeName + ".*")
                          ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                          : "text-slate-400 hover:text-white hover:bg-white/5"
                        }`}
                      title={item.label}
                    >
                      {item.icon && <item.icon className="w-5 h-5 opacity-70 shrink-0" />}
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* MUTASI */}
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => !isCollapsed && setOpenTransaksi(v => !v)}
                className={`w-full flex items-center text-amber-400 font-bold uppercase text-[10px] tracking-[0.2em] transition-colors rounded-lg ${isCollapsed ? 'justify-center py-4 bg-transparent mb-0 cursor-default' : 'justify-between px-4 py-2 hover:text-amber-300 bg-amber-500/5 mb-1 cursor-pointer'}`}
                title="Mutasi"
              >
                {isCollapsed ? (
                  <div className="w-8 h-px bg-amber-500/30"></div>
                ) : (
                  <>
                    <span>Mutasi Barang</span>
                    <span>{openTransaksi ? "−" : "+"}</span>
                  </>
                )}
              </button>

              {(openTransaksi || isCollapsed) && (
                <div className="mt-1 space-y-1">
                  {transaksiItems.map((item) => (
                    <Link
                      key={item.routeName}
                      href={item.href}
                      className={`flex items-center gap-3 py-2.5 rounded-xl transition-all text-sm font-medium ${isCollapsed ? 'justify-center px-0 mx-2' : 'px-4'} ${route().current(item.routeName) || route().current(item.routeName + ".*")
                          ? "bg-amber-600 text-white shadow-lg shadow-amber-500/20"
                          : "text-slate-400 hover:text-white hover:bg-white/5"
                        }`}
                      title={item.label}
                    >
                      {item.icon && <item.icon className="w-5 h-5 opacity-70 shrink-0" />}
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* REPORT */}
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => !isCollapsed && setOpenLaporan(v => !v)}
                className={`w-full flex items-center text-rose-400 font-bold uppercase text-[10px] tracking-[0.2em] transition-colors rounded-lg ${isCollapsed ? 'justify-center py-4 bg-transparent mb-0 cursor-default' : 'justify-between px-4 py-2 hover:text-rose-300 bg-rose-500/5 mb-1 cursor-pointer'}`}
                title="Report"
              >
                {isCollapsed ? (
                  <div className="w-8 h-px bg-rose-500/30"></div>
                ) : (
                  <>
                    <span>Report & Analysis</span>
                    <span>{openLaporan ? "−" : "+"}</span>
                  </>
                )}
              </button>

              {(openLaporan || isCollapsed) && (
                <div className="mt-1 space-y-1">
                  {laporanItems.map((item) => (
                    <Link
                      key={item.routeName}
                      href={item.href}
                      className={`flex items-center gap-3 py-2.5 rounded-xl transition-all text-sm font-medium ${isCollapsed ? 'justify-center px-0 mx-2' : 'px-4'} ${route().current(item.routeName) || route().current(item.routeName + ".export")
                          ? "bg-rose-600 text-white shadow-lg shadow-rose-500/20"
                          : "text-slate-400 hover:text-white hover:bg-white/5"
                        }`}
                      title={item.label}
                    >
                      {item.icon && <item.icon className="w-5 h-5 opacity-70 shrink-0" />}
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
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
                  onClick={() => !isCollapsed && setOpenSuperadmin(v => !v)}
                  className={`w-full flex items-center text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] transition-colors rounded-lg ${isCollapsed ? 'justify-center py-4 bg-transparent mb-0 cursor-default' : 'justify-between px-4 py-2 hover:text-slate-300 bg-slate-500/5 mb-1 cursor-pointer'}`}
                  title="Administrator"
                >
                  {isCollapsed ? (
                    <div className="w-8 h-px bg-slate-500/30"></div>
                  ) : (
                    <>
                      <span>Administrator</span>
                      <span>{openSuperadmin ? "−" : "+"}</span>
                    </>
                  )}
                </button>

                {(openSuperadmin || isCollapsed) && (
                  <div className="mt-1 space-y-1">
                    {superadminItems.map((item) => (
                      <Link
                        key={item.routeName}
                        href={item.href}
                        className={`flex items-center gap-3 py-2.5 rounded-xl transition-all text-sm font-medium ${isCollapsed ? 'justify-center px-0 mx-2' : 'px-4'} ${route().current(item.routeName) || route().current(item.routeName + ".*")
                            ? "bg-slate-600 text-white shadow-lg shadow-slate-500/20"
                            : "text-slate-400 hover:text-white hover:bg-white/5"
                          }`}
                        title={item.label}
                      >
                        {(() => {
                          const Icon = item.icon;
                          return <Icon className="w-5 h-5 opacity-70 shrink-0" />;
                        })()}
                        {!isCollapsed && <span className="truncate">{item.label}</span>}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* FOOTER */}
          <div className="p-4 border-t border-white/5 space-y-2 bg-slate-900/50 backdrop-blur-xl shrink-0">
            <Link
              href={route("setting.index")}
              className={`group flex items-center rounded-xl text-slate-400 hover:bg-indigo-500/10 hover:text-indigo-400 font-medium transition-all ${isCollapsed ? 'justify-center p-3 mx-auto' : 'w-full gap-3 px-4 py-3'}`}
              title="Kontrol Stok & Event"
            >
              <Settings className="w-5 h-5 shrink-0 transition-transform group-hover:rotate-45" />
              {!isCollapsed && <span className="truncate text-sm">Kontrol Stok & Event</span>}
            </Link>

            <div className={`flex items-center ${isCollapsed ? 'justify-center py-2' : 'px-4 py-2 gap-3 mb-2'}`}>
              <div className="w-8 h-8 shrink-0 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300 border border-slate-700" title={auth.user?.name}>
                {auth.user?.name?.charAt(0) || 'A'}
              </div>
              {!isCollapsed && (
                <div className="flex-1 overflow-hidden text-[10px]">
                  <p className="text-slate-200 font-bold truncate">{auth.user?.name}</p>
                  <p className="text-slate-500 truncate">{auth.user?.email}</p>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowLogoutConfirm(true)}
              className={`flex items-center rounded-xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 font-semibold transition-all group ${isCollapsed ? 'justify-center p-3 mx-auto' : 'w-full gap-3 px-4 py-3'}`}
              title="Sign Out"
            >
              <LogOut className="w-5 h-5 shrink-0 transition-transform group-hover:-translate-x-1" />
              {!isCollapsed && <span className="truncate text-sm">Sign Out</span>}
            </button>
          </div>
        </div>

        <ConfirmationModal
          show={showLogoutConfirm}
          onClose={() => setShowLogoutConfirm(false)}
          onConfirm={handleLogout}
          title="Konfirmasi Logout"
          message="Apakah Anda yakin ingin keluar dari sistem Sigudang?"
          confirmText="Ya, Logout"
          type="danger"
        />
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