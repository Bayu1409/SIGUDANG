import React from "react";
import { useForm, Link } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";

const Label = ({ children, required }) => (
  <label className="block text-sm font-medium text-gray-700 mb-1">
    {children}
    {required && <span className="text-red-500 ml-1">*</span>}
  </label>
);

export default function Create() {

    const { data, setData, post, processing, errors } = useForm({
        nama: "",
        nilai_konversi_default: 1,
    });

    function handleSubmit(e) {
        e.preventDefault();
        post(route("satuan.store"));
    }

    return (
        <AdminLayout
            header={
                <h2 className="text-xl font-semibold">Tambah Satuan</h2>
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

                    {/* NILAI KONVERSI DEFAULT */}
                    <div>
                        <Label required>Nilai Konversi Standar (Unit)</Label>
                        <input
                            type="number"
                            className={`w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.nilai_konversi_default ? "border-red-500" : ""}`}
                            value={data.nilai_konversi_default}
                            onChange={(e) => setData("nilai_konversi_default", e.target.value)}
                            placeholder="Contoh: 12 untuk Lusin, 100 untuk Pack"
                        />
                        <p className="text-[10px] text-gray-500 mt-1 italic">
                            Masukkan jumlah unit terkecil dalam 1 {data.nama || 'satuan'} ini.
                        </p>
                        {errors.nilai_konversi_default && (
                            <p className="text-red-500 text-xs mt-1">{errors.nilai_konversi_default}</p>
                        )}
                    </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={processing}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2 rounded font-medium transition"
            >
              {processing ? "Menyimpan..." : "Simpan"}
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