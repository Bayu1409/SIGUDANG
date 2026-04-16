import React from "react";
import { useForm, Link } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";

export default function Create({ kategoris = [], satuans = [] }) {

  const { data, setData, post, processing, errors }
    = useForm({

      nama_barang: "",
      kategori_id: "",
      satuan_id: "",
      stok: "",

    });

  function handleSubmit(e) {

    e.preventDefault();

    post(route("barang.store"));

  }

  return (

    <AdminLayout>

      <div className="p-6">

        {/* HEADER */}

        <div className="mb-6">

          <h2 className="text-2xl font-semibold mt-2">
            Tambah Barang
          </h2>

        </div>

        {/* CARD */}

        <div className="bg-white p-6 rounded shadow max-w-lg">

          <form onSubmit={handleSubmit}>

            {/* Nama */}

            <div className="mb-4">

              <label className="block mb-1">
                Nama Barang
              </label>

              <input
                type="text"
                className="w-full border p-2 rounded"
                value={data.nama_barang}
                onChange={(e) =>
                  setData("nama_barang", e.target.value)
                }
              />

            </div>

            {/* Kategori */}

            <div className="mb-4">

              <label className="block mb-1">
                Kategori
              </label>

              <select
                className="w-full border p-2 rounded"
                value={data.kategori_id}
                onChange={(e) =>
                  setData("kategori_id", e.target.value)
                }
              >

                <option value="">
                  -- Pilih Kategori --
                </option>

                {kategoris.map((item) => (

                  <option
                    key={item.id}
                    value={item.id}
                  >
                    {item.nama_kategori}
                  </option>

                ))}

              </select>

            </div>

            {/* Satuan */}

            <div className="mb-4">

              <label className="block mb-1">
                Satuan
              </label>

              <select
                className="w-full border p-2 rounded"
                value={data.satuan_id}
                onChange={(e) =>
                  setData("satuan_id", e.target.value)
                }
              >

                <option value="">
                  Pilih Satuan
                </option>

                {satuans.map((item) => (

                  <option
                    key={item.id}
                    value={item.id}
                  >
                    {item.nama}
                  </option>

                ))}

              </select>

            </div>

            <div className="flex gap-2 mt-4">
            
             <button
                type="submit"
             className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
             Simpan
            </button>
            
           <Link
             href="/kategori-barang"
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
              Kembali
          </Link>
            
            </div>
          </form>

        </div>

      </div>

    </AdminLayout>

  );

}