import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";

export default function Index({ barang }) {

  return (
    <AdminLayout
      header={
        <h2 className="text-xl font-semibold">
          Monitoring Dead Stock
        </h2>
      }
    >

      <div className="bg-white p-6 rounded shadow">

        {/* JUDUL */}

        <h1 className="text-lg font-bold mb-4">

          Barang Tidak Bergerak {">"} 30 Hari

        </h1>

        {/* TABEL */}

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

                <th className="px-4 py-2 border text-center">
                  Stok
                </th>

                <th className="px-4 py-2 border text-center">
                  Hari Tidak Keluar
                </th>

                <th className="px-4 py-2 border text-center">
                  Status
                </th>

              </tr>

            </thead>

            <tbody>

              {barang.length > 0 ? (

                barang.map((item, index) => (

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

                    {/* STOK */}

                    <td className="px-4 py-2 border text-center font-semibold">

                      {item.stok <= 5 ? (

                        <span className="text-red-600">
                          {item.stok}
                        </span>

                      ) : (

                        <span className="text-yellow-600">
                          {item.stok}
                        </span>

                      )}

                    </td>

                    {/* HARI */}

                    <td className="px-4 py-2 border text-center text-red-600 font-semibold">

                      {item.hari} Hari

                    </td>

                    {/* STATUS */}

                    <td className="px-4 py-2 border text-center">

                      <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm">

                        ⚠️ Dead Stock

                      </span>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="7"
                    className="text-center py-4 text-gray-500"
                  >

                    Tidak ada dead stock

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