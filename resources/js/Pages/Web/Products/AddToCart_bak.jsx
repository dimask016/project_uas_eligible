//import React
import React from "react";

//import usePage and router
import { usePage, router } from '@inertiajs/react';

//import Sweet Alert
import Swal from 'sweetalert2';

export default function AddToCart({ product_id, productImage, color, colorImage, size, price, weight }) {

    //destruct props "auth"
    const { auth } = usePage().props;

    //method addToCart
    const addToCart = () => {

        //check user is logged in
        if (!auth.user) {

            //show alert lalu redirect ke login setelah alert selesai/ditutup
            Swal.fire({
                title: 'Oopss!',
                text: 'Please login first!',
                icon: 'error',
                showConfirmButton: false,
                timer: 2000
            }).then(() => {
                router.visit('/login');
            });

            return;
        }

        router.post('/carts', {

            //data
            product_id: product_id,
            product_image: productImage ? productImage.split('\\').pop().split('/').pop() : '',
            color: color,
            color_image: colorImage ? colorImage.split('\\').pop().split('/').pop() : '',
            size: size,
            price: price,
            qty: 1,
            weight: weight

        }, {
            onSuccess: () => {

                //show alert
                Swal.fire({
                    title: 'Success!',
                    text: 'Add to Cart successfully!',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        });
    }

    return (
        <>
            <div className="justify-content-center fixed-bottom">
                 <button onClick={() => addToCart()} className="btn btn-success btn-sm btn-cart p-2 pe-2">
                     <i className="fa fa-shopping-cart me-2"></i> Add to Cart
                 </button>
            </div>
        </>
    );
}
