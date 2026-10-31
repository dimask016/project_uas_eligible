import React, { useState } from 'react';
import LayoutAccount from '../../../Layouts/Account';
import { Head, usePage, Link, router } from '@inertiajs/react';
import FormatPrice from '../../../Utils/FormatPrice';
import Pagination from '../../../Shared/Pagination';

export default function CustomerTransactionIndex() {
    const { transactions, filters } = usePage().props;
    const [search, setSearch] = useState(filters.q || '');
    const currentStatus = filters.status || '';

    // Handler filter status
    const handleStatusFilter = (status) => {
        router.get('/account/transactions', { ...filters, status: status }, { preserveState: true });
    };

    // Handler pencarian invoice
    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/account/transactions', { ...filters, q: search }, { preserveState: true });
    };

    // Helper Badge Status
    const renderStatusBadge = (status) => {
        switch (status) {
            case 'PAID':
                return <span className="badge bg-success px-3 py-2"><i className="fa fa-check-circle me-1"></i> PAID</span>;
            case 'UNPAID':
                return <span className="badge bg-warning text-dark fw-bold px-3 py-2"><i className="fa fa-clock me-1"></i> UNPAID</span>;
            case 'EXPIRED':
                return <span className="badge bg-danger px-3 py-2"><i className="fa fa-exclamation-triangle me-1"></i> EXPIRED</span>;
            case 'CANCELLED':
                return <span className="badge bg-secondary px-3 py-2"><i className="fa fa-times-circle me-1"></i> CANCELLED</span>;
            default:
                return <span className="badge bg-dark px-3 py-2">{status}</span>;
        }
    };

    return (
        <LayoutAccount>
            <Head>
                <title>My Orders - 2R STORE</title>
            </Head>

            <div className="card border-0 rounded-3 shadow-sm border-top-success">
                <div className="card-header bg-white py-3">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                        <span className="fw-bold fs-5 text-dark">
                            <i className="fa fa-shopping-bag text-success me-2"></i> Riwayat Pesanan Saya
                        </span>

                        {/* Form Search Invoice */}
                        <form onSubmit={handleSearch} className="d-flex" style={{ maxWidth: '320px' }}>
                            <div className="input-group input-group-sm">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Cari No. Invoice..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <button type="submit" className="btn btn-success">
                                    <i className="fa fa-search"></i>
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Filter Status Buttons */}
                    <div className="d-flex flex-wrap gap-2 mt-3 pt-2 border-top">
                        <button 
                            onClick={() => handleStatusFilter('')} 
                            className={`btn btn-sm ${currentStatus === '' ? 'btn-dark fw-bold' : 'btn-outline-dark'}`}
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
                            className={`btn btn-sm ${currentStatus === 'PAID' ? 'btn-success fw-bold' : 'btn-outline-success'}`}
                        >
                            PAID
                        </button>
                        <button 
                            onClick={() => handleStatusFilter('EXPIRED')} 
                            className={`btn btn-sm ${currentStatus === 'EXPIRED' ? 'btn-danger fw-bold' : 'btn-outline-danger'}`}
                        >
                            EXPIRED
                        </button>
                        <button 
                            onClick={() => handleStatusFilter('CANCELLED')} 
                            className={`btn btn-sm ${currentStatus === 'CANCELLED' ? 'btn-secondary fw-bold' : 'btn-outline-secondary'}`}
                        >
                            CANCELLED
                        </button>
                    </div>
                </div>

                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-bordered table-striped align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th scope="col" className="text-center" style={{ width: '5%' }}>No.</th>
                                    <th scope="col">No. Invoice</th>
                                    <th scope="col" className="text-center">Kurir Pengiriman</th>
                                    <th scope="col" className="text-end">Grand Total</th>
                                    <th scope="col" className="text-center">Status</th>
                                    <th scope="col" className="text-center" style={{ width: '15%' }}>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions && transactions.data && transactions.data.length > 0 ? (
                                    transactions.data.map((transaction, index) => (
                                        <tr key={transaction.id || index}>
                                            <td className="text-center fw-bold">
                                                {index + 1 + (transactions.current_page - 1) * transactions.per_page}
                                            </td>
                                            <td className="fw-bold text-primary">
                                                {transaction.invoice}
                                            </td>
                                            <td className="text-center text-uppercase">
                                                <span className="badge bg-light text-dark border">
                                                    {transaction.courier_name} ({transaction.courier_service})
                                                </span>
                                            </td>
                                            <td className="fw-bold text-end text-success">
                                                Rp. {FormatPrice ? FormatPrice(transaction.grand_total) : Number(transaction.grand_total).toLocaleString('id-ID')}
                                            </td>
                                            <td className="text-center">
                                                {renderStatusBadge(transaction.status)}
                                            </td>
                                            <td className="text-center">
                                                <Link 
                                                    href={`/account/transactions/${transaction.invoice || transaction.snap_token}`} 
                                                    className="btn btn-sm btn-success shadow-sm"
                                                >
                                                    <i className="fa fa-eye me-1"></i> Detail Order
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center text-muted py-4">
                                            <i className="fa fa-info-circle me-1"></i> Belum ada pesanan ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {transactions && transactions.links && (
                        <div className="mt-4 d-flex justify-content-end">
                            <Pagination links={transactions.links} align={'end'} />
                        </div>
                    )}
                </div>
            </div>
        </LayoutAccount>
    );
}
