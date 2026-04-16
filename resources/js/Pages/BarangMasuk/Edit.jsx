import { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { router, Link } from "@inertiajs/react";

export default function Edit({ barangMasuk, barang }) {

    const [values, setValues] = useState({

        barang_id: barangMasuk.barang_id,
        tanggal_masuk: barangMasuk.tanggal_masuk,
        jumlah: barangMasuk.jumlah

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

            <form onSubmit={handleSubmit}>

                <div className="mb-3">

                    <label>Barang</label>

                    <select
                        name="barang_id"
                        className="w-full border p-2"
                        value={values.barang_id}
                        onChange={handleChange}
                    >

                        {barang.map((item) => (

                            <option
                                key={item.id}
                                value={item.id}
                            >
                                {item.nama_barang}
                            </option>

                        ))}

                    </select>

                </div>

                <div className="mb-3">

                    <label>Tanggal</label>

                    <input
                        type="date"
                        name="tanggal_masuk"
                        className="w-full border p-2"
                        value={values.tanggal_masuk}
                        onChange={handleChange}
                    />

                </div>

                <div className="mb-3">

                    <label>Jumlah</label>

                    <input
                        type="number"
                        name="jumlah"
                        className="w-full border p-2"
                        value={values.jumlah}
                        onChange={handleChange}
                    />

                </div>

                <button className="bg-green-600 text-white px-4 py-2 rounded">

                    Update

                </button>

                <Link
                    href={route("barang-masuk.index")}
                    className="ml-2 bg-gray-500 text-white px-4 py-2 rounded"
                >

                    Kembali

                </Link>

            </form>

        </div>

    );

}

/* 🔥 WAJIB */
Edit.layout = page => <AdminLayout children={page} />;