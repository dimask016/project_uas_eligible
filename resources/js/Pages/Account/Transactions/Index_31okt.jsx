import React from 'react';
import LayoutAccount from '../../../Layouts/Account';
import { Head, usePage, Link, router } from '@inertiajs/react';
import FormatPrice from '../../../Utils/FormatPrice';

export default function TransactionIndex() {
    // Ambil props transactions, filters, dan auth dari Inertia
    const { transactions, filters, auth } = usePage().props;
    const [search, setSearch] = React.useState(filters.q || '');

    // Cek status role admin
    const isAdmin = auth.user.role === 'admin' || auth.user.is_admin === 1;

    // Handle fungsi pencarian invoice
    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/account/transactions', { q: search }, { preserveState: true });
    };

    return (
        <LayoutAccount>
            <Head>
                <title>Transactions - 2R STORE</title>
            </Head>

            <div className="card border-0 rounded-3 shadow-sm">
                <div className="card-header bg-white fw-bold py-3 d-flex justify-content-between align-items-center">
                    <span>
                        <i className="fa fa-shopping-cart me-2"></i> 
                        {isAdmin ? 'All Customers Transactions' : 'My Transactions'}
                    </span>
                    
                    {/* Form Pencarian Invoice */}
                    <form onSubmit={handleSearch} className="d-flex" style={{ width: '300px' }}>
                        <input
                            type="text"
                            className="form-control form-control-sm me-2"
                            placeholder="Cari No. Invoice..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button type="submit" className="btn btn-sm btn-primary">
                            <i className="fa fa-search"></i>
                        </button>
                    </form>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-bordered table-striped align-middle mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th scope="col" className="text-center" style={{ width: '5%' }}>No.</th>
                                    <th scope="col">No. Invoice</th>
                                    
                                    {/* Kolom Customer hanya muncul jika yang login Admin */}
                                    {isAdmin && <th scope="col">Customer Name</th>}

                                    <th scope="col">Grand Total</th>
                                    <th scope="col" className="text-center">Status</th>
                                    <th scope="col" className="text-center" style={{ width: '15%' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.data.length > 0 ? (
                                    transactions.data.map((transaction, index) => (
                                        <tr key={index}>
                                            <td className="text-center">
                                                {index + 1 + (transactions.current_page - 1) * transactions.per_page}
                                            </td>
                                            <td className="fw-bold text-primary">{transaction.invoice}</td>
                                            
                                            {/* Data Nama Customer untuk Admin */}
                                            {isAdmin && (
                                                <td>
                                                    <div className="fw-bold">{transaction.user ? transaction.user.name : 'Guest/Deleted'}</div>
                                                    <small className="text-muted">{transaction.user ? transaction.user.email : '-'}</small>
                                                </td>
                                            )}

                                            <td className="fw-bold">Rp. {FormatPrice(transaction.grand_total)}</td>
                                            <td className="text-center">
                                                {transaction.status === 'UNPAID' && <span className="badge bg-warning text-dark p-2">UNPAID</span>}
                                                {transaction.status === 'PAID' && <span className="badge bg-success p-2">PAID</span>}
                                                {transaction.status === 'EXPIRED' && <span className="badge bg-danger p-2">EXPIRED</span>}
                                                {transaction.status === 'CANCELLED' && <span className="badge bg-dark p-2">CANCELLED</span>}
                                            </td>
                                            <td className="text-center">
                                                <Link 
                                                    href={`/account/transactions/${transaction.snap_token || transaction.invoice}`} 
                                                    className="btn btn-sm btn-primary shadow-sm"
                                                >
                                                    <i className="fa fa-eye me-1"></i> Detail
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={isAdmin ? "6" : "5"} className="text-center text-danger fw-bold py-4">
                                            Belum ada data transaksi.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </LayoutAccount>
    );
}
