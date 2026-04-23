<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use App\Models\BarangMasuk;
use App\Models\BarangKeluar;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Symfony\Component\HttpFoundation\StreamedResponse;

class LaporanController extends Controller
{
    // ==========================================
    // BARANG MASUK
    // ==========================================

    public function barangMasuk(Request $request)
    {
        $search = $request->search;
        $query = BarangMasuk::with(['barang.kategori', 'barang.satuan', 'supplier']);

        if ($request->dari && $request->sampai) {
            $query->whereBetween('tanggal_masuk', [$request->dari, $request->sampai]);
        }

        $query->when($search, function($q, $search) {
            $q->whereHas('barang', function ($q2) use ($search) {
                $q2->where('nama_barang', 'like', "%{$search}%")
                  ->orWhereHas('kategori', function ($q3) use ($search) {
                        $q3->where('nama_kategori', 'like', "%{$search}%");
                  });
            })->orWhereHas('supplier', function ($q2) use ($search) {
                $q2->where('nama_supplier', 'like', "%{$search}%");
            });
       });

        $data = $query->orderBy('tanggal_masuk', 'desc')->paginate(10)->withQueryString();

        return Inertia::render('Laporan/BarangMasuk', [
            'data' => $data,
            'filters' => $request->only(['dari', 'sampai', 'search'])
        ]);
    }

    public function exportBarangMasuk(Request $request)
    {
        $search = $request->search;
        $query = BarangMasuk::with(['barang.kategori', 'barang.satuan', 'supplier']);

        if ($request->dari && $request->sampai) {
            $query->whereBetween('tanggal_masuk', [$request->dari, $request->sampai]);
        }

        $query->when($search, function($q, $search) {
            $q->whereHas('barang', function ($q2) use ($search) {
                $q2->where('nama_barang', 'like', "%{$search}%")
                  ->orWhereHas('kategori', function ($q3) use ($search) {
                        $q3->where('nama_kategori', 'like', "%{$search}%");
                  });
            })->orWhereHas('supplier', function ($q2) use ($search) {
                $q2->where('nama_supplier', 'like', "%{$search}%");
            });
       });

        $data = $query->orderBy('tanggal_masuk', 'desc')->get();

        return $this->generateExcel(
            'Laporan_Barang_Masuk_' . now()->format('YmdHis'),
            'LAPORAN BARANG MASUK',
            ['No', 'Tanggal', 'Kode Barang', 'Nama Barang', 'Kategori', 'Supplier', 'Jumlah', 'Satuan'],
            $data->map(function ($item, $index) {
                return [
                    $index + 1,
                    $item->tanggal_masuk,
                    $item->barang->kode_barang ?? '-',
                    $item->barang->nama_barang ?? '-',
                    $item->barang->kategori->nama_kategori ?? '-',
                    $item->supplier->nama_supplier ?? '-',
                    $item->jumlah,
                    $item->barang->satuan->nama ?? '-',
                ];
            })->toArray()
        );
    }

    // ==========================================
    // BARANG KELUAR
    // ==========================================

    public function barangKeluar(Request $request)
    {
        $search = $request->search;
        $query = BarangKeluar::with(['barang.kategori', 'barang.satuan']);

        if ($request->dari && $request->sampai) {
            $query->whereBetween('tanggal_keluar', [$request->dari, $request->sampai]);
        }

        $query->when($search, function($q, $search) {
            $q->whereHas('barang', function ($q2) use ($search) {
                $q2->where('nama_barang', 'like', "%{$search}%")
                  ->orWhereHas('kategori', function ($q3) use ($search) {
                        $q3->where('nama_kategori', 'like', "%{$search}%");
                  });
            });
       });

        $data = $query->orderBy('tanggal_keluar', 'desc')->paginate(10)->withQueryString();

        return Inertia::render('Laporan/BarangKeluar', [
            'data' => $data,
            'filters' => $request->only(['dari', 'sampai', 'search'])
        ]);
    }

