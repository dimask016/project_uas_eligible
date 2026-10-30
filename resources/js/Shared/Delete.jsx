//import react
import React from 'react';

//import inertia router
import { router } from '@inertiajs/react';

//import sweetalert2
import Swal from 'sweetalert2';

export default function Delete({ URL, id }) {

    //method destroy
    const destroy = async (id) => {

        //show sweet alert
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {

                //delete data
                router.delete(`${URL}/${id}`);

                //show alert success
                Swal.fire({
                    title: 'Deleted!',
                    text: 'Data deleted successfully!',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                });
            }
        });
    }

    return (
        <button onClick={() => destroy(id)} className="btn btn-danger btn-sm rounded-pill shadow-sm">
            <i className="fa fa-trash"></i>
        </button>
    );
}
