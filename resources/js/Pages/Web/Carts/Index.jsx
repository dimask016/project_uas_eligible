import React, { useState } from 'react';
import { usePage, Link, router, Head } from '@inertiajs/react';
import LayoutWeb from '../../../Layouts/Web';

export default function Index() {
    const { carts = [], dataCarts = {} } = usePage().props;

    // State Modal Edit Varian & Qty
    const [selectedCart, setSelectedCart] = useState(null);
    const [editColor, setEditColor] = useState('');
    const [editColorImage, setEditColorImage] = useState('');
    const [editSize, setEditSize] = useState('');
    const [editQty, setEditQty] = useState(1);
    const [showModal, setShowModal] = useState(false);

    // Buka Modal & Pre-fill Data Varian
    const handleOpenEdit = (cart) => {
        setSelectedCart(cart);
        setEditColor(cart.color || '');
        // Ambil nama file murni saja
        const rawColorImg = cart.color_image ? cart.color_image.split('/').pop() : '';
        setEditColorImage(rawColorImg);
        setEditSize(cart.size || '');
        setEditQty(cart.qty || 1);
        setShowModal(true);
    };

    // Handler Update Varian & Qty
    const handleUpdateCart = (e) => {
        e.preventDefault();
        if (!selectedCart) return;

        router.post(`/cart/update/${selectedCart.id}`, {
            color: editColor,
            color_image: editColorImage,
            size: editSize,
            qty: editQty,
        }, {
            onSuccess: () => setShowModal(false)
        });
    };

    // Handler Hapus Item
    const handleDeleteCart = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus produk ini dari keranjang?')) {
            router.post('/cart/delete', { id });
        }
    };

    return (
        <LayoutWeb>
            <Head title="Keranjang Belanja - 2R STORE" />

            <div className="container my-5 pt-4">
                <div className="row justify-content-center">
                    <div className="col-md-10">
                        <div className="card border-0 shadow-sm rounded-3">
                            <div className="card-body p-4">
                                <h4 className="fw-bold mb-4 text-dark">
                                    <i className="fa fa-shopping-cart me-2"></i> Keranjang Belanja
                                </h4>

                                {carts.length > 0 ? (
                                    <>
                                        {/* Daftar Item Keranjang */}
                                        <div className="d-flex flex-column gap-3 mb-4">
                                            {carts.map((cart) => (
                                                <div key={cart.id} className="card border p-3 rounded-3 shadow-sm">
                                                    <div className="row align-items-center">
                                                        <div className="col-md-2 col-4">
                                                            <img
                                                                src={cart.product_image || cart.product?.image || '/assets/images/placeholder.png'}
                                                                alt={cart.product?.title || 'Produk'}
                                                                className="img-fluid rounded-3"
                                                                style={{ maxHeight: '100px', width: '100%', objectFit: 'cover' }}
                                                                onError={(e) => {
                                                                    e.target.onerror = null;
                                                                    e.target.src = '/assets/images/placeholder.png';
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="col-md-6 col-8">
                                                            <h5 className="fw-bold mb-1">{cart.product?.title || 'Produk'}</h5>
                                                            <div className="small text-muted mb-1">
                                                                <span>Qty: <strong>{cart.qty}</strong></span> | <span>Size: <strong>{cart.size || '-'}</strong></span>
                                                            </div>
                                                            <div className="small text-muted mb-2 d-flex align-items-center gap-1">
                                                                <span>Color:</span>
                                                                {cart.color_image && (
                                                                    <img 
                                                                        src={cart.color_image} 
                                                                        width="18" 
                                                                        height="18" 
                                                                        className="rounded-circle border"
                                                                        alt={cart.color} 
                                                                        onError={(e) => {
                                                                            e.target.style.display = 'none';
                                                                        }}
                                                                    />
                                                                )}
                                                                <strong className="ms-1">{cart.color || '-'}</strong>
                                                            </div>
                                                            <div className="fw-bold text-danger">
                                                                Rp {new Intl.NumberFormat('id-ID').format(Number(cart.price) || 0)}
                                                            </div>
                                                        </div>
                                                        
                                                        {/* Tombol Action Edit & Hapus */}
                                                        <div className="col-md-4 text-end mt-3 mt-md-0 d-flex justify-content-end gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleOpenEdit(cart)}
                                                                className="btn btn-warning text-white btn-sm rounded-2"
                                                                title="Edit Varian & Qty"
                                                            >
                                                                <i className="fa fa-pencil-alt"></i>
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleDeleteCart(cart.id)}
                                                                className="btn btn-danger btn-sm rounded-2"
                                                                title="Hapus"
                                                            >
                                                                <i className="fa fa-trash"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Total Orders & Next Payment */}
                                        <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                                            <div className="fs-5 fw-bold">
                                                Total Orders: <span className="text-danger">
                                                    Rp {new Intl.NumberFormat('id-ID').format(
                                                        Number(dataCarts?.price) || carts.reduce((acc, item) => acc + Number(item.price || 0), 0)
                                                    )}
                                                </span>
                                            </div>
                                            <Link
                                                href="/checkout"
                                                className="btn btn-primary fw-bold px-4 py-2 rounded-3"
                                                style={{ backgroundColor: '#8B4513', borderColor: '#8B4513' }}
                                            >
                                                Next Payment <i className="fa fa-long-arrow-alt-right ms-2"></i>
                                            </Link>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-5">
                                        <img src="/assets/images/shopping-cart.png" width="120" className="img-fluid mb-3" alt="Empty Cart" />
                                        <h5 className="text-muted fw-semibold">Shopping Carts is Empty 😁</h5>
                                        <Link href="/products" className="btn btn-primary mt-3 rounded-3" style={{ backgroundColor: '#8B4513', borderColor: '#8B4513' }}>
                                            Mulai Belanja
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Edit Warna, Ukuran & Jumlah */}
            {showModal && selectedCart && (
                <div className="modal d-block tab-index-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow">
                            <div className="modal-header">
                                <h5 className="modal-title fw-bold">Edit Varian Produk</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <form onSubmit={handleUpdateCart}>
                                <div className="modal-body">

                                    {/* Edit Warna */}
                                    {selectedCart.product?.colors && selectedCart.product.colors.length > 0 && (
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold">Pilih Warna:</label>
                                            <div className="d-flex gap-2 flex-wrap">
                                                {selectedCart.product.colors.map((c, idx) => (
                                                    <button
                                                        key={idx}
                                                        type="button"
                                                        className={`btn btn-sm ${editColor === c.color ? 'btn-dark' : 'btn-outline-dark'}`}
                                                        onClick={() => {
                                                            setEditColor(c.color);
                                                            // Ambil nama file murni tanpa URL domain
                                                            const cleanImg = c.image ? c.image.split('/').pop() : '';
                                                            setEditColorImage(cleanImg);
                                                        }}
                                                    >
                                                        {c.color}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Edit Ukuran */}
                                    {selectedCart.product?.sizes && selectedCart.product.sizes.length > 0 && (
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold">Pilih Ukuran:</label>
                                            <div className="d-flex gap-2 flex-wrap">
                                                {selectedCart.product.sizes.map((s, idx) => (
                                                    <button
                                                        key={idx}
                                                        type="button"
                                                        className={`btn btn-sm ${editSize === s.size ? 'btn-dark' : 'btn-outline-dark'}`}
                                                        onClick={() => setEditSize(s.size)}
                                                    >
                                                        {s.size}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Edit Qty */}
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Jumlah (Qty):</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            min="1"
                                            value={editQty}
                                            onChange={(e) => setEditQty(parseInt(e.target.value) || 1)}
                                            required
                                        />
                                    </div>

                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary rounded-2" onClick={() => setShowModal(false)}>
                                        Batal
                                    </button>
                                    <button type="submit" className="btn btn-primary rounded-2" style={{ backgroundColor: '#8B4513', borderColor: '#8B4513' }}>
                                        Simpan Perubahan
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </LayoutWeb>
    );
}