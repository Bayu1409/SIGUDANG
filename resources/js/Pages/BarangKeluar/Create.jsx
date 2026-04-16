import React from "react";
import { useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";

export default function Create({ barang }) {

  const { data, setData, post, errors } =
    useForm({

      barang_id: "",
      tanggal_keluar: "",
      jumlah: "",
      dokumen: null

    });

  function submit(e) {

    e.preventDefault();

    post(route("barang-keluar.store"));

  }

  return (
    <AdminLayout
      header="Tambah Barang Keluar"
    >

      <form
        onSubmit={submit}
        className="bg-white p-6 rounded shadow space-y-4"
      >

        {/* BARANG */}

        <div>

          <label>Barang</label>

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

            <option value="">
              Pilih Barang
            </option>

            {barang.map(item => (

              <option
                key={item.id}
                value={item.id}
              >
                {item.nama_barang}
              </option>

            ))}

          </select>

          {errors.barang_id &&
            <div className="text-red-600">
              {errors.barang_id}
            </div>
          }

        </div>

        {/* TANGGAL */}

        <div>

          <label>Tanggal Keluar</label>

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

          <label>Jumlah</label>

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

          {errors.jumlah &&
            <div className="text-red-600">
              {errors.jumlah}
            </div>
          }

        </div>

        {/* DOKUMEN */}

        <div>

          <label>Dokumen</label>

          <input
            type="file"
            onChange={e =>
              setData(
                "dokumen",
                e.target.files[0]
              )
            }
            className="w-full border p-2 rounded"
          />

        </div>

        <button
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Simpan
        </button>

      </form>

    </AdminLayout>
  );

}