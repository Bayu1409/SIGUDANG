import React from "react";
import { Link } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";

export default function Index({ satuan }) {

  return (
    <AdminLayout
      header={
        <div className="flex justify-between">

          <h2 className="text-xl font-semibold">
            Management Satuan
          </h2>

          <Link
            href={route("satuan.create")}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Tambah Satuan
          </Link>

        </div>
      }
    >

      <div className="bg-white rounded shadow">

        <table className="min-w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="px-4 py-2">No</th>
              <th className="px-4 py-2">Nama Satuan</th>
              <th className="px-4 py-2">Aksi</th>

            </tr>

          </thead>
      <tbody>

      {satuan.map((item, index) => (

      <tr key={item.id}>

      <td className="border px-4 py-2 text-center">
        {index + 1}
      </td>

      <td className="border px-4 py-2">
        {item.nama}
      </td>

      <td className="border px-4 py-2 space-x-2">

        {/* BUTTON EDIT */}

        <Link
          href={route("satuan.edit", item.id)}
          className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded text-sm"
        >
          Edit
        </Link>

        {/* BUTTON HAPUS */}

        <Link
          href={route("satuan.destroy", item.id)}
          method="delete"
          as="button"
          onBefore={() => confirm("Yakin ingin menghapus data?")}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
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