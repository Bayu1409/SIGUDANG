import React from "react";
import { Link } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";

export default function Index({ barangMasuk }) {

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

      <div className="bg-white rounded shadow overflow-x-auto">

        <table className="min-w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="px-4 py-2">
                No
              </th>

              <th className="px-4 py-2">
                Barang
              </th>

              <th className="px-4 py-2">
                Kategori
              </th>

              <th className="px-4 py-2">
                Satuan
              </th>

              <th className="px-4 py-2">
                Tanggal
              </th>

              <th className="px-4 py-2">
                Jumlah
              </th>

              <th className="px-4 py-2">
                Dokumen
              </th>

              <th className="px-4 py-2">
                Aksi
              </th>

            </tr>

          </thead>

          <tbody>

            {barangMasuk.map((item, index) => (

              <tr
                key={item.id}
                className="border-t"
              >

                <td className="px-4 py-2">
                  {index + 1}
                </td>

                {/* NAMA BARANG */}

                <td className="px-4 py-2">
                  {item.barang?.nama_barang}
                </td>

                {/* KATEGORI */}

                <td className="px-4 py-2">
                  {item.barang?.kategori?.nama_kategori || "-"}
                </td>

                {/* SATUAN */}

                <td className="px-4 py-2">
  {item.barang?.satuan?.nama || "-"}
</td>

                {/* TANGGAL */}

                <td className="px-4 py-2">
                  {item.tanggal_masuk}
                </td>

                {/* JUMLAH */}

                <td className="px-4 py-2">
                  {item.jumlah}
                </td>

                {/* DOKUMEN */}

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

                {/* AKSI */}

                <td className="px-4 py-2 flex gap-2">

                  <Link
                    href={route(
                      "barang-masuk.edit",
                      item.id
                    )}
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                  >
                    Edit
                  </Link>

                  <Link
                    href={route(
                      "barang-masuk.destroy",
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