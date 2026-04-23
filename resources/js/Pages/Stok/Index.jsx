
import React, { useState, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { router } from "@inertiajs/react";
import Pagination from "@/Components/Pagination";

export default function Index({ barang, filters = {}, config = {} }) {
    const [search, setSearch] = useState(filters.search || "");
    const stokLimit = config.stokMinimum || 10;

    const isInitialRender = React.useRef(true);
    
    useEffect(() => {
        if (isInitialRender.current) {
            isInitialRender.current = false;
            return;
        }

        const delay = setTimeout(() => {
            router.get(
                route("stok.index"),
                { search },
                { preserveState: true, replace: true, preserveScroll: true }
            );
        }, 300);
        return () => clearTimeout(delay);
    }, [search]);

  return (
    <AdminLayout
      header={
        <h2 className="text-xl font-semibold">
          Monitoring Stok Barang
        </h2>
      }
    >

      <div className="bg-white p-6 rounded shadow">

        {/* SEARCH */}
        <div className="mb-4">
            <input
                type="text"
                placeholder="Cari no/kode barang atau kategori..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full md:w-1/3 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
            />
        </div>

        <div className="overflow-x-auto">

          <table className="min-w-full border">

            <thead className="bg-gray-100">

              <tr>

                <th className="px-4 py-2 border w-12">
                  No
                </th>

                <th className="px-4 py-2 border">
                  Kode Barang
                </th>

                <th className="px-4 py-2 border">
                  Nama Barang
                </th>

                <th className="px-4 py-2 border">
                  Kategori
                </th>

                <th className="px-4 py-2 border">
                  Satuan
                </th>

                <th className="px-4 py-2 border text-center">
                  Masuk
                </th>

                <th className="px-4 py-2 border text-center">
                  Keluar
                </th>

                <th className="px-4 py-2 border text-center">
                  Stok Akhir
                </th>

              </tr>

            </thead>

            <tbody>

              {barang.data && barang.data.length > 0 ? (

                barang.data.map((item, index) => (

                  <tr key={item.id}>

                    <td className="px-4 py-2 border text-center">
                      {barang.from + index}
                    </td>

                    <td className="px-4 py-2 border">
                      {item.kode_barang}
                    </td>

                    <td className="px-4 py-2 border">
                      {item.nama_barang}
                    </td>

                    <td className="px-4 py-2 border">
                      {item.kategori}
                    </td>

                    <td className="px-4 py-2 border">
                      {item.satuan}
                    </td>

                    <td className="px-4 py-2 border text-center">
                      {item.masuk}
                    </td>

                    <td className="px-4 py-2 border text-center">
                      {item.keluar}
                    </td>

                    <td className="px-4 py-2 border text-center font-semibold">

                      {item.stok <= 0 ? (
                        <span className="text-red-600">
                          {item.stok}
                        </span>
                      ) : item.stok <= stokLimit ? (
                        <span className="text-yellow-500">
                          {item.stok}
                        </span>

                      ) : (

                        <span className="text-green-600">
                          {item.stok}
                        </span>

                      )}

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="8"
                    className="text-center py-4 text-gray-500"
                  >
                    Data stok belum tersedia
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

        <Pagination links={barang.links} />

      </div>

    </AdminLayout>
  );
}