    public function exportBarangKeluar(Request $request)
    {
        $search = $request->search;
        $query = BarangKeluar::with(['barang.kategori', 'barang.satuan']);

        if ($request->dari && $request->sampai) {
            $query->whereBetween('tanggal_keluar', [$request->dari, $request->sampai]);
        }

        $query->when($search, function($q, $search) {
            $q->whereHas('barang', function ($q2) use ($search) {
                $q2->where('nama_barang', 'like', "%{$search}%")
                  ->orWhereHas('kategori', function ($q3) use ($search) {
                        $q3->where('nama_kategori', 'like', "%{$search}%");
                  });
            });
       });

        $data = $query->orderBy('tanggal_keluar', 'desc')->get();

        return $this->generateExcel(
            'Laporan_Barang_Keluar_' . now()->format('YmdHis'),
            'LAPORAN BARANG KELUAR',
            ['No', 'Tanggal', 'Kode Barang', 'Nama Barang', 'Kategori', 'Jumlah', 'Satuan'],
            $data->map(function ($item, $index) {
                return [
                    $index + 1,
                    $item->tanggal_keluar,
                    $item->barang->kode_barang ?? '-',
                    $item->barang->nama_barang ?? '-',
                    $item->barang->kategori->nama_kategori ?? '-',
                    $item->jumlah,
                    $item->barang->satuan->nama ?? '-',
                ];
            })->toArray()
        );
    }

    // ==========================================
    // STOK
    // ==========================================

    public function stok(Request $request)
    {
        $dari = $request->dari;
        $sampai = $request->sampai;
        $search = $request->search;

        $barangPaginated = Barang::with([
            'kategori',
            'satuan',
            'barangMasuk' => function ($q) use ($dari, $sampai) {
                if ($dari && $sampai) $q->whereBetween('tanggal_masuk', [$dari, $sampai]);
            },
            'barangKeluar' => function ($q) use ($dari, $sampai) {
                if ($dari && $sampai) $q->whereBetween('tanggal_keluar', [$dari, $sampai]);
            }
        ])
        ->when($search, function ($query, $search) {
            $query->where('nama_barang', 'like', "%{$search}%")
                  ->orWhere('kode_barang', 'like', "%{$search}%")
                  ->orWhereHas('kategori', function($q) use ($search) {
                      $q->where('nama_kategori', 'like', "%{$search}%");
                  });
        })
        ->paginate(10)
        ->withQueryString();

        $barangPaginated->getCollection()->transform(function ($item) {
            $masuk = $item->barangMasuk->sum('jumlah');
            $keluar = $item->barangKeluar->sum('jumlah');
            // Stok tetap menggunakan stok aktual yang ada di database saat ini
            $stok = $item->stok;

            return [
                'id' => $item->id,
                'kode_barang' => $item->kode_barang,
                'nama_barang' => $item->nama_barang,
                'kategori' => $item->kategori->nama_kategori ?? '-',
                'satuan' => $item->satuan->nama ?? '-',
                'masuk' => $masuk,
                'keluar' => $keluar,
                'stok' => $stok,
            ];
        });

        return Inertia::render('Laporan/Stok', [
            'barang' => $barangPaginated,
            'filters' => $request->only(['dari', 'sampai', 'search'])
        ]);
    }

    public function exportStok(Request $request)
    {
        $dari = $request->dari;
        $sampai = $request->sampai;
        $search = $request->search;

        $barang = Barang::with([
            'kategori',
            'satuan',
            'barangMasuk' => function ($q) use ($dari, $sampai) {
                if ($dari && $sampai) $q->whereBetween('tanggal_masuk', [$dari, $sampai]);
            },
            'barangKeluar' => function ($q) use ($dari, $sampai) {
                if ($dari && $sampai) $q->whereBetween('tanggal_keluar', [$dari, $sampai]);
            }
        ])
        ->when($search, function ($query, $search) {
            $query->where('nama_barang', 'like', "%{$search}%")
                  ->orWhere('kode_barang', 'like', "%{$search}%")
                  ->orWhereHas('kategori', function($q) use ($search) {
                      $q->where('nama_kategori', 'like', "%{$search}%");
                  });
        })
        ->get()->map(function ($item, $index) {
            $masuk = $item->barangMasuk->sum('jumlah');
            $keluar = $item->barangKeluar->sum('jumlah');
            $stok = $item->stok;

            return [
                $index + 1,
                $item->kode_barang,
                $item->nama_barang,
                $item->kategori->nama_kategori ?? '-',
                $item->satuan->nama ?? '-',
                $masuk,
                $keluar,
                $stok,
            ];
        })->toArray();

        return $this->generateExcel(
            'Laporan_Stok_' . now()->format('YmdHis'),
            'LAPORAN STOK BARANG' . ($dari && $sampai ? " DARI $dari S/D $sampai" : ""),
            ['No', 'Kode Barang', 'Nama Barang', 'Kategori', 'Satuan', 'Total Masuk', 'Total Keluar', 'Stok Saat Ini'],
            $barang
        );
    }

