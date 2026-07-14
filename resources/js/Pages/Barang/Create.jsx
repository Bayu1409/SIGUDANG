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
    const [previewUrl, setPreviewUrl] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        nama_barang: "",
        kategori_id: "",
        satuan_id: "",
        stok: "",
        batas_minimum: 0,
        nilai_konversi: 1,
        foto: null,
    });

    const handleSatuanChange = (e) => {
        const sid = e.target.value;
        const selectedSatuan = satuans.find(s => s.id == sid);
        setData(prev => {
            let nextKonversi = prev.nilai_konversi;
            if (selectedSatuan) {
                // Gunakan nilai default dari database satuan
                nextKonversi = selectedSatuan.nilai_konversi_default || 1;
            }
            return { ...prev, satuan_id: sid, nilai_konversi: nextKonversi };
        });
    };

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
                                onChange={handleSatuanChange}
                            >
                                <option value="">-- Pilih Satuan --</option>
                                {satuans.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.nama}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {/* harga */}
                        <div>
                            <Label required>Harga</Label>
                            <input
                                type="text"
                                className={`w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.nama_barang ? "border-red-500" : ""}`}
                                value={data.harga}
                                onChange={(e) => setData("harga", e.target.value)}
                                placeholder="Contoh: 20.000"
                            />
                            {errors.harga && (
                                <p className="text-red-500 text-xs mt-1">{errors.harga}</p>
                            )}
                        </div>

                        {/* Batas Minimum & Konversi */}
                        <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
                            <div>
                                <Label>Batas Minimum</Label>
                                <input
                                    type="number"
                                    className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400"
                                    value={data.batas_minimum}
                                    onChange={(e) => setData("batas_minimum", e.target.value)}
                                    placeholder="Contoh: 1"
                                />
                                <p className="text-[10px] text-gray-500 mt-1 italic">
                                    Misal: Minimal 1 Pack
                                </p>
                            </div>
                            <div>
                                <Label>Nilai Konversi</Label>
                                <input
                                    type="number"
                                    className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400"
                                    value={data.nilai_konversi}
                                    onChange={(e) => setData("nilai_konversi", e.target.value)}
                                    placeholder="Contoh: 100"
                                />
                                <p className="text-[10px] text-gray-500 mt-1 italic">
                                    Otomatis: Pack=100, Kodi=20
                                </p>
                            </div>
                        </div>

                        {/* Foto Barang */}
                        <div>
                            <Label>Foto Barang</Label>
                            <input
                                type="file"
                                accept="image/*"
                                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    setData("foto", file);
                                    if (file) {
                                        setPreviewUrl(URL.createObjectURL(file));
                                    } else {
                                        setPreviewUrl(null);
                                    }
                                }}
                            />
                            {previewUrl && (
                                <div className="mt-2 w-32 h-32 border rounded overflow-hidden">
                                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                            )}
                            {errors.foto && (
                                <p className="text-red-500 text-xs mt-1">{errors.foto}</p>
                            )}
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