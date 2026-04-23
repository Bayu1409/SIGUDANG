import React, { useState, useEffect } from "react";
import { Link, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import Pagination from "@/Components/Pagination";
import ConfirmationModal from "@/Components/ConfirmationModal";

export default function Index({ satuan, filters = {} }) {
    const [search, setSearch] = useState(filters.search || "");
    const [confirmDelete, setConfirmDelete] = useState({ show: false, id: null });

    const isInitialRender = React.useRef(true);
    
    useEffect(() => {
        if (isInitialRender.current) {
            isInitialRender.current = false;
            return;
        }

        const delay = setTimeout(() => {
            router.get(
                route("satuan.index"),
                { search },
                { preserveState: true, replace: true, preserveScroll: true }
            );
        }, 300);
        return () => clearTimeout(delay);
    }, [search]);

    const handleDelete = () => {
        if (confirmDelete.id) {
            router.delete(route("satuan.destroy", confirmDelete.id), {
                onSuccess: () => setConfirmDelete({ show: false, id: null }),
            });
        }
    };

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

      {/* SEARCH */}
      <div className="mb-4 bg-white p-4 rounded shadow">
          <input
              type="text"
              placeholder="Cari satuan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-1/3 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
      </div>

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

      {satuan.data && satuan.data.map((item, index) => (

      <tr key={item.id} className="border-t hover:bg-gray-50">

      <td className="border px-4 py-2 text-center">
        {satuan.from + index}
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

        <button
          onClick={() => setConfirmDelete({ show: true, id: item.id })}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
        >
          Hapus
        </button>

      </td>

      </tr>

      ))}

      </tbody>

        </table>

      </div>

      <Pagination links={satuan.links} />
      <ConfirmationModal
        show={confirmDelete.show}
        onClose={() => setConfirmDelete({ show: false, id: null })}
        onConfirm={handleDelete}
        title="Hapus Satuan"
        message="Apakah Anda yakin ingin menghapus satuan ini? Data yang sudah menggunakan satuan ini mungkin akan terpengaruh."
        type="danger"
        confirmText="Hapus Sekarang"
      />
    </AdminLayout>
  );
}