    // ==========================================
    // DEAD STOCK
    // ==========================================

    public function deadStock(Request $request)
    {
        $today = $request->sampai ? Carbon::parse($request->sampai) : Carbon::now();
        $search = $request->search;
        $deadStockLimit = \App\Models\Setting::getSetting('limit_dead_stock', 30);

        // Note: For custom filtering (like filter by 'hari' > 30 from a collection)
        // We have to either do it entirely in PHP and paginate manually, 
        // OR do it on Database. It is extremely complex to do the 30-day check on DB directly without raw queries.
        // Therefore, we will fetch ALL matching items, map them, filter them, THEN create a custom LengthAwarePaginator!

        $semuaBarang = Barang::with([
            'kategori', 
            'satuan', 
            'barangMasuk' => function($q) use ($today) {
                $q->whereDate('tanggal_masuk', '<=', $today);
            }, 
            'barangKeluar' => function($q) use ($today) {
                $q->whereDate('tanggal_keluar', '<=', $today);
            }
        ])
        ->when($search, function ($query, $search) {
            $query->where('nama_barang', 'like', "%{$search}%")
                  ->orWhere('kode_barang', 'like', "%{$search}%")
                  ->orWhereHas('kategori', function($q) use ($search) {
                      $q->where('nama_kategori', 'like', "%{$search}%");
                  });
        })
        ->get();

        $filteredCollection = $semuaBarang->map(function ($item) use ($today) {
                $masuk = $item->barangMasuk->sum('jumlah');
                $keluar = $item->barangKeluar->sum('jumlah');
                $stok = $masuk - $keluar;

                $lastKeluar = $item->barangKeluar->sortByDesc('tanggal_keluar')->first();
                $selisihHari = $lastKeluar ? $today->diffInDays(Carbon::parse($lastKeluar->tanggal_keluar)) : 999;

                return [
                    'id' => $item->id,
                    'kode_barang' => $item->kode_barang,
                    'nama_barang' => $item->nama_barang,
                    'kategori' => $item->kategori->nama_kategori ?? '-',
                    'satuan' => $item->satuan->nama ?? '-',
                    'stok' => $stok,
                    'hari' => $selisihHari,
                ];
            })
            ->filter(fn($item) => $item['hari'] > $deadStockLimit && $item['stok'] > 0)
            ->values();

        // Custom Manual Pagination for Collection
        $perPage = 10;
        $page = \Illuminate\Pagination\Paginator::resolveCurrentPage() ?: 1;
        
        $paginated = new \Illuminate\Pagination\LengthAwarePaginator(
            $filteredCollection->forPage($page, $perPage)->values(),
            $filteredCollection->count(),
            $perPage,
            $page,
            [
                'path' => \Illuminate\Pagination\Paginator::resolveCurrentPath(),
                'query' => $request->query()
            ]
        );

        return Inertia::render('Laporan/DeadStock', [
            'barang' => $paginated,
            'filters' => $request->only(['sampai', 'search'])
        ]);
    }

