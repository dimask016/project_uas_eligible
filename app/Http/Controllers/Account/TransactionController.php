<?php

namespace App\Http\Controllers\Account;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TransactionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        $user = auth()->user();

        // Query dasar transaksi beserta data relasi user
        $query = Transaction::with('user');

        // Jika bukan Admin, filter hanya transaksi milik user bersangkutan
        if (!($user->hasRole('admin') || (isset($user->is_admin) && $user->is_admin == 1))) {
            $query->where('user_id', $user->id);
        }

        // Filter berdasarkan pencarian No. Invoice
        if ($request->q) {
            $query->where('invoice', 'like', '%' . $request->q . '%');
        }

        // Filter berdasarkan Status (UNPAID, PAID, EXPIRED, CANCELLED)
        if ($request->status && in_array(strtoupper($request->status), ['UNPAID', 'PAID', 'EXPIRED', 'CANCELLED'])) {
            $query->where('status', strtoupper($request->status));
        }

        $transactions = $query->latest()->paginate(10);

        return Inertia::render('Account/Transactions/Index', [
            'transactions' => $transactions,
            'filters'      => $request->all(['q', 'status']),
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  string  $invoice
     * @return \Inertia\Response
     */
    public function show($invoice)
    {
        // Menggunakan transactionDetails sesuai nama method di Model Transaction.php
        $transaction = Transaction::with([
            'transactionDetails.product', 
            'user', 
            'province', 
            'city', 
            'district'
        ])
        ->where('invoice', $invoice)
        ->orWhere('reference', $invoice)
        ->firstOrFail();

        return Inertia::render('Account/Transactions/Show', [
            'transaction' => $transaction,
        ]);
    }
}
