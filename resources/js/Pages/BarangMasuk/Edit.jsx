import { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { router, Link } from "@inertiajs/react";

export default function Edit({ barangMasuk, barang, suppliers }) {

    const [values, setValues] = useState({
        barang_id:     barangMasuk.barang_id,
        supplier_id:   barangMasuk.supplier_id ?? "",
        tanggal_masuk: barangMasuk.tanggal_masuk,
        jumlah:        barangMasuk.jumlah
    });

    const handleChange = (e) => {
        setValues({
            ...values,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        router.put(
            route("barang-masuk.update", barangMasuk.id),
            values
        );
    };

    return (

        <div>

            <h2 className="text-xl font-bold mb-4">
                Edit Barang Masuk
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">

                {/* Barang */}
                <div className="mb-3">
                    <label className="block mb-1">Barang</label>
                    <select
                        name="barang_id"
                        className="w-full border p-2 rounded"
                        value={values.barang_id}
                        onChange={handleChange}
                    >
                        {barang.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.nama_barang}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Supplier */}
                <div className="mb-3">
                    <label className="block mb-1">Supplier (Asal Barang)</label>
                    <select
                        name="supplier_id"
                        className="w-full border p-2 rounded"
                        value={values.supplier_id}
                        onChange={handleChange}
                    >
                        <option value="">Pilih Supplier</option>
                        {suppliers.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.nama_supplier}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Tanggal */}
                <div className="mb-3">
                    <label className="block mb-1">Tanggal</label>
                    <input
                        type="date"
                        name="tanggal_masuk"
                        className="w-full border p-2 rounded"
                        value={values.tanggal_masuk}
                        onChange={handleChange}
                    />
                </div>

                {/* Jumlah */}
                <div className="mb-3">
                    <label className="block mb-1">Jumlah</label>
                    <input
                        type="number"
                        name="jumlah"
                        className="w-full border p-2 rounded"
                        value={values.jumlah}
                        onChange={handleChange}
                    />
                </div>

                <div className="flex gap-2">
                    <button
                        type="submit"
                        className="bg-green-600 text-white px-4 py-2 rounded"
                    >
                        Update
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
Edit.layout = page => <AdminLayout children={page} />;