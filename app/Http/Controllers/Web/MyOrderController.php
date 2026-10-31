<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;

class MyOrderController extends Controller
{
    /**
     * Menampilkan daftar transaksi khusus customer yang sedang login
     */
    public function index(Request $request)
    {
        $transactions = Transaction::with(['transactionDetails.product'])
            ->where('user_id', auth()->id())
            ->when($request->search, function ($q) use ($request) {
                $q->where('invoice', 'like', '%' . $request->search . '%');
            })
            ->when($request->status, function ($q) use ($request) {
                $q->where('status', $request->status);
            })
            ->latest()
            ->paginate(5);

        $transactions->appends($request->all());

        return inertia('Web/MyOrders/Index', [
            'transactions' => $transactions,
            'filters'      => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Menampilkan detail invoice transaksi spesifik customer
     */
    public function show($invoice)
    {
        $transaction = Transaction::with(['transactionDetails.product'])
            ->where('user_id', auth()->id())
            ->where('invoice', $invoice)
            ->firstOrFail();

        return inertia('Web/MyOrders/Show', [
            'transaction' => $transaction,
        ]);
    }
}
