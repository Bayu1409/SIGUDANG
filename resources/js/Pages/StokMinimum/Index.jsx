import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";

export default function Index({
  barang,
  stokMinimum,
  statusBulan
}) {

  return (
    <AdminLayout
      header={
        <h2 className="text-xl font-semibold">
          Monitoring Stok Minimum
        </h2>
      }
    >

      <div className="bg-white p-6 rounded shadow">

        {/* INFO BULAN */}

        <div className="mb-4">

          <div className="text-lg font-semibold">

            Status Bulan:
            <span className="ml-2 text-blue-600">
              {statusBulan}
            </span>

          </div>

          <div className="text-sm text-gray-500">

            Batas Stok Minimum:
            <span className="font-semibold ml-1">
              {stokMinimum}
            </span>

          </div>

        </div>

        {/* TABEL */}

        <div className="overflow-x-auto">

          <table className="min-w-full border">

            <thead className="bg-gray-100">

              <tr>

                <th className="px-4 py-2 border">
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
                  Stok
                </th>

                <th className="px-4 py-2 border">
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

                    <td className="px-4 py-2 border text-center text-red-600 font-semibold">
                      {item.stok}
                    </td>

                    <td className="px-4 py-2 border text-center">

                      <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm">

                        ⚠️ Stok Minimum

                      </span>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="6"
                    className="text-center py-4 text-gray-500"
                  >

                    Tidak ada stok minimum

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