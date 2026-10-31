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

        // Query dasar transaksi beserta data relasi user & detail
        $query = Transaction::with(['user', 'transactionDetails.product']);

        // Cek apakah user memiliki akses Administrator
        $isAdmin = $user->hasRole('admin') || (isset($user->is_admin) && $user->is_admin == 1);

        // Jika bukan Admin, filter hanya transaksi milik user bersangkutan
        if (!$isAdmin) {
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

        $transactions = $query->latest()->paginate(10)->withQueryString();

        $data = [
            'transactions' => $transactions,
            'filters'      => $request->all(['q', 'status']),
        ];

        // RENDER BERDASARKAN ROLE:
        // Admin -> Account/Transactions/Index (Dashboard Admin)
        // Customer -> User/Transactions/Index (Halaman My Orders)
        if ($isAdmin) {
            return Inertia::render('Account/Transactions/Index', $data);
        }

        return Inertia::render('User/Transactions/Index', $data);
    }

    /**
     * Display the specified resource.
     *
     * @param  string  $invoice
     * @return \Inertia\Response
     */
    public function show($invoice)
    {
        $user = auth()->user();
        $isAdmin = $user->hasRole('admin') || (isset($user->is_admin) && $user->is_admin == 1);

        $query = Transaction::with([
            'transactionDetails.product', 
            'user', 
            'province', 
            'city', 
            'district'
        ])
        ->where(function ($q) use ($invoice) {
            $q->where('invoice', $invoice)
              ->orWhere('reference', $invoice);
        });

        // Proteksi Keamanan: Customer biasa HANYA BISA melihat detail transaksinya sendiri
        if (!$isAdmin) {
            $query->where('user_id', $user->id);
        }

        $transaction = $query->firstOrFail();

        return Inertia::render('Account/Transactions/Show', [
            'transaction' => $transaction,
        ]);
    }
}
