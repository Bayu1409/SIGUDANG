import React from "react";
import SidebarAdmin from "@/Components/SidebarAdmin";

export default function AdminLayout({ children, header }) {
  return (
    <div className="min-h-screen flex bg-slate-50">
      <SidebarAdmin />
      <main className="flex-1">
        {header && (
          <div className="bg-white shadow">
            <div className="px-6 py-4">{header}</div>
          </div>
        )}
        <div className="p-6">{children}</div>
      </main>
      
    </div>
  );
}