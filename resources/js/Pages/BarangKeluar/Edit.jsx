import React from "react";
import { useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";

export default function Edit({
  barangKeluar,
  barang
}) {

  const { data, setData, put, errors } =
    useForm({

      barang_id:
        barangKeluar.barang_id,

      tanggal_keluar:
        barangKeluar.tanggal_keluar,

      jumlah:
        barangKeluar.jumlah

    });

  function submit(e) {

    e.preventDefault();

    put(
      route(
        "barang-keluar.update",
        barangKeluar.id
      )
    );

  }

  return (
    <AdminLayout
      header="Edit Barang Keluar"
    >

      <div className="max-w-xl">

        <form
          onSubmit={submit}
          className="bg-white p-6 rounded shadow space-y-4"
        >

          {/* BARANG */}

          <div>

            <label className="block mb-1">
              Barang
            </label>

            <select
              value={data.barang_id}
              onChange={e =>
                setData(
                  "barang_id",
                  e.target.value
                )
              }
              className="w-full border p-2 rounded"
            >

              {barang.map(item => (

                <option
                  key={item.id}
                  value={item.id}
                >
                  {item.nama_barang}
                </option>

              ))}

            </select>

          </div>

          {/* TANGGAL */}

          <div>

            <label className="block mb-1">
              Tanggal Keluar
            </label>

            <input
              type="date"
              value={data.tanggal_keluar}
              onChange={e =>
                setData(
                  "tanggal_keluar",
                  e.target.value
                )
              }
              className="w-full border p-2 rounded"
            />

          </div>

          {/* JUMLAH */}

          <div>

            <label className="block mb-1">
              Jumlah
            </label>

            <input
              type="number"
              value={data.jumlah}
              onChange={e =>
                setData(
                  "jumlah",
                  e.target.value
                )
              }
              className="w-full border p-2 rounded"
            />

            {errors.jumlah && (

              <div className="text-red-600 text-sm">
                {errors.jumlah}
              </div>

            )}

          </div>

          {/* BUTTON */}

          <button
            type="submit"
            className="bg-yellow-500 text-white px-4 py-2 rounded"
          >
            Update
          </button>

        </form>

      </div>

    </AdminLayout>
  );

}