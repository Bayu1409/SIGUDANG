import React from "react";
import { useForm, Link } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";

export default function Create() {

  const { data, setData, post, processing, errors } = useForm({
    nama: "", // ✅ harus 'nama'
  });

  function handleSubmit(e) {
    e.preventDefault();

    post(route("satuan.store"));
  }

  return (
    <AdminLayout
      header={
        <h2 className="text-xl font-semibold">
          Tambah Satuan
        </h2>
      }
    >

      <div className="bg-white p-6 rounded shadow max-w-lg">

        <form onSubmit={handleSubmit}>

          {/* NAMA SATUAN */}

          <div className="mb-4">

            <label className="block mb-1">
              Nama Satuan
            </label>

            <input
              type="text"
              className="w-full border rounded p-2"
              value={data.nama}
              onChange={(e) =>
                setData("nama", e.target.value)
              }
              placeholder="Contoh: Unit, Pcs, Kg"
            />

            {errors.nama && (
              <div className="text-red-500 text-sm">
                {errors.nama}
              </div>
            )}

          </div>

          {/* BUTTON */}

          <div className="flex gap-2">

            <button
              type="submit"
              disabled={processing}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Simpan
            </button>

            <Link
              href={route("satuan.index")}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Kembali
            </Link>

          </div>

        </form>

      </div>

    </AdminLayout>
  );
}