import React, { useState } from 'react';
import LayoutWeb from '../../../Layouts/Web';
import { Link, Head, router } from '@inertiajs/react';

export default function MyOrderIndex({ auth, transactions, filters }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [status, setStatus] = useState(filters?.status || '');

    const handleFilter = (e) => {
        e.preventDefault();
        router.get('/my-orders', { search, status }, { preserveState: true });
    };

    const handleStatusTab = (selectedStatus) => {
        setStatus(selectedStatus);
        router.get('/my-orders', { search, status: selectedStatus }, { preserveState: true });
    };

    return (
        <LayoutWeb auth={auth}>
            <Head title="My Orders - 2R STORE" />
            <div className="container mt-4 mb-5" style={{ minHeight: '60vh' }}>
                <div className="row">
                    <div className="col-md-12">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 className="fw-bold text-dark mb-0">
                                <i className="fa fa-shopping-bag me-2" style={{ color: '#8B4513' }}></i> Riwayat Pesanan Saya
                            </h4>
                        </div>

                        {/* Filter Status & Search */}
                        <div className="card border-0 shadow-sm rounded-3 mb-4">
                            <div className="card-body">
                                <div className="row g-3 align-items-center">
                                    <div className="col-md-8">
                                        <div className="btn-group flex-wrap" role="group">
                                            <button 
                                                type="button" 
                                                className={`btn btn-sm ${status === '' ? 'btn-dark' : 'btn-outline-dark'}`}
                                                onClick={() => handleStatusTab('')}
                                            >
                                                Semua Status
                                            </button>
                                            <button 
                                                type="button" 
                                                className={`btn btn-sm ${status === 'UNPAID' ? 'btn-warning text-dark' : 'btn-outline-warning text-dark'}`}
                                                onClick={() => handleStatusTab('UNPAID')}
                                            >
                                                UNPAID
                                            </button>
                                            <button 
                                                type="button" 
                                                className={`btn btn-sm ${status === 'PAID' ? 'btn-success' : 'btn-outline-success'}`}
                                                onClick={() => handleStatusTab('PAID')}
                                            >
                                                PAID
                                            </button>
                                            <button 
                                                type="button" 
                                                className={`btn btn-sm ${status === 'EXPIRED' ? 'btn-danger' : 'btn-outline-danger'}`}
                                                onClick={() => handleStatusTab('EXPIRED')}
                                            >
                                                EXPIRED
                                            </button>
                                            <button 
                                                type="button" 
                                                className={`btn btn-sm ${status === 'CANCELLED' ? 'btn-secondary' : 'btn-outline-secondary'}`}
                                                onClick={() => handleStatusTab('CANCELLED')}
                                            >
                                                CANCELLED
                                            </button>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <form onSubmit={handleFilter}>
                                            <div className="input-group">
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm"
                                                    placeholder="Cari No. Invoice..."
                                                    value={search}
                                                    onChange={(e) => setSearch(e.target.value)}
                                                />
                                                <button className="btn btn-sm btn-primary" type="submit">
                                                    <i className="fa fa-search"></i>
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* List Invoice */}
                        {transactions?.data?.length > 0 ? (
                            transactions.data.map((trx) => (
                                <div className="card border-0 shadow-sm rounded-3 mb-3 overflow-hidden" key={trx.id}>
                                    <div className="card-header bg-light d-flex justify-content-between align-items-center py-3">
                                        <div>
                                            <span className="text-muted small">No. Invoice: </span>
                                            <strong className="text-primary me-3">{trx.invoice}</strong>
                                            {trx.created_at && (
                                                <span className="text-muted small d-none d-md-inline">
                                                    {new Date(trx.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                </span>
                                            )}
                                        </div>
                                        <span className={`badge ${
                                            trx.status === 'PAID' ? 'bg-success' : 
                                            trx.status === 'UNPAID' ? 'bg-warning text-dark' : 
                                            trx.status === 'EXPIRED' ? 'bg-danger' : 'bg-secondary'
                                        }`}>
                                            {trx.status}
                                        </span>
                                    </div>
                                    <div className="card-body">
                                        <div className="row align-items-center">
                                            <div className="col-md-8 mb-3 mb-md-0">
                                                <p className="mb-1 text-muted small">Ekspedisi Pengiriman:</p>
                                                <p className="fw-bold text-dark mb-2">
                                                    {trx.courier_name?.toUpperCase()} - {trx.courier_service} (Ongkir: Rp {Number(trx.courier_cost || 0).toLocaleString('id-ID')})
                                                </p>
                                                <p className="mb-0 text-muted small">
                                                    Total Belanja: <strong className="text-success fs-6 ms-1">Rp {Number(trx.grand_total).toLocaleString('id-ID')}</strong>
                                                </p>
                                            </div>
                                            <div className="col-md-4 text-md-end">
                                                <Link 
                                                    href={`/my-orders/${trx.invoice}`} 
                                                    className="btn btn-sm btn-outline-primary px-3 rounded-2"
                                                >
                                                    Detail Transaksi <i className="fa fa-arrow-right ms-1"></i>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="card border-0 shadow-sm rounded-3 p-5 text-center">
                                <i className="fa fa-shopping-cart fa-3x text-muted mb-3"></i>
                                <h5 className="fw-bold text-muted">Belum ada riwayat pesanan</h5>
                                <p className="text-muted small">Silakan jelajahi katalog produk kami dan buat pesanan pertama Anda.</p>
                                <div>
                                    <Link href="/" className="btn btn-primary btn-sm rounded-2 px-4">
                                        Mulai Berbelanja
                                    </Link>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </LayoutWeb>
    );
}
