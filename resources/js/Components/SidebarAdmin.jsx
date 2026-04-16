import React, { useMemo, useState } from "react";
import NavLink from "./NavLink";
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
  Boxes
} from "lucide-react";

export default function Sidebar({ className = "" }) {

  const [openManagement, setOpenManagement] = useState(true);
  const [openTransaksi, setOpenTransaksi] = useState(true);
  const [openMonitoring, setOpenMonitoring] = useState(true);
  const [openLaporan, setOpenLaporan] = useState(true);

  // =========================
  // MENU MANAJEMEN
  // =========================

  const managementItems = useMemo(
    () => [
      {
        label: "Manajemen Barang",
        href: route("barang.index"),
        routeName: "barang.index",
      },
      {
        label: "Manajemen Kategori Barang",
        href: route("kategori-barang.index"),
        routeName: "kategori-barang.index",
      },
      {
        label: "Manajemen Satuan",
        href: route("satuan.index"),
        routeName: "satuan.index",
      },
      {
        label: "Manajemen Supplier",
        href: route("supplier.index"),
        routeName: "supplier.index",
      },
    ],
    []
  );

  // =========================
  // MENU TRANSAKSI
  // =========================

  const transaksiItems = useMemo(
    () => [
      {
        label: "Barang Masuk",
        href: route("barang-masuk.index"),
        routeName: "barang-masuk.index",
      },
      {
        label: "Barang Keluar",
        href: route("barang-keluar.index"),
        routeName: "barang-keluar.index",
      },
    ],
    []
  );

  // =========================
  // MENU MONITORING STOK
  // =========================

  const monitoringItems = useMemo(
    () => [
      {
        label: "Stok Barang",
        href: route("stok.index"),
        routeName: "stok.index",
      },
      {
        label: "Stok Minimum",
        href: route("stok-minimum.index"),
        routeName: "stok-minimum.index",
      },
      {
        label: "Dead Stock",
        href: route("dead-stock.index"),
        routeName: "dead-stock.index",
      },
    ],
    []
  );

  // =========================
  // MENU LAPORAN
  // =========================

  const laporanItems = useMemo(
    () => [
      {
        label: "Laporan Barang Masuk",
        href: route("laporan.barang-masuk"),
        routeName: "laporan.barang-masuk",
      },
      {
        label: "Laporan Barang Keluar",
        href: route("laporan.barang-keluar"),
        routeName: "laporan.barang-keluar",
      },
      {
        label: "Laporan Stok",
        href: route("laporan.stok"),
        routeName: "laporan.stok",
      },
      {
        label: "Laporan Dead Stock",
        href: route("laporan.dead-stock"),
        routeName: "laporan.dead-stock",
      },
    ],
    []
  );

  // =========================
  // MENU SUPERADMIN
  // =========================
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
    <aside
      className={[
        "w-64 min-h-screen bg-slate-900 text-slate-100 border-r border-slate-800",
        className,
      ].join(" ")}
    >

      {/* HEADER */}

      <div className="px-5 py-6 border-b border-slate-800 flex items-center gap-3">
        <div className="bg-indigo-600 p-2 rounded-lg">
          <Boxes className="w-6 h-6 text-white" />
        </div>
        <div>
          <div className="text-base font-bold tracking-tight text-white">
            Sigudang
          </div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">
            {isSuperAdmin ? "Super Admin" : "Admin Panel"}
          </div>
        </div>
      </div>

      <nav className="p-3 space-y-1">

        {/* DASHBOARD */}

        <NavLink
          href={route("dashboard")}
          active={route().current("dashboard")}
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-300 font-medium transition-colors"
        >
          <LayoutDashboard className="w-5 h-5" />
          Dashboard
        </NavLink>

        {/* ========================= */}
        {/* MANAJEMEN */}
        {/* ========================= */}

        <button
          type="button"
          onClick={() => setOpenManagement(v => !v)}
          className="w-full mt-4 flex items-center justify-between px-3 py-2 rounded-md hover:bg-slate-800 text-left text-slate-500 font-bold uppercase text-[10px] tracking-widest"
        >
          <span>Inventory</span>
          <span>{openManagement ? "−" : "+"}</span>
        </button>

        {openManagement && (

          <div className="pl-2 flex flex-col gap-1">

            {managementItems.map((item) => (

              <NavLink
                key={item.routeName}
                href={item.href}
                active={route().current(item.routeName)}
                className="block w-full px-3 py-2 rounded-md hover:bg-slate-800 text-slate-200"
              >
                {item.label}
              </NavLink>

            ))}

          </div>

        )}

        {/* ========================= */}
        {/* TRANSAKSI */}
        {/* ========================= */}

        <button
          type="button"
          onClick={() => setOpenTransaksi(v => !v)}
          className="w-full mt-4 flex items-center justify-between px-3 py-2 rounded-md hover:bg-slate-800 text-left text-slate-500 font-bold uppercase text-[10px] tracking-widest"
        >
          <span>Mutasi Barang</span>
          <span>{openTransaksi ? "−" : "+"}</span>
        </button>

        {openTransaksi && (

          <div className="pl-2 flex flex-col gap-1">

            {transaksiItems.map((item) => (

              <NavLink
                key={item.routeName}
                href={item.href}
                active={route().current(item.routeName)}
                className="block w-full px-3 py-2 rounded-md hover:bg-slate-800 text-slate-200"
              >
                {item.label}
              </NavLink>

            ))}

          </div>

        )}

        {/* ========================= */}
        {/* MONITORING STOK */}
        {/* ========================= */}

        <button
          type="button"
          onClick={() => setOpenMonitoring(v => !v)}
          className="w-full mt-4 flex items-center justify-between px-3 py-2 rounded-md hover:bg-slate-800 text-left text-slate-500 font-bold uppercase text-[10px] tracking-widest"
        >
          <span>Monitoring</span>
          <span>{openMonitoring ? "−" : "+"}</span>
        </button>

        {openMonitoring && (

          <div className="pl-2 flex flex-col gap-1">

            {monitoringItems.map((item) => (

              <NavLink
                key={item.routeName}
                href={item.href}
                active={route().current(item.routeName)}
                className="block w-full px-3 py-2 rounded-md hover:bg-slate-800 text-slate-200"
              >
                {item.label}
              </NavLink>

            ))}

          </div>

        )}

        {/* ========================= */}
        {/* LAPORAN */}
        {/* ========================= */}

        <button
          type="button"
          onClick={() => setOpenLaporan(v => !v)}
          className="w-full mt-4 flex items-center justify-between px-3 py-2 rounded-md hover:bg-slate-800 text-left text-slate-500 font-bold uppercase text-[10px] tracking-widest"
        >
          <span>Report & Analysis</span>
          <span>{openLaporan ? "−" : "+"}</span>
        </button>

        {openLaporan && (

          <div className="pl-2 flex flex-col gap-1">

            {laporanItems.map((item) => (

              <NavLink
                key={item.routeName}
                href={item.href}
                active={route().current(item.routeName) || route().current(item.routeName + ".export")}
                className="block w-full px-3 py-2 rounded-md hover:bg-slate-800 text-slate-200"
              >
                {item.label}
              </NavLink>

            ))}

          </div>

        )}

        {/* ========================= */}
        {/* SUPERADMIN ONLY */}
        {/* ========================= */}
        {isSuperAdmin && (
          <>
            <button
              type="button"
              onClick={() => setOpenSuperadmin(v => !v)}
              className="w-full mt-4 flex items-center justify-between px-3 py-2 rounded-md hover:bg-slate-800 text-left text-slate-500 font-bold uppercase text-[10px] tracking-widest"
            >
              <span>Administrator</span>
              <span>{openSuperadmin ? "−" : "+"}</span>
            </button>

            {openSuperadmin && (
              <div className="pl-2 flex flex-col gap-1">
                {superadminItems.map((item) => (
                  <NavLink
                    key={item.routeName}
                    href={item.href}
                    active={route().current(item.routeName) || route().current(item.routeName + ".*")}
                    className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 text-slate-300 transition-colors"
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </NavLink>
                ))}
              </div>
            )}
          </>
        )}

        <div className="pt-10">
          <Link
            href={route("logout")}
            method="post"
            as="button"
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 font-semibold transition-all border border-transparent hover:border-rose-500/20"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </Link>
        </div>

      </nav>

    </aside>
  );
}