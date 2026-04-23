
import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";

export default function Index({ barang }) {
    const [search, setSearch] = useState("");

    const filteredBarang = barang.filter(
        (item) =>
            item.nama_barang.toLowerCase().includes(search.toLowerCase()) ||
            item.kode_barang.toLowerCase().includes(search.toLowerCase()) ||
            (item.kategori || "").toLowerCase().includes(search.toLowerCase())
    );

  return (
    <AdminLayout
      header={
        <h2 className="text-xl font-semibold">
          Monitoring Stok Barang
        </h2>
      }
    >

      <div className="bg-white p-6 rounded shadow">

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

              {filteredBarang.length > 0 ? (

                filteredBarang.map((item, index) => (

                  <tr key={item.id}>

                    <td className="px-4 py-2 border text-center">
                      {index + 1}
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

                      ) : item.stok <= 10 ? (

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

      </div>

    </AdminLayout>
  );
}