    public function exportDeadStock(Request $request)
    {
        $today = $request->sampai ? Carbon::parse($request->sampai) : Carbon::now();
        $search = $request->search;
        $deadStockLimit = \App\Models\Setting::getSetting('limit_dead_stock', 30);

        $barang = Barang::with([
            'kategori', 
            'satuan', 
            'barangMasuk' => function($q) use ($today) {
                $q->whereDate('tanggal_masuk', '<=', $today);
            }, 
            'barangKeluar' => function($q) use ($today) {
                $q->whereDate('tanggal_keluar', '<=', $today);
            }
        ])
        ->when($search, function ($query, $search) {
            $query->where('nama_barang', 'like', "%{$search}%")
                  ->orWhere('kode_barang', 'like', "%{$search}%")
                  ->orWhereHas('kategori', function($q) use ($search) {
                      $q->where('nama_kategori', 'like', "%{$search}%");
                  });
        })
        ->get()
            ->map(function ($item) use ($today) {
                $masuk = $item->barangMasuk->sum('jumlah');
                $keluar = $item->barangKeluar->sum('jumlah');
                $stok = $masuk - $keluar;

                $lastKeluar = $item->barangKeluar->sortByDesc('tanggal_keluar')->first();
                $selisihHari = $lastKeluar ? $today->diffInDays(Carbon::parse($lastKeluar->tanggal_keluar)) : 999;

                return [
                    'id' => $item->id,
                    'kode_barang' => $item->kode_barang,
                    'nama_barang' => $item->nama_barang,
                    'kategori' => $item->kategori->nama_kategori ?? '-',
                    'satuan' => $item->satuan->nama ?? '-',
                    'stok' => $stok,
                    'hari' => $selisihHari,
                ];
            })
            ->filter(fn($item) => $item['hari'] > $deadStockLimit && $item['stok'] > 0)
            ->values()
            ->map(function ($item, $index) {
                return [
                    $index + 1,
                    $item['kode_barang'],
                    $item['nama_barang'],
                    $item['kategori'],
                    $item['satuan'],
                    $item['stok'],
                    $item['hari'] . ' Hari',
                ];
            })->toArray();

        return $this->generateExcel(
            'Laporan_Dead_Stock_' . now()->format('YmdHis'),
            'LAPORAN DEAD STOCK' . ($request->sampai ? " S/D {$request->sampai}" : ""),
            ['No', 'Kode Barang', 'Nama Barang', 'Kategori', 'Satuan', 'Stok Pada Saat Itu', 'Tidak Ada Keluar Selama'],
            $barang
        );
    }

    // ==========================================
    // HELPER: GEN EXCEL (ADVANCED HTML TRICK)
    // ==========================================

    private function generateExcel($filename, $title, $headers, $data)
    {
        $callback = function () use ($title, $headers, $data) {
            echo "<!DOCTYPE html>";
            echo "<html>";
            echo "<head>
                <meta charset='UTF-8'>
                <style>
                    .title { font-size: 18pt; font-family: 'Arial', sans-serif; font-weight: bold; color: #1e293b; margin-bottom: 5px; }
                    .subtitle { font-size: 10pt; font-family: 'Arial', sans-serif; color: #64748b; margin-bottom: 20px; }
                    .table { border-collapse: collapse; width: 100%; font-family: 'Arial', sans-serif; font-size: 10pt; }
                    .table th { background-color: #4f46e5; color: #ffffff; padding: 10px; border: 1px solid #312e81; text-align: center; }
                    .table td { padding: 8px; border: 1px solid #e2e8f0; }
                    .zebra { background-color: #f8fafc; }
                    .text-center { text-align: center; }
                    .text-right { text-align: right; }
                    .font-bold { font-weight: bold; }
                    .status-red { color: #dc2626; font-weight: bold; }
                    .status-green { color: #16a34a; font-weight: bold; }
                </style>
            </head>";
            echo "<body>";
            echo "<div class='title'>SIGUDANG PRAMUKA</div>";
            echo "<div class='title'>$title</div>";
            echo "<div class='subtitle'>Laporan diunduh pada: " . now()->format('d F Y, H:i') . " oleh Admin</div>";
            echo "<br>";

            echo "<table class='table' border='1'>";
            echo "<thead>";
            echo "<tr>";
            foreach ($headers as $header) {
                echo "<th>" . strtoupper($header) . "</th>";
            }
            echo "</tr>";
            echo "</thead>";
            echo "<tbody>";

            foreach ($data as $index => $row) {
                $zebraClass = ($index % 2 == 0) ? "" : "class='zebra'";
                echo "<tr $zebraClass>";
                foreach ($row as $cellIndex => $cell) {
                    $class = "";
                    // Khusus kolom "No" dan "Jumlah/Stok" biasanya center
                    if ($cellIndex == 0) $class = "text-center";
                    
                    echo "<td class='$class'>$cell</td>";
                }
                echo "</tr>";
            }
            echo "</tbody>";
            echo "</table>";

            echo "<br>";
            echo "<div style='font-size: 9pt; color: #94a3b8; font-style: italic;'>* Dokumen ini dibuat otomatis oleh Sistem Gudang (SIGUDANG)</div>";

            echo "</body>";
            echo "</html>";
        };

        return response()->stream($callback, 200, [
            "Content-type" => "application/vnd.ms-excel",
            "Content-Disposition" => "attachment; filename=$filename.xls",
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0"
        ]);
    }
}
