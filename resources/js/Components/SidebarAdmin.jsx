import React, { useMemo, useState } from "react";
import NavLink from "./NavLink";

export default function Sidebar({ className = "" }) {

  const [openManagement, setOpenManagement] = useState(true);
  const [openTransaksi, setOpenTransaksi] = useState(true);
  const [openMonitoring, setOpenMonitoring] = useState(true);

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

  return (
    <aside
      className={[
        "w-64 min-h-screen bg-slate-900 text-slate-100 border-r border-slate-800",
        className,
      ].join(" ")}
    >

      {/* HEADER */}

      <div className="px-4 py-5 border-b border-slate-800">

        <div className="text-lg font-semibold tracking-wide">
          Sigudang
        </div>

        <div className="text-xs text-slate-400">
          Admin Panel
        </div>

      </div>

      <nav className="p-3 space-y-1">

        {/* DASHBOARD */}

        <NavLink
          href={route("dashboard")}
          active={route().current("dashboard")}
          className="block px-3 py-2 rounded-md hover:bg-slate-800"
        >
          Dashboard
        </NavLink>

        {/* ========================= */}
        {/* MANAJEMEN */}
        {/* ========================= */}

        <button
          type="button"
          onClick={() => setOpenManagement(v => !v)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-slate-800 text-left"
        >

          <span>Manajemen</span>

          <span className="text-slate-400 text-sm">
            {openManagement ? "−" : "+"}
          </span>

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
          className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-slate-800 text-left"
        >

          <span>Transaksi</span>

          <span className="text-slate-400 text-sm">
            {openTransaksi ? "−" : "+"}
          </span>

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
          className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-slate-800 text-left"
        >

          <span>Monitoring Stok</span>

          <span className="text-slate-400 text-sm">
            {openMonitoring ? "−" : "+"}
          </span>

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

      </nav>

    </aside>
  );
}