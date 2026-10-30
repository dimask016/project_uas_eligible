import React from 'react';
import { Link, usePage, router } from '@inertiajs/react';

export default function Header() {
    // Ambil auth dari Inertia shared props
    const { auth, totalCart } = usePage().props;

    const handleLogout = (e) => {
        e.preventDefault();
        router.post('/logout');
    };

    return (
        <nav className="navbar navbar-expand-md navbar-dark fixed-top" style={{ backgroundColor: '#8B4513' }}>
            <div className="container">
                {/* Brand Logo */}
                <Link className="navbar-brand fw-bold" href="/">
                    <i className="fa fa-shopping-bag me-2"></i> 2R STORE
                </Link>

                <div className="d-flex align-items-center ms-auto">
                    {/* Cart Icon Badge */}
                    <Link href="/carts" className="btn btn-transparent text-white me-3 position-relative">
                        <i className="fa fa-shopping-cart fa-lg"></i>
                        {totalCart > 0 && (
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                {totalCart}
                            </span>
                        )}
                    </Link>

                    {/* Pengecekan Status Login User */}
                    {auth && auth.user ? (
                        /* Tampilan Pojok Kanan Atas saat Customer Login */
                        <div className="dropdown">
                            <button
                                className="btn btn-outline-light dropdown-toggle border-0 fw-semibold"
                                type="button"
                                id="userDropdown"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <i className="fa fa-user-circle me-1"></i> {auth.user.name}
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end shadow border-0" aria-labelledby="userDropdown">
                                <li>
                                    <Link className="dropdown-item" href="/account/dashboard">
                                        <i className="fa fa-tachometer-alt me-2 text-muted"></i> Dashboard Account
                                    </Link>
                                </li>
                                <li>
                                    <Link className="dropdown-item" href="/account/transactions">
                                        <i className="fa fa-shopping-cart me-2 text-muted"></i> My Orders
                                    </Link>
                                </li>
                                <li><hr className="dropdown-divider" /></li>
                                <li>
                                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                                        <i className="fa fa-sign-out-alt me-2"></i> Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    ) : (
                        /* Tampilan saat Guest / Belum Login */
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
