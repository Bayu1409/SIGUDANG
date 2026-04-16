import React from "react";
import { useForm, Link } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";

export default function Create({ barang }) {

  const { data, setData, post, processing, errors } = useForm({

    barang_id: "",
    tanggal_masuk: "",
    jumlah: "",
    dokumen: null,

  });

  function handleSubmit(e) {

    e.preventDefault();

    post(route("barang-masuk.store"));

  }

  return (

    <div>

      <h1 className="text-xl font-bold mb-4">
        Tambah Barang Masuk
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Barang */}

        <div>

          <label className="block mb-1">
            Barang
          </label>

          <select
            className="w-full border p-2 rounded"
            value={data.barang_id}
            onChange={(e) =>
              setData("barang_id", e.target.value)
            }
          >

            <option value="">
              Pilih Barang
            </option>

            {barang.map((item) => (

              <option
                key={item.id}
                value={item.id}
              >

                {item.nama_barang}

              </option>

            ))}

          </select>

          {errors.barang_id && (
            <div className="text-red-500 text-sm">
              {errors.barang_id}
            </div>
          )}

        </div>

        {/* Tanggal */}

        <div>

          <label className="block mb-1">
            Tanggal
          </label>

          <input
            type="date"
            className="w-full border p-2 rounded"
            value={data.tanggal_masuk}
            onChange={(e) =>
              setData("tanggal_masuk", e.target.value)
            }
          />

        </div>

        {/* Jumlah */}

        <div>

          <label className="block mb-1">
            Jumlah
          </label>

          <input
            type="number"
            className="w-full border p-2 rounded"
            value={data.jumlah}
            onChange={(e) =>
              setData("jumlah", e.target.value)
            }
          />

        </div>

        {/* Dokumen */}

        <div>

          <label className="block mb-1">
            Upload Dokumen
          </label>

          <input
            type="file"
            onChange={(e) =>
              setData("dokumen", e.target.files[0])
            }
          />

        </div>

        {/* Button */}

        <div className="flex gap-2">

          <button
            type="submit"
            disabled={processing}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >

            Simpan

          </button>

          <Link
            href={route("barang-masuk.index")}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >

            Kembali

          </Link>

        </div>

      </form>

    </div>

  );

}

/* 🔥 WAJIB */
Create.layout = page => <AdminLayout children={page} />;