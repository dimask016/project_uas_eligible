import React from 'react';
import LayoutWeb from '../../../Layouts/Web';
import { Link, Head } from '@inertiajs/react';

export default function MyOrderShow({ auth, transaction }) {
    return (
        <LayoutWeb auth={auth}>
            <Head title={`Detail Invoice ${transaction.invoice} - 2R STORE`} />
            <div className="container mt-4 mb-5">
                <div className="row">
                    <div className="col-md-12">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <Link href="/my-orders" className="btn btn-sm btn-outline-secondary">
                                <i className="fa fa-arrow-left me-1"></i> Kembali ke Pesanan Saya
                            </Link>
                            <span className={`badge fs-6 ${
                                transaction.status === 'PAID' ? 'bg-success' : 
                                transaction.status === 'UNPAID' ? 'bg-warning text-dark' : 'bg-danger'
                            }`}>
                                STATUS: {transaction.status}
                            </span>
                        </div>

                        {/* Rincian Invoice & Pengiriman */}
                        <div className="card border-0 shadow-sm rounded-3 mb-4">
                            <div className="card-header bg-light py-3">
                                <h6 className="fw-bold mb-0 text-dark">
                                    <i className="fa fa-file-invoice me-2"></i> Rincian Pengiriman & Invoice #{transaction.invoice}
                                </h6>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <table className="table table-borderless table-sm mb-0">
                                            <tbody>
                                                <tr>
                                                    <td className="text-muted" width="140">Nama Penerima</td>
                                                    <td>: <strong>{auth.user.name}</strong></td>
                                                </tr>
                                                <tr>
                                                    <td className="text-muted">Kurir Ekspedisi</td>
                                                    <td>: {transaction.courier_name?.toUpperCase()} ({transaction.courier_service})</td>
                                                </tr>
                                                <tr>
                                                    <td className="text-muted">Biaya Pengiriman</td>
                                                    <td>: Rp {Number(transaction.courier_cost || 0).toLocaleString('id-ID')}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <table className="table table-borderless table-sm mb-0">
                                            <tbody>
                                                <tr>
                                                    <td className="text-muted" width="140">Alamat Lengkap</td>
                                                    <td>: {transaction.address}</td>
                                                </tr>
                                                <tr>
                                                    <td className="text-muted">Grand Total</td>
                                                    <td>: <strong className="text-success fs-6">Rp {Number(transaction.grand_total).toLocaleString('id-ID')}</strong></td>
                                                </tr>
                                                {transaction.status === 'UNPAID' && transaction.payment_url && (
                                                    <tr>
                                                        <td className="text-muted">Pembayaran</td>
                                                        <td>: 
                                                            <a href={transaction.payment_url} target="_blank" rel="noreferrer" className="btn btn-sm btn-danger ms-1 px-3">
                                                                BAYAR SEKARANG via Duitku
                                                            </a>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Rincian Produk Yang Dibeli */}
                        <div className="card border-0 shadow-sm rounded-3">
                            <div className="card-header bg-light py-3">
                                <h6 className="fw-bold mb-0 text-dark">
                                    <i className="fa fa-box me-2"></i> Produk Yang Dibeli
                                </h6>
                            </div>
                            <div className="card-body p-0">
                                <div className="table-responsive">
                                    <table className="table table-striped align-middle mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th className="ps-3">Item Produk</th>
                                                <th>Varian Warna</th>
                                                <th>Ukuran</th>
                                                <th>Harga Satuan</th>
                                                <th>Qty</th>
                                                <th className="pe-3 text-end">Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {transaction.transaction_details?.map((detail) => (
                                                <tr key={detail.id}>
                                                    <td className="ps-3">
                                                        <div className="d-flex align-items-center">
                                                            {detail.product_image && (
                                                                <img 
                                                                    src={detail.product_image} 
                                                                    alt={detail.product?.title} 
                                                                    width="50" 
                                                                    className="rounded-2 me-3" 
                                                                />
                                                            )}
                                                            <span className="fw-bold text-dark">{detail.product?.title || 'Produk'}</span>
                                                        </div>
                                                    </td>
                                                    <td>{detail.color?.name || detail.color || '-'}</td>
                                                    <td><span className="badge bg-light text-dark border">{detail.size}</span></td>
                                                    <td>Rp {Number(detail.price).toLocaleString('id-ID')}</td>
                                                    <td>{detail.qty}</td>
                                                    <td className="pe-3 text-end fw-bold">
                                                        Rp {Number(detail.price * detail.qty).toLocaleString('id-ID')}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </LayoutWeb>
    );
}
