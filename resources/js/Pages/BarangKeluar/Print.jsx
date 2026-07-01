import React, { useEffect } from "react";
import { Head } from "@inertiajs/react";

export default function Print({ items, header }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            window.print();
        }, 600);
        return () => clearTimeout(timer);
    }, []);

    if (!header || !items || items.length === 0) return null;

    const formattedDate = new Date(header.created_at).toLocaleString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });

    const noTransaksi = header.kode_transaksi || `REF-${String(header.id).padStart(6, "0")}`;

    return (
        <>
            <Head title={`Nota ${noTransaksi}`} />

            <div style={{
                fontFamily: "'Arial', sans-serif",
                background: "#f1f5f9",
                minHeight: "100vh",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
                padding: "40px 16px",
            }}>
                {/* Kertas Nota */}
                <div style={{
                    width: "100%",
                    maxWidth: "680px",
                    background: "white",
                    border: "1.5px solid #1e293b",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
                    padding: "40px 48px",
                }}>

                    {/* ===== HEADER ===== */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "3px solid #1e293b", paddingBottom: "20px", marginBottom: "28px" }}>
                        <div>
                            <div style={{ fontSize: "24px", fontWeight: "900", letterSpacing: "-1px", color: "#0f172a" }}>SiGudang</div>
                            <div style={{ fontSize: "10px", fontWeight: "700", color: "#64748b", letterSpacing: "2px", textTransform: "uppercase", marginTop: "3px" }}>Sistem Informasi Gudang Pramuka</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: "13px", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px" }}>Nota Barang Keluar</div>
                            <div style={{ marginTop: "6px", fontFamily: "monospace", fontSize: "11px", fontWeight: "700", background: "#f1f5f9", color: "#3730a3", padding: "4px 10px", borderRadius: "4px", display: "inline-block" }}>
                                {noTransaksi}
                            </div>
                        </div>
                    </div>

                    {/* ===== INFO PENERIMA & TANGGAL ===== */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "28px", gap: "24px" }}>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: "9px", fontWeight: "900", color: "#94a3b8", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "4px" }}>
                                Kepada / Ditujukan Kepada:
                            </div>
                            <div style={{ fontSize: "20px", fontWeight: "900", color: "#0f172a", textTransform: "uppercase", borderBottom: "2px solid #e2e8f0", paddingBottom: "4px" }}>
                                {header.penerima || "—"}
                            </div>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                            <div style={{ fontSize: "9px", fontWeight: "900", color: "#94a3b8", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "4px" }}>
                                Tanggal:
                            </div>
                            <div style={{ fontSize: "13px", fontWeight: "700", color: "#334155" }}>
                                {formattedDate}
                            </div>
                        </div>
                    </div>

                    {/* ===== TABEL BARANG ===== */}
                    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "36px" }}>
                        <thead>
                            <tr>
                                <th style={{ background: "#1e293b", color: "white", padding: "10px 12px", textAlign: "left", fontSize: "9px", fontWeight: "900", letterSpacing: "1.5px", textTransform: "uppercase", border: "1px solid #1e293b", width: "36px" }}>No</th>
                                <th style={{ background: "#1e293b", color: "white", padding: "10px 12px", textAlign: "left", fontSize: "9px", fontWeight: "900", letterSpacing: "1.5px", textTransform: "uppercase", border: "1px solid #1e293b" }}>Nama Barang</th>
                                <th style={{ background: "#1e293b", color: "white", padding: "10px 12px", textAlign: "left", fontSize: "9px", fontWeight: "900", letterSpacing: "1.5px", textTransform: "uppercase", border: "1px solid #1e293b" }}>Kategori</th>
                                <th style={{ background: "#1e293b", color: "white", padding: "10px 12px", textAlign: "center", fontSize: "9px", fontWeight: "900", letterSpacing: "1.5px", textTransform: "uppercase", border: "1px solid #1e293b", width: "70px" }}>Jumlah</th>
                                <th style={{ background: "#1e293b", color: "white", padding: "10px 12px", textAlign: "center", fontSize: "9px", fontWeight: "900", letterSpacing: "1.5px", textTransform: "uppercase", border: "1px solid #1e293b", width: "70px" }}>Satuan</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => (
                                <tr key={index} style={{ background: index % 2 === 0 ? "white" : "#f8fafc" }}>
                                    <td style={{ padding: "10px 12px", border: "1px solid #cbd5e1", textAlign: "center", fontSize: "12px", color: "#64748b", fontWeight: "600" }}>
                                        {index + 1}
                                    </td>
                                    <td style={{ padding: "10px 12px", border: "1px solid #cbd5e1" }}>
                                        <div style={{ fontWeight: "800", fontSize: "13px", textTransform: "uppercase", color: "#0f172a" }}>
                                            {item.barang?.nama_barang || "—"}
                                        </div>
                                        <div style={{ fontFamily: "monospace", fontSize: "10px", color: "#94a3b8", marginTop: "2px" }}>
                                            {item.barang?.kode_barang || ""}
                                        </div>
                                    </td>
                                    <td style={{ padding: "10px 12px", border: "1px solid #cbd5e1", fontSize: "12px", fontStyle: "italic", color: "#475569" }}>
                                        {item.barang?.kategori?.nama_kategori || "—"}
                                    </td>
                                    <td style={{ padding: "10px 12px", border: "1px solid #cbd5e1", textAlign: "center", fontSize: "18px", fontWeight: "900", color: "#0f172a" }}>
                                        {item.jumlah}
                                    </td>
                                    <td style={{ padding: "10px 12px", border: "1px solid #cbd5e1", textAlign: "center", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "#334155" }}>
                                        {item.barang?.satuan?.nama || "Unit"}
                                    </td>
                                </tr>
                            ))}
                            {/* Baris kosong agar nota tidak terlihat pendek */}
                            {items.length < 4 && Array.from({ length: Math.max(0, 4 - items.length) }).map((_, i) => (
                                <tr key={`pad-${i}`}>
                                    <td style={{ padding: "22px 12px", border: "1px solid #cbd5e1" }}>&nbsp;</td>
                                    <td style={{ border: "1px solid #cbd5e1" }}></td>
                                    <td style={{ border: "1px solid #cbd5e1" }}></td>
                                    <td style={{ border: "1px solid #cbd5e1" }}></td>
                                    <td style={{ border: "1px solid #cbd5e1" }}></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* ===== CATATAN ===== */}
                    <div style={{ background: "#f8fafc", borderLeft: "4px solid #1e293b", padding: "12px 16px", marginBottom: "48px" }}>
                        <div style={{ fontSize: "8px", fontWeight: "900", color: "#94a3b8", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "4px" }}>Catatan:</div>
                        <div style={{ fontSize: "11px", color: "#64748b", fontStyle: "italic", lineHeight: "1.6" }}>
                            Harap periksa kembali barang yang diterima. Barang yang telah dikeluarkan dari gudang menjadi tanggung jawab penerima. Nota ini sah dicetak dari Sistem Informasi Gudang Pramuka (SiGudang).
                        </div>
                    </div>

                    {/* ===== TANDA TANGAN ===== */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px", marginBottom: "32px" }}>
                        <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: "9px", fontWeight: "900", color: "#94a3b8", letterSpacing: "2px", textTransform: "uppercase" }}>Penerima / Pelanggan</div>
                            <div style={{ height: "72px" }}></div>
                            <div style={{ borderBottom: "2px solid #cbd5e1", width: "80%", margin: "0 auto" }}></div>
                            <div style={{ marginTop: "6px", fontSize: "9px", color: "#94a3b8" }}>( Nama Terang &amp; Tanda Tangan )</div>
                        </div>
                        <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: "9px", fontWeight: "900", color: "#94a3b8", letterSpacing: "2px", textTransform: "uppercase" }}>Petugas Gudang</div>
                            <div style={{ height: "72px" }}></div>
                            <div style={{ borderBottom: "2px solid #cbd5e1", width: "80%", margin: "0 auto" }}></div>
                            <div style={{ marginTop: "6px", fontSize: "9px", color: "#94a3b8" }}>( Nama Terang &amp; Tanda Tangan )</div>
                        </div>
                    </div>

                    {/* ===== FOOTER ===== */}
                    <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "12px", textAlign: "center" }}>
                        <div style={{ fontSize: "8px", color: "#cbd5e1", fontWeight: "700", letterSpacing: "3px", textTransform: "uppercase" }}>
                            Dokumen Digital — SiGudang 2026
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @media print {
                    @page { margin: 0.5cm; size: A4; }
                    body { background: white !important; margin: 0; }
                }
            `}</style>
        </>
    );
}

Print.layout = null;
