//import react  
import React, { useState } from "react";

//import layout
import LayoutAccount from '../../../Layouts/Account';

//import Head, usePage and router
import { Head, usePage, router } from '@inertiajs/react';

//import component pagination
import Pagination from '../../../Shared/Pagination';

//import component delete
import Delete from '../../../Shared/Delete';

//import Sweet Alert
import Swal from 'sweetalert2';

export default function ProductShow() {

    //destruct props "product", "colors" & "errors"
    const { product, colors, errors } = usePage().props;

    //define state
    const [colorID, setColorID] = useState('');
    const [image, setImage] = useState(null);

    // Helper URL Gambar (Mencegah double path & menangani hash file storage)
    const getImageUrl = (imagePath, defaultFolder = 'products') => {
        if (!imagePath) return '/images/placeholder.png';
        if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;

        // Clean prefix storage/
        let cleanPath = imagePath.replace(/^\/?storage\//, '').replace(/\/storage\//, '/');

        if (cleanPath.startsWith('products/') || cleanPath.startsWith('colors/')) {
            return `/storage/${cleanPath}`;
        }

        return `/storage/${defaultFolder}/${cleanPath}`;
    };

    //method storeImage
    const storeImage = async (e) => {
        e.preventDefault();

        //sending data
        router.post('/account/products/store_image_product', {
            image: image,
            color_id: colorID,
            product_id: product.id
        }, {
            onSuccess: () => {
                //show alert
                Swal.fire({
                    title: 'Success!',
                    text: 'Data saved successfully!',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500
                });

                //reset state and form input file
                setImage(null);
                setColorID('');
                e.target.reset();
            }
        });
    }

    const handleReset = () => {
        setImage(null);
        setColorID('');
    };

    return (
        <>
            <Head>
                <title>Detail Product - Geek Store</title>
            </Head>
            <LayoutAccount>
                <div className="row mt-4">
                    <div className="col-12">
                        <div className="card border-0 rounded shadow-sm border-top-success">
                            <div className="card-header">
                                <span className="font-weight-bold"><i className="fa fa-shopping-bag"></i> Upload Product Image</span>
                            </div>
                            <div className="card-body">
                                <form onSubmit={storeImage} onReset={handleReset}>

                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Image</label>
                                        <input 
                                            type="file" 
                                            className="form-control" 
                                            onChange={(e) => setImage(e.target.files[0])} 
                                        />
                                    </div>
                                    {errors.image && (
                                        <div className="alert alert-danger">
                                            {errors.image}
                                        </div>
                                    )}

                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Color</label>
                                        <select 
                                            className="form-select" 
                                            value={colorID} 
                                            onChange={(e) => setColorID(e.target.value)}
                                        >
                                            <option value="">-- Select Color --</option>
                                            {
                                                colors.map((color) => (
                                                    <option value={color.id} key={color.id}>{color.name}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                    {errors.color_id && (
                                        <div className="alert alert-danger">
                                            {errors.color_id}
                                        </div>
                                    )}

                                    <div>
                                        <button type="submit" className="btn btn-md btn-success me-2"><i className="fa fa-save"></i> Save</button>
                                        <button type="reset" className="btn btn-md btn-warning"><i className="fa fa-redo"></i> Reset</button>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="row mt-4">
                    <div className="col-12">
                        <div className="card border-0 rounded shadow-sm border-top-success">
                            <div className="card-header">
                                <span className="font-weight-bold"><i className="fa fa-shopping-bag"></i> Product Image</span>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table table-bordered table-striped table-hovered align-middle">
                                        <thead>
                                            <tr>
                                                <th scope="col" style={{ width: '5%' }} className="text-center">No.</th>
                                                <th scope="col" style={{ width: '20%' }} className="text-center">Image</th>
                                                <th scope="col" style={{ width: '15%' }} className="text-center">Color</th>
                                                <th scope="col" style={{ width: '15%' }} className="text-center">Color Name</th>
                                                <th scope="col" style={{ width: '15%' }} className="text-center">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {product.product_images && product.product_images.data.length > 0 ? (
                                                product.product_images.data.map((img, index) => (
                                                    <tr key={index}>
                                                        <td className="text-center">
                                                            {++index + (product.product_images.current_page - 1) * product.product_images.per_page}
                                                        </td>
                                                        <td className="text-center">
                                                            <img 
                                                                src={getImageUrl(img.image, 'products')} 
                                                                width={'150'} 
                                                                className="rounded-3 shadow-sm" 
                                                                alt="Product"
                                                            />
                                                        </td>
                                                        <td className="text-center">
                                                            <img 
                                                                src={getImageUrl(img.color?.image, 'colors')} 
                                                                width={'30'} 
                                                                height={'30'}
                                                                className="rounded-circle shadow-sm" 
                                                                alt="Color Icon"
                                                            />
                                                        </td>
                                                        <td className="text-center fw-bold">
                                                            {img.color?.name || '-'}
                                                        </td>
                                                        <td className="text-center">
                                                            <Delete URL={'/account/products/destroy_image_product'} id={img.id} />
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="5" className="text-center text-muted py-3">
                                                        Belum ada gambar untuk produk ini.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                
                                {product.product_images && (
                                    <Pagination links={product.product_images.links} align={'end'}/>
                                )}

                            </div>
                        </div>
                    </div>
                </div>
            </LayoutAccount>
        </>
    )
}
