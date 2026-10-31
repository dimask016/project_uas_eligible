//import React
import React from "react";

//import Link
import { Link } from '@inertiajs/react';

//import formatPrice
import FormatPrice from '../Utils/FormatPrice';

export default function CardProduct({ product }) {

    /**
     * Helper function untuk memformat URL Gambar agar tidak double prefix / error path
     */
    const getImageUrl = (imagePath, folder = 'products') => {
        if (!imagePath) return "/assets/images/image.png";
        
        // 1. Jika URL sudah berupa HTTP/HTTPS penuh dari database
        if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
            return imagePath;
        }

        // 2. Jika path sudah diawali /storage/
        if (imagePath.startsWith("/storage/")) {
            return imagePath;
        }

        // 3. Format standar path publik Laravel
        return `/storage/${folder}/${imagePath}`;
    };

    return (
        <>
            <div className="col-md-6 mb-4 col-6">
                <Link href={`/products/${product.slug}`} className="text-dark text-decoration-none">
                    <div className="card border-0 h-100 rounded-3 shadow-sm product">
                        <div className="card-image">
                            {product.product_images && product.product_images.length > 0 ? (
                                <img 
                                    src={getImageUrl(product.product_images[0].image, 'products')} 
                                    className="w-100 rounded-top"
                                    alt={product.title}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "/assets/images/image.png";
                                    }}
                                />
                            ) : (
                                <img src="/assets/images/image.png" className="w-100 rounded-top" alt="Placeholder" />
                            )}
                        </div>
                        <div className="card-body h-100">
                            <h6 className="card-title text-center title-book">{product.title}</h6>
                            
                            {/* Available Colors */}
                            {product.product_images && product.product_images.length > 0 && (
                                <div className="colors mt-4">
                                    <i>Available Colors</i>
                                    <div className="mt-2">
                                        {product.product_images.map((color, index) => (
                                            color.color?.image && (
                                                <img 
                                                    src={getImageUrl(color.color.image, 'colors')} 
                                                    key={index} 
                                                    width={'20'} 
                                                    height={'20'}
                                                    className="rounded-circle me-2 shadow-sm"
                                                    alt="Color Option"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none'; // Sembunyikan jika gambar warna gagal dimuat
                                                    }}
                                                />
                                            )
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="card-footer">
                            <div className="row justify-content-between">
                                <div className="col-md-6 col-12 text-start final-price">
                                    <strong>
                                        Rp. {product.product_sizes && product.product_sizes.length > 0 
                                            ? FormatPrice(product.product_sizes[0].price) 
                                            : FormatPrice(product.price || 0)}
                                    </strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
            </div>
        </>
    );
}