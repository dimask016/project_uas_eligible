//import React & useState
import React, { useState } from 'react';

//import layout web
import LayoutWeb from '../../../Layouts/Web';

//import Head, Link, router, usePage
import { Head, Link, router, usePage } from '@inertiajs/react';

//import component slider
import Slider from '../../../Components/Slider';

//import component card category
import CardCategory from '../../../Shared/CardCategory';

//import component card product
import CardProduct from '../../../Shared/CardProduct';

export default function HomeIndex(props) {
    // Tangkap props dari parameter atau usePage() sebagai fallback
    const pageProps = usePage().props;
    const sliders = props.sliders || pageProps.sliders || [];
    const categories = props.categories || pageProps.categories || [];
    const products = props.products || pageProps.products || [];

    // State untuk form pencarian
    const [search, setSearch] = useState('');

    // Method submit pencarian
    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim()) {
            router.get(`/products?q=${encodeURIComponent(search)}`);
        }
    };

    return (
        <LayoutWeb>
            <Head>
                <title>2R STORE - Storefront Catalog</title>
            </Head>

            <div className="container mt-4 mb-5">
                <div className="fade-in">
                    
                    {/* Search Bar Section */}
                    <div className="row mb-4 justify-content-center">
                        <div className="col-md-12">
                            <form onSubmit={handleSearch} className="d-flex shadow-sm rounded-3 overflow-hidden">
                                <input
                                    type="text"
                                    className="form-control border-0 py-2 px-3"
                                    placeholder="Cari produk impianmu di 2R STORE..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <button 
                                    type="submit" 
                                    className="btn text-white px-4 fw-semibold" 
                                    style={{ backgroundColor: '#8B4513', borderColor: '#8B4513' }}
                                >
                                    <i className="fa fa-search me-1"></i> Cari
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Slider / Carousel Banner Section */}
                    {sliders && sliders.length > 0 && (
                        <div className="row mb-4">
                            <div className="col-md-12">
                                <Slider sliders={sliders} />
                            </div>
                        </div>
                    )}

                    {/* Categories Section */}
                    {categories && categories.length > 0 && (
                        <div className="row mb-4">
                            <div className="col-md-12">
                                <div className="row justify-content-between mb-3 align-items-center">
                                    <div className="col-6 text-start">
                                        <h5 className="fw-bold mb-0 text-dark">Kategori Pilihan</h5>
                                    </div>
                                    <div className="col-6 text-end">
                                        <Link href="/categories" className="text-dark text-decoration-none small">
                                            <strong>Lihat Semua <i className="fa fa-long-arrow-alt-right ms-1"></i></strong>
                                        </Link>
                                    </div>
                                </div>

                                <div className="row g-2 justify-content-start">
                                    {categories.map((category, index) => (
                                        <CardCategory category={category} key={category.id || index} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Products Section */}
                    <div className="row">
                        <div className="col-md-12">
                            <div className="row justify-content-between mb-3 align-items-center">
                                <div className="col-6 text-start">
                                    <h5 className="fw-bold mb-0 text-dark">Produk Terbaru</h5>
                                </div>
                                <div className="col-6 text-end">
                                    <Link href="/products" className="text-dark text-decoration-none small">
                                        <strong>Lihat Semua <i className="fa fa-long-arrow-alt-right ms-1"></i></strong>
                                    </Link>
                                </div>
                            </div>

                            <div className="row g-3">
                                {products && products.length > 0 ? (
                                    products.map((product, index) => (
                                        <CardProduct product={product} key={product.id || index} />
                                    ))
                                ) : (
                                    <div className="col-12 text-center py-5 bg-white rounded-3 shadow-sm">
                                        <p className="text-muted mb-0">Belum ada produk yang tersedia saat ini.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </LayoutWeb>
    );
}