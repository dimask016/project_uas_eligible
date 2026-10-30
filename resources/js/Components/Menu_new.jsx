import React from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function Menu() {
    const { url = '' } = usePage();

    return (
        <nav className="navbar fixed-bottom navbar-light bg-white border-top shadow-sm d-md-none">
            <div className="container-fluid d-flex justify-content-around text-center py-1">
                {/* 1. Home / Beranda */}
                <Link 
                    href="/" 
                    className={`text-decoration-none ${url === '/' ? 'text-danger fw-bold' : 'text-secondary'}`}
                >
                    <i className="fa fa-home d-block fs-5"></i>
                    <small style={{ fontSize: '11px' }}>Home</small>
                </Link>

                {/* 2. Live Video */}
                <Link 
                    href="/live" 
                    className={`text-decoration-none ${url.startsWith('/live') ? 'text-danger fw-bold' : 'text-secondary'}`}
                >
                    <i className="fa fa-video d-block fs-5"></i>
                    <small style={{ fontSize: '11px' }}>Live Video</small>
                </Link>

                {/* 3. Notifikasi */}
                <Link 
                    href="/notifications" 
                    className={`text-decoration-none ${url.startsWith('/notifications') ? 'text-danger fw-bold' : 'text-secondary'}`}
                >
                    <i className="fa fa-bell d-block fs-5"></i>
                    <small style={{ fontSize: '11px' }}>Notifikasi</small>
                </Link>

                {/* 4. Saya (Profil) */}
                <Link 
                    href="/account/dashboard" 
                    className={`text-decoration-none ${url.startsWith('/account') ? 'text-danger fw-bold' : 'text-secondary'}`}
                >
                    <i className="fa fa-user-circle d-block fs-5"></i>
                    <small style={{ fontSize: '11px' }}>Saya</small>
                </Link>
            </div>
        </nav>
    );
}
