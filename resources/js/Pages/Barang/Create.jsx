import React, { useState } from "react";
import { useForm, Link } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import ConfirmationModal from "@/Components/ConfirmationModal";

const Label = ({ children, required }) => (
  <label className="block text-sm font-medium text-gray-700 mb-1">
    {children}
    {required && <span className="text-red-500 ml-1">*</span>}
  </label>
);

export default function Create({ kategoris = [], satuans = [] }) {
  const [showConfirm, setShowConfirm] = useState(false);

  const { data, setData, post, processing, errors } = useForm({
    nama_barang: "",
    kategori_id: "",
    satuan_id: "",
    stok: "",
  });

  function handleSubmit(e) {
    if (e) e.preventDefault();
    post(route("barang.store"));
  }

  const triggerConfirm = (e) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  return (
    <AdminLayout>
      <div className="">

        <div className="mb-6">
          <h2 className="text-2xl font-semibold mt-2">Tambah Barang</h2>
          <p className="text-sm text-gray-500 mt-1">
            Kolom bertanda <span className="text-red-500 font-bold">*</span> wajib diisi.
          </p>
        </div>

        <div className="bg-white p-6 rounded shadow max-w-lg">
          <form onSubmit={triggerConfirm} className="space-y-4">

            {/* Nama */}
            <div>
              <Label required>Nama Barang</Label>
              <input
                type="text"
                className={`w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.nama_barang ? "border-red-500" : ""}`}
                value={data.nama_barang}
                onChange={(e) => setData("nama_barang", e.target.value)}
                placeholder="Contoh: Alat Pramuka"
              />
              {errors.nama_barang && (
                <p className="text-red-500 text-xs mt-1">{errors.nama_barang}</p>
              )}
            </div>

            {/* Kategori */}
            <div>
              <Label>Kategori</Label>
              <select
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={data.kategori_id}
                onChange={(e) => setData("kategori_id", e.target.value)}
              >
                <option value="">-- Pilih Kategori --</option>
                {kategoris.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nama_kategori}
                  </option>
                ))}
              </select>
            </div>

            {/* Satuan */}
            <div>
              <Label>Satuan</Label>
              <select
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={data.satuan_id}
                onChange={(e) => setData("satuan_id", e.target.value)}
              >
                <option value="">-- Pilih Satuan --</option>
                {satuans.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nama}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                type="submit"
                disabled={processing}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2 rounded font-medium transition"
              >
                {processing ? "Menyimpan..." : "Simpan"}
              </button>
              <Link
                href="/barang"
                className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded font-medium transition"
              >
                Kembali
              </Link>
            </div>

          </form>
        </div>

      </div>
      <ConfirmationModal
        show={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => {
            setShowConfirm(false);
            handleSubmit();
        }}
        title="Konfirmasi Simpan"
        message="Apakah Anda yakin ingin menyimpan data barang baru ini?"
        type="success"
        confirmText="Ya, Simpan"
      />
    </AdminLayout>
  );
}