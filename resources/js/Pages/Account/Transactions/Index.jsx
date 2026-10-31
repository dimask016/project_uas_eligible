import React from 'react';
import LayoutAccount from '../../../Layouts/Account';
import { Head, usePage, Link, router } from '@inertiajs/react';
import FormatPrice from '../../../Utils/FormatPrice';

export default function TransactionIndex() {
    const { transactions, filters, auth } = usePage().props;
    const [search, setSearch] = React.useState(filters.q || '');
    const currentStatus = filters.status || '';

    const isAdmin = auth.user.role === 'admin' || auth.user.is_admin === 1;

    // Handler filter status transaksi
    const handleStatusFilter = (status) => {
        router.get('/account/transactions', { ...filters, status: status }, { preserveState: true });
    };

    // Handler pencarian invoice
    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/account/transactions', { ...filters, q: search }, { preserveState: true });
    };

    return (
        <LayoutAccount>
            <Head>
                <title>Transactions - 2R STORE</title>
            </Head>

            <div className="card border-0 rounded-3 shadow-sm">
                <div className="card-header bg-white py-3">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                        <span className="fw-bold fs-6">
                            <i className="fa fa-shopping-cart me-2"></i> 
                            {isAdmin ? 'Management Transaksi Customer' : 'Transaksi Saya'}
                        </span>

                        {/* Form Search Invoice */}
                        <form onSubmit={handleSearch} className="d-flex" style={{ maxWidth: '300px' }}>
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

                    {/* Filter Status Buttons */}
                    <div className="d-flex flex-wrap gap-2 mt-3 pt-2 border-top">
                        <button 
                            onClick={() => handleStatusFilter('')} 
                            className={`btn btn-sm ${currentStatus === '' ? 'btn-dark' : 'btn-outline-dark'}`}
                        >
                            Semua Status
                        </button>
                        <button 
                            onClick={() => handleStatusFilter('UNPAID')} 
                            className={`btn btn-sm ${currentStatus === 'UNPAID' ? 'btn-warning text-dark fw-bold' : 'btn-outline-warning text-dark'}`}
                        >
                            UNPAID
                        </button>
                        <button 
                            onClick={() => handleStatusFilter('PAID')} 
                            className={`btn btn-sm ${currentStatus === 'PAID' ? 'btn-success' : 'btn-outline-success'}`}
                        >
                            PAID
                        </button>
                        <button 
                            onClick={() => handleStatusFilter('EXPIRED')} 
                            className={`btn btn-sm ${currentStatus === 'EXPIRED' ? 'btn-danger' : 'btn-outline-danger'}`}
                        >
                            EXPIRED
                        </button>
                        <button 
                            onClick={() => handleStatusFilter('CANCELLED')} 
                            className={`btn btn-sm ${currentStatus === 'CANCELLED' ? 'btn-secondary' : 'btn-outline-secondary'}`}
                        >
                            CANCELLED
                        </button>
                    </div>
                </div>

                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-bordered table-striped align-middle mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th scope="col" className="text-center" style={{ width: '5%' }}>No.</th>
                                    <th scope="col">No. Invoice</th>
                                    {isAdmin && <th scope="col">Customer</th>}
                                    <th scope="col">Grand Total</th>
                                    <th scope="col" className="text-center">Status</th>
                                    <th scope="col" className="text-center" style={{ width: '15%' }}>Aksi</th>
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
                                            
                                            {isAdmin && (
                                                <td>
                                                    <div className="fw-bold">{transaction.user ? transaction.user.name : 'Guest/Deleted'}</div>
                                                    <small className="text-muted">{transaction.user ? transaction.user.email : '-'}</small>
                                                </td>
                                            )}

                                            <td className="fw-bold">Rp. {FormatPrice(transaction.grand_total)}</td>
                                            <td className="text-center">
                                                {transaction.status === 'UNPAID' && <span className="badge bg-warning text-dark px-3 py-2">UNPAID</span>}
                                                {transaction.status === 'PAID' && <span className="badge bg-success px-3 py-2">PAID</span>}
                                                {transaction.status === 'EXPIRED' && <span className="badge bg-danger px-3 py-2">EXPIRED</span>}
                                                {transaction.status === 'CANCELLED' && <span className="badge bg-dark px-3 py-2">CANCELLED</span>}
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
                                            Tidak ada transaksi dengan status yang dipilih.
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
