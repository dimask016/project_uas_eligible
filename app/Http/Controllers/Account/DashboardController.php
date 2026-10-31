<?php

namespace App\Http\Controllers\Account;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function __invoke(Request $request)
    {
        // 1. Hitung Jumlah Transaksi Berdasarkan Status
        $count_unpaid    = Transaction::where('status', 'UNPAID')->count();$count_paid      = Transaction::where('status', 'PAID')->count();
        $count_expired   = Transaction::where('status', 'EXPIRED')->count();$count_cancelled = Transaction::where('status', 'CANCELLED')->count();

        // 2. Olah Data Chart Revenue Per Bulan di Tahun Berjalan (Status PAID)
        $year = date('Y');
        
        // Ambil total revenue per bulan untuk transaksi berstatus PAID
        $revenueMonthly = Transaction::select(
            DB::raw('MONTH(created_at) as month'),
            DB::raw('SUM(grand_total) as total')
        )
        ->where('status', 'PAID')
        ->whereYear('created_at', $year)
        ->groupBy(DB::raw('MONTH(created_at)'))
        ->pluck('total', 'month')
        ->toArray();

        // Susun Array 12 Bulan (Januari - Desember)
        $months = [
            1 => 'Januari', 2 => 'Februari', 3 => 'Maret', 4 => 'April',
            5 => 'Mei', 6 => 'Juni', 7 => 'Juli', 8 => 'Agustus',
            9 => 'September', 10 => 'Oktober', 11 => 'November', 12 => 'Desember'
        ];

        $chart_labels = [];$chart_revenues = [];

        foreach ($months as $monthNumber =>$monthName) {
            $chart_labels[]   =$monthName;
            // Jika ada pendapatan di bulan tersebut ambil totalnya, jika tidak set 0
            $chart_revenues[] = (int) ($revenueMonthly[$monthNumber] ?? 0);
        }

        return Inertia::render('Account/Dashboard/Index', [
            'count' => [
                'unpaid'    => $count_unpaid,
                'paid'      => $count_paid,
                'expired'   => $count_expired,
                'cancelled' => $count_cancelled,
            ],
            'chart' => [
                'labels'   => $chart_labels,
                'revenues' => $chart_revenues,
                'year'     => $year,
            ]
        ]);
    }
}
