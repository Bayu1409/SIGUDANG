import React from "react";
import { useForm, Link } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";

export default function Edit({ satuan }) {

  const { data, setData, put, processing, errors } = useForm({
    nama: satuan.nama,
  });

  function handleSubmit(e) {
    e.preventDefault();

    put(route("satuan.update", satuan.id));
  }

  return (
    <AdminLayout
      header={
        <h2 className="text-xl font-semibold">
          Edit Satuan
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
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
            >
              Update
            </button>

            <Link
              href={route("satuan.index")}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Kembali
            </Link>

          </div>

        </form>

      </div>

    </AdminLayout>
  );
}