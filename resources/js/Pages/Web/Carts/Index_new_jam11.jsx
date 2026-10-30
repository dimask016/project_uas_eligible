//import React
import React from "react";

//import layout web
import LayoutWeb from '../../../Layouts/Web';

//import Head, usePage, router
import { Head, usePage, router } from '@inertiajs/react';

//import component delete
import Delete from '../../../Shared/Delete';

export default function CartIndex() {

    //destruct props "auth", "dataCarts", dan "carts"
    const { auth, dataCarts, carts } = usePage().props;

    //fallback array jika carts bernilai null/undefined
    const cartList = carts || [];

    // Helper fungsi format rupiah aman (mencegah NaN)
    const formatRupiah = (number) => {
        const val = Number(number);
        if (isNaN(val)) return "Rp 0";
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0
        }).format(val);
    };

    // Handler klik Next Payment
    const handleNextPayment = () => {
        // Cek apakah user sudah login
        if (!auth || !auth.user) {
            // Jika belum login, redirect ke halaman login
            return router.visit('/login');
        }

        // Jika sudah login, lanjut ke checkout
        router.visit('/checkouts');
    };

    return (
        <>
            <Head>
                <title>Carts - 2R STORE</title>
            </Head>
            <LayoutWeb>

                <div className="container mt-80 mb-5">
                    <div className="fade-in">
                        <div className="row justify-content-center">
                            <div className="col-md-8">

                                {cartList.length > 0 ? (
                                    <div className="row mb-2">
                                        <div className="col-md-12">
                                            <div className="card border-0 shadow-sm rounded-3 mb-3">
                                                <div className="card-body">
                                                    {cartList.map((cart, index) => (
                                                        <div key={index}>
                                                            <div className="row g-0 align-items-center">
                                                                {/* Gambar Produk */}
                                                                <div className="col-md-4 col-4">
                                                                    <img 
                                                                        src={cart.product_image} 
                                                                        className="img-fluid rounded-3" 
                                                                        alt={cart.product?.title || 'Product Image'} 
                                                                    />
                                                                </div>
                                                                <div className="col-md-8 col-8">
                                                                    <div className="card-body">
                                                                        <h4 className="card-title">{cart.product?.title}</h4>

                                                                        <div className="row mt-3">
                                                                            <div className="col-md-4 col-6">
                                                                                <div>
                                                                                    Qty : <strong>{cart.qty}</strong>
                                                                                </div>
                                                                                <div className="mt-2">
                                                                                    Size : <strong>{cart.size}</strong>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-md-5 col-6">
                                                                                <div>
                                                                                    Color : <img src={cart.color_image} width={'20'} height={'20'} className="rounded-circle mb-1 ms-1" alt={cart.color} />
                                                                                </div>
                                                                                <div className="mt-2">
                                                                                    Color Name : <strong>{cart.color}</strong>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-md-3 col-12 text-end mt-2 mt-md-0">
                                                                                <Delete URL={'/carts'} id={cart.id} />
                                                                            </div>
                                                                        </div>

                                                                        <hr />

                                                                        <h5 className="fw-bold text-success">
                                                                            {formatRupiah(cart.price)}
                                                                        </h5>

                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {index !== cartList.length - 1 && <hr />}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="card border-0 rounded-3 shadow-sm mt-4 mb-4">
                                        <div className="card-body">
                                            <div className="col-sm-12 empty-cart-cls text-center">
                                                <img src="/assets/images/shopping-cart.png" width="150" height="150" className="img-fluid mb-4" alt="Empty Cart" />
                                                <h6><strong>Shopping Carts is Empty 😁</strong></h6>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="row mb-5">
                                    <div className="col-md-12">
                                        <div className="card border-0 rounded-3 shadow-sm">
                                            <div className="card-body">
                                                <h6 className="mb-0">
                                                    Total Orders : <strong>{formatRupiah(dataCarts?.price)}</strong>
                                                </h6>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12 mt-4">
                                        <button 
                                            onClick={handleNextPayment} 
                                            className="btn text-white btn-md border-0 shadow rounded-3 w-100"
                                            style={{ backgroundColor: '#8B4513' }}
                                            disabled={cartList.length === 0}
                                        >
                                            Next Payment <i className="fa fa-long-arrow-alt-right ms-1"></i>
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

            </LayoutWeb>
        </>
    );
}
