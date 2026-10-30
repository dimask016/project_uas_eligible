import React from "react";
import Header from '../Components/Header';
import Menu from '../Components/Menu';

export default function LayoutWeb({ children }) {
    return (
        <div style={{ backgroundColor: '#F9F6F0', minHeight: '100vh', paddingBottom: '70px' }}>
            {/* Header / Navbar Atas */}
            <Header />

            {/* Konten Utama (Slider, Category, Products, Search) */}
            <main className="main pt-5">
                {children}
            </main>

            {/* Menu Navigasi Bawah */}
            <Menu />
        </div>
    );
}
