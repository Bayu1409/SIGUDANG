import { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { router, Link } from "@inertiajs/react";

// Komponen label dengan tanda wajib
const Label = ({ children, required }) => (
  <label className="block text-sm font-medium text-gray-700 mb-1">
    {children}
    {required && <span className="text-red-500 ml-1">*</span>}
  </label>
);

export default function Edit({ barangMasuk, barang, suppliers }) {

    const [values, setValues] = useState({
        barang_id:     barangMasuk.barang_id,
        supplier_id:   barangMasuk.supplier_id ?? "",
        tanggal_masuk: barangMasuk.tanggal_masuk,
        jumlah:        barangMasuk.jumlah,
    });

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        router.put(route("barang-masuk.update", barangMasuk.id), values);
    };

    // Preview stok akhir
    const selectedBarang  = barang.find((item) => String(item.id) === String(values.barang_id));
    const stokSaatIni     = selectedBarang ? Number(selectedBarang.stok) : null;
    // Saat edit: stok saat ini sudah termasuk jumlah lama, jadi kita hitung dari stok - jumlah lama + jumlah baru
    const jumlahLama      = Number(barangMasuk.jumlah) || 0;
    const jumlahBaru      = Number(values.jumlah) || 0;
    const stokAkhir       = stokSaatIni !== null ? stokSaatIni - jumlahLama + jumlahBaru : null;

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Edit Barang Masuk</h2>

            <p className="text-sm text-gray-500 mb-4">
                Kolom bertanda <span className="text-red-500 font-bold">*</span> wajib diisi.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow max-w-lg">

                {/* Barang */}
                <div>
                    <Label required>Barang</Label>
                    <select
                        name="barang_id"
                        className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={values.barang_id}
                        onChange={handleChange}
                    >
                        {barang.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.nama_barang} (Stok: {item.stok})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Supplier */}
                <div>
                    <Label>Supplier (Asal Barang)</Label>
                    <select
                        name="supplier_id"
                        className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={values.supplier_id}
                        onChange={handleChange}
                    >
                        <option value="">-- Pilih Supplier (Opsional) --</option>
                        {suppliers.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.nama_supplier}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Tanggal */}
                <div>
                    <Label required>Tanggal Masuk</Label>
                    <input
                        type="date"
                        name="tanggal_masuk"
                        className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={values.tanggal_masuk}
                        onChange={handleChange}
                    />
                </div>

                {/* Jumlah */}
                <div>
                    <Label required>Jumlah</Label>
                    <input
                        type="number"
                        name="jumlah"
                        min="1"
                        className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={values.jumlah}
                        onChange={handleChange}
                    />
                </div>

                {/* Preview Stok Akhir */}
                {stokSaatIni !== null && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                        <p className="text-sm font-semibold text-blue-700">Preview Stok</p>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Stok Saat Ini</span>
                            <span className="font-medium text-gray-800">{stokSaatIni}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Jumlah Lama (dikurangi)</span>
                            <span className="font-medium text-red-500">- {jumlahLama}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Jumlah Baru (ditambah)</span>
                            <span className="font-medium text-green-600">+ {jumlahBaru}</span>
                        </div>
                        <div className="border-t border-blue-200 pt-2 flex items-center justify-between">
                            <span className="text-sm font-bold text-blue-700">Stok Akhir</span>
                            <span className={`text-lg font-bold ${stokAkhir < 0 ? "text-red-600" : "text-blue-700"}`}>
                                {stokAkhir}
                            </span>
                        </div>
                    </div>
                )}

                {/* Buttons */}
                <div className="flex gap-2 pt-2">
                    <button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded font-medium transition"
                    >
                        Update
                    </button>
                    <Link
                        href={route("barang-masuk.index")}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded font-medium transition"
                    >
                        Kembali
                    </Link>
                </div>

            </form>
        </div>
    );
}

/* 🔥 WAJIB */
Edit.layout = page => <AdminLayout children={page} />;