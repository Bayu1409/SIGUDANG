import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";

export default function Index({ barangMasuk }) {
  const [search, setSearch] = useState("");

  const filteredData = barangMasuk.filter(
    (item) =>
      (item.barang?.nama_barang || "").toLowerCase().includes(search.toLowerCase()) ||
      (item.barang?.kategori?.nama_kategori || "").toLowerCase().includes(search.toLowerCase()) ||
      (item.supplier?.nama_supplier || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout
      header={
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            Barang Masuk
          </h2>

          <Link
            href={route("barang-masuk.create")}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Input Barang Masuk
          </Link>
        </div>
      }
    >

      {/* SEARCH */}
      <div className="mb-4 bg-white p-4 rounded shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <input
            type="text"
            placeholder="Cari nama barang, kategori, atau supplier..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/3 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
        />
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">

        <table className="min-w-full">

          <thead className="bg-gray-100">
            <tr>

              <th className="px-4 py-2 text-left">No</th>
              <th className="px-4 py-2 text-left">Barang</th>
              <th className="px-4 py-2 text-left">Kategori</th>
              <th className="px-4 py-2 text-left">Satuan</th>
              <th className="px-4 py-2 text-left">Supplier</th>
              <th className="px-4 py-2 text-left">Tanggal</th>
              <th className="px-4 py-2 text-left">Jumlah</th>
              <th className="px-4 py-2 text-left">Dokumen</th>
              <th className="px-4 py-2 text-left">Aksi</th>

            </tr>
          </thead>

          <tbody>
            {filteredData.map((item, index) => (
              <tr key={item.id} className="border-t hover:bg-gray-50">

                <td className="px-4 py-2">{index + 1}</td>

                {/* NAMA BARANG */}
                <td className="px-4 py-2">{item.barang?.nama_barang}</td>

                {/* KATEGORI */}
                <td className="px-4 py-2">
                  {item.barang?.kategori?.nama_kategori || "-"}
                </td>

                {/* SATUAN */}
                <td className="px-4 py-2">
                  {item.barang?.satuan?.nama || "-"}
                </td>

                {/* SUPPLIER */}
                <td className="px-4 py-2">
                  {item.supplier?.nama_supplier || "-"}
                </td>

                {/* TANGGAL */}
                <td className="px-4 py-2">{item.tanggal_masuk}</td>

                {/* JUMLAH */}
                <td className="px-4 py-2">{item.jumlah}</td>

                {/* DOKUMEN */}
                <td className="px-4 py-2">
                  {item.dokumen ? (
                    <a
                      href={`/storage/${item.dokumen}`}
                      target="_blank"
                      className="text-blue-600 underline"
                    >
                      Lihat
                    </a>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>

                {/* AKSI */}
                <td className="px-4 py-2 flex gap-2">
                  <Link
                    href={route("barang-masuk.edit", item.id)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                  >
                    Edit
                  </Link>

                  <Link
                    href={route("barang-masuk.destroy", item.id)}
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