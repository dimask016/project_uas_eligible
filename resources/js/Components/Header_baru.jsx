import React from 'react';
import { usePage, Link, router } from '@inertiajs/react';

export default function Header() {
    // Gunakan fallback objek kosong agar tidak error jika props belum ter-load
    const { auth = {}, dataCarts = {} } = usePage().props || {};

    // Handler untuk Logout
    const handleLogout = (e) => {
        e.preventDefault();
        router.post('/logout');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#8B4513' }}>
            <div className="container">
                {/* Brand / Logo */}
                <Link href="/" className="navbar-brand d-flex align-items-center fw-bold text-white fs-4">
                    <img 
                        src="/assets/images/logo.png" 
                        alt="2R STORE Logo" 
                        style={{ height: '40px', width: 'auto' }} 
                        className="me-2"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/logo.png';
                        }}
                    />
                    2R STORE
                </Link>

                <div className="d-flex align-items-center ms-auto">
                    {/* Tombol Keranjang Belanja */}
                    <Link href="/carts" className="btn btn-outline-light position-relative border-0 me-3">
                        <i className="fa fa-shopping-cart fs-4"></i>
                        {dataCarts && dataCarts.total > 0 && (
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                {dataCarts.total}
                            </span>
                        )}
                    </Link>

                    {/* Area User Auth / Guest */}
                    {auth && auth.user ? (
                        <div className="dropdown">
                            <button
                                className="btn btn-outline-light dropdown-toggle border-0 fw-semibold text-white d-flex align-items-center"
                                type="button"
                                id="userDropdown"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <i className="fa fa-user-circle fs-5 me-2"></i>
                                <span>{auth.user.name}</span>
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2" aria-labelledby="userDropdown">
                                <li>
                                    <Link className="dropdown-item py-2" href="/account/dashboard">
                                        <i className="fa fa-tachometer-alt me-2 text-muted"></i> Dashboard Account
                                    </Link>
                                </li>
                                <li>
                                    <Link className="dropdown-item py-2" href="/account/transactions">
                                        <i className="fa fa-shopping-cart me-2 text-muted"></i> My Orders
                                    </Link>
                                </li>
                                <li><hr className="dropdown-divider" /></li>
                                <li>
                                    <button className="dropdown-item py-2 text-danger fw-semibold" onClick={handleLogout}>
                                        <i className="fa fa-sign-out-alt me-2"></i> Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    ) : (
                        <div className="d-flex align-items-center">
                            <Link href="/login" className="btn btn-outline-light btn-sm me-2 rounded-3">
                                Login
                            </Link>
                            <Link href="/register" className="btn btn-light btn-sm text-dark fw-semibold rounded-3">
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
