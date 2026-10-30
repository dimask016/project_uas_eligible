import React, { useState } from 'react';
import LayoutWeb from '../../../Layouts/Web';
import { Head, Link, router } from '@inertiajs/react';

export default function HomeIndex({ sliders = [], categories = [], products = [] }) {
    const [search, setSearch] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim()) {
            router.get(`/products?q=${encodeURIComponent(search)}`);
        }
    };

    const formatRupiah = (number) => {
        const val = Number(number);
        if (isNaN(val)) return "Rp 0";
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0
        }).format(val);
    };

    return (
        <LayoutWeb>
            <Head>
                <title>2R STORE - Storefront Catalog</title>
            </Head>

            <div className="container mt-4 mb-5">
                {/* Search Bar Section */}
                <div className="row mb-4">
                    <div className="col-md-12">
                        <form onSubmit={handleSearch} className="d-flex shadow-sm rounded-3 overflow-hidden">
                            <input
                                type="text"
                                className="form-control border-0 py-2 px-3"
                                placeholder="Cari produk impianmu di 2R STORE..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <button type="submit" className="btn text-white px-4" style={{ backgroundColor: '#8B4513' }}>
                                <i className="fa fa-search me-1"></i> Cari
                            </button>
                        </form>
                    </div>
                </div>

                {/* Slider / Carousel Banner Section */}
                {sliders && sliders.length > 0 && (
                    <div className="row mb-4">
                        <div className="col-md-12">
                            <div id="homeCarousel" className="carousel slide shadow-sm rounded-3 overflow-hidden" data-bs-ride="carousel">
                                <div className="carousel-inner">
                                    {sliders.map((slider, index) => (
                                        <div key={slider.id || index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                            <img 
                                                src={slider.image} 
                                                className="d-block w-100" 
                                                alt={slider.title || 'Slider'} 
                                                style={{ maxHeight: '380px', objectFit: 'cover' }} 
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Category Section */}
                {categories && categories.length > 0 && (
                    <div className="row mb-4">
                        <div className="col-md-12">
                            <h5 className="fw-bold mb-3 text-dark">Kategori Pilihan</h5>
                            <div className="row g-2">
                                {categories.map((category) => (
                                    <div key={category.id} className="col-3 col-md-2">
                                        <Link href={`/categories/${category.slug}`} className="text-decoration-none">
                                            <div className="card border-0 shadow-sm rounded-3 text-center p-2 bg-white h-100">
                                                <img 
                                                    src={category.image} 
                                                    alt={category.name} 
                                                    className="img-fluid mx-auto mb-2" 
                                                    style={{ maxHeight: '45px', objectFit: 'contain' }} 
                                                />
                                                <small className="fw-bold text-dark d-block text-truncate">{category.name}</small>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Product Section */}
                <div className="row">
                    <div className="col-md-12">
                        <h5 className="fw-bold mb-3 text-dark">Produk Terbaru</h5>
                        <div className="row g-3">
                            {products && products.length > 0 ? (
                                products.map((product) => (
                                    <div key={product.id} className="col-6 col-md-3">
                                        <div className="card border-0 shadow-sm rounded-3 h-100 bg-white">
                                            <img 
                                                src={product.image} 
                                                className="card-img-top rounded-top-3" 
                                                alt={product.title} 
                                                style={{ height: '190px', objectFit: 'cover' }} 
                                            />
                                            <div className="card-body d-flex flex-column justify-content-between p-3">
                                                <div>
                                                    <h6 className="card-title fw-bold text-dark text-truncate mb-1">{product.title}</h6>
                                                    <span className="fw-bold text-success fs-6">{formatRupiah(product.price)}</span>
                                                </div>
                                                <Link 
                                                    href={`/products/${product.slug}`} 
                                                    className="btn text-white btn-sm mt-3 border-0 w-100 fw-semibold rounded-2" 
                                                    style={{ backgroundColor: '#8B4513' }}
                                                >
                                                    Detail Produk
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
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
        </LayoutWeb>
    );
}
