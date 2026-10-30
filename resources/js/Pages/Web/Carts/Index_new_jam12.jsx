//import React
import React from "react";

//import layout web
import LayoutWeb from "../../../Layouts/Web";

//import Head, Link, router
import { Head, Link, router } from "@inertiajs/react";

//import formatPrice
import FormatPrice from "../../../Utils/FormatPrice";

//import Sweet Alert
import Swal from "sweetalert2";

export default function CartIndex({ carts, totalPrice }) {

    // Method Edit Item (Quantity, Color, & Size)
    const handleEditCart = (cart) => {
        const productSizes = cart.product?.productSizes || cart.product?.product_sizes || [];
        const productImages = cart.product?.productImages || cart.product?.product_images || [];

        const sizeOptionsHtml = productSizes.length > 0
            ? productSizes.map(s => `<option value="${s.size}" ${s.size === cart.size ? 'selected' : ''}>${s.size} (Rp ${FormatPrice(s.price)})</option>`).join('')
            : `<option value="${cart.size}">${cart.size}</option>`;

        const colorOptionsHtml = productImages.length > 0
            ? productImages.map(img => `<option value="${img.color?.name}" ${img.color?.name === cart.color ? 'selected' : ''}>${img.color?.name}</option>`).join('')
            : `<option value="${cart.color}">${cart.color}</option>`;

        Swal.fire({
            title: "Edit Item Keranjang",
            html: `
                <div class="text-start mb-3">
                    <label class="form-label fw-bold">Jumlah (Qty)</label>
                    <input type="number" id="swal-input-qty" class="form-control" value="${cart.qty}" min="1">
                </div>
                <div class="text-start mb-3">
                    <label class="form-label fw-bold">Ukuran (Size)</label>
                    <select id="swal-input-size" class="form-select">
                        ${sizeOptionsHtml}
                    </select>
                </div>
                <div class="text-start mb-3">
                    <label class="form-label fw-bold">Warna (Color)</label>
                    <select id="swal-input-color" class="form-select">
                        ${colorOptionsHtml}
                    </select>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: "Simpan Perubahan",
            confirmButtonColor: "#8B4513",
            cancelButtonColor: "#6c757d",
            preConfirm: () => {
                const qty = document.getElementById("swal-input-qty").value;
                const size = document.getElementById("swal-input-size").value;
                const color = document.getElementById("swal-input-color").value;

                if (!qty || qty < 1) {
                    Swal.showValidationMessage("Jumlah minimal 1!");
                    return false;
                }

                return { qty, size, color };
            },
        }).then((result) => {
            if (result.isConfirmed) {
                router.put(`/carts/${cart.id}`, {
                    qty: result.value.qty,
                    size: result.value.size,
                    color: result.value.color,
                }, {
                    onSuccess: () => {
                        Swal.fire({
                            title: "Berhasil!",
                            text: "Item keranjang berhasil diperbarui.",
                            icon: "success",
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }
                });
            }
        });
    };

    // Method Delete Cart
    const handleDeleteCart = (id) => {
        Swal.fire({
            title: "Apakah Anda Yakin?",
            text: "Item ini akan dihapus dari keranjang belanja!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Ya, Hapus!",
            cancelButtonText: "Batal"
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/carts/${id}`, {
                    onSuccess: () => {
                        Swal.fire({
                            title: "Deleted!",
                            text: "Item berhasil dihapus.",
                            icon: "success",
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }
                });
            }
        });
    };

    return (
        <>
            <Head>
                <title>Shopping Cart - 2R STORE</title>
            </Head>
            <LayoutWeb>
                <div className="container mt-55 mb-5">
                    <div className="row justify-content-center">
                        <div className="col-md-8">
                            <div className="card border-0 rounded shadow-sm p-3 mb-3">
                                {carts && carts.length > 0 ? (
                                    carts.map((cart, index) => (
                                        <div key={index} className="row align-items-center mb-3 pb-3 border-bottom">
                                            <div className="col-md-4 col-4">
                                                <img
                                                    src={cart.product_image}
                                                    className="img-fluid rounded-3"
                                                    alt={cart.product?.title}
                                                />
                                            </div>
                                            <div className="col-md-8 col-8">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <h5 className="mb-0">{cart.product?.title}</h5>
                                                    
                                                    {/* Tombol Aksi: Edit & Delete */}
                                                    <div>
                                                        <button
                                                            onClick={() => handleEditCart(cart)}
                                                            className="btn btn-warning btn-sm me-2 text-white shadow-sm"
                                                            title="Edit Item"
                                                        >
                                                            <i className="fa fa-pencil"></i>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteCart(cart.id)}
                                                            className="btn btn-danger btn-sm shadow-sm"
                                                            title="Hapus Item"
                                                        >
                                                            <i className="fa fa-trash"></i>
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="row mt-2 fs-6">
                                                    <div className="col-6">
                                                        <span>Qty : {cart.qty}</span><br />
                                                        <span>Size : {cart.size}</span>
                                                    </div>
                                                    <div className="col-6">
                                                        <span>
                                                            Color : {" "}
                                                            <span 
                                                                className="badge rounded-circle p-2" 
                                                                style={{ backgroundColor: cart.color }}
                                                            > </span>
                                                        </span><br />
                                                        <span>Color Name : {cart.color}</span>
                                                    </div>
                                                </div>
                                                <div className="mt-3">
                                                    <strong className="text-danger fs-5">
                                                        Rp {FormatPrice(cart.price)}
                                                    </strong>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center p-4">
                                        <h5>Shopping Cart is Empty 🛒</h5>
                                    </div>
                                )}
                            </div>

                            {/* Section Total Orders & Checkout Button */}
                            <div className="card border-0 rounded shadow-sm p-3">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <span className="fw-bold fs-5 me-2">Total Orders :</span>
                                        <span className="fw-bold fs-5 text-success">
                                            Rp {FormatPrice(totalPrice)}
                                        </span>
                                    </div>
                                    {carts && carts.length > 0 && (
                                        <Link 
                                            href="/checkout" 
                                            className="btn btn-success fw-bold px-4 py-2 shadow-sm"
                                            style={{ backgroundColor: "#8B4513", borderColor: "#8B4513" }}
                                        >
                                            Next Payment <i className="fa fa-long-arrow-right ms-2"></i>
                                        </Link>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </LayoutWeb>
        </>
    );
}
