import React from "react";
import { useForm, Link } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";

const Label = ({ children, required }) => (
  <label className="block text-sm font-medium text-gray-700 mb-1">
    {children}
    {required && <span className="text-red-500 ml-1">*</span>}
  </label>
);

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
        <h2 className="text-xl font-semibold">Edit Satuan</h2>
      }
    >

      <div className="bg-white p-6 rounded shadow max-w-lg">
        <p className="text-sm text-gray-500 mb-4">
          Kolom bertanda <span className="text-red-500 font-bold">*</span> wajib diisi.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* NAMA SATUAN */}
          <div>
            <Label required>Nama Satuan</Label>
            <input
              type="text"
              className={`w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.nama ? "border-red-500" : ""}`}
              value={data.nama}
              onChange={(e) => setData("nama", e.target.value)}
              placeholder="Contoh: Unit, Pcs, Kg"
            />
            {errors.nama && (
              <p className="text-red-500 text-xs mt-1">{errors.nama}</p>
            )}
          </div>

          {/* BUTTON */}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={processing}
              className="bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-white px-5 py-2 rounded font-medium transition"
            >
              {processing ? "Menyimpan..." : "Update"}
            </button>
            <Link
              href={route("satuan.index")}
              className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded font-medium transition"
            >
              Kembali
            </Link>
          </div>

        </form>

      </div>

    </AdminLayout>
  );
}