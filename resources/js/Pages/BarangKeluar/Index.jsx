import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";

export default function Index({ barangKeluar }) {
  const [search, setSearch] = useState("");

  const filteredData = barangKeluar.filter(
    (item) =>
      (item.barang?.nama_barang || "").toLowerCase().includes(search.toLowerCase()) ||
      (item.barang?.kategori?.nama_kategori || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout
      header="Barang Keluar"
    >

      <div className="flex justify-between mb-4">

        <h2 className="text-xl font-semibold">
          Data Barang Keluar
        </h2>

        <Link
          href={route("barang-keluar.create")}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Input Barang Keluar
        </Link>

      </div>

      {/* SEARCH */}
      <div className="mb-4 bg-white p-4 rounded shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <input
            type="text"
            placeholder="Cari nama barang atau kategori..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/3 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
        />
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">

        <table className="min-w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="px-4 py-2">No</th>
              <th className="px-4 py-2">Barang</th>
              <th className="px-4 py-2">Kategori</th>
              <th className="px-4 py-2">Satuan</th>
              <th className="px-4 py-2">Tanggal</th>
              <th className="px-4 py-2">Jumlah</th>
              <th className="px-4 py-2">Dokumen</th>
              <th className="px-4 py-2">Aksi</th>

            </tr>

          </thead>

          <tbody>

            {filteredData.map((item, index) => (

              <tr key={item.id} className="border-t">

                <td className="px-4 py-2">
                  {index + 1}
                </td>

                <td className="px-4 py-2">
                  {item.barang?.nama_barang}
                </td>

                <td className="px-4 py-2">
                  {item.barang?.kategori?.nama_kategori || "-"}
                </td>

                <td className="px-4 py-2">
                  {item.barang?.satuan?.nama || "-"}
                </td>

                <td className="px-4 py-2">
                  {item.tanggal_keluar}
                </td>

                <td className="px-4 py-2">
                  {item.jumlah}
                </td>

                <td className="px-4 py-2">

                  {item.dokumen && (

                    <a
                      href={`/storage/${item.dokumen}`}
                      target="_blank"
                      className="text-blue-600 underline"
                    >
                      Lihat
                    </a>

                  )}

                </td>

                <td className="px-4 py-2">

                  <Link
                    href={route(
                      "barang-keluar.destroy",
                      item.id
                    )}
                    method="delete"
                    as="button"
                    className="bg-red-600 text-white px-2 py-1 rounded"
                  >
                    Hapus
                  </Link>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </AdminLayout>
  );

}