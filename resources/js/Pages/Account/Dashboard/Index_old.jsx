//import React
import React from 'react';

//import layout
import LayoutAccount from '../../../Layouts/Account';

//import component Head and usePage
import { Head, usePage } from '@inertiajs/react';

export default function Dashboard() {

    //destruct props
    const { auth } = usePage().props;

    return (
        <>
            <Head>
                <title>Dashboard - Geek Store</title>
            </Head>
            <LayoutAccount>
            
                <div className="row mt-4">
                    <div className="col-12 col-md-12 col-lg-12 mb-4">
                        <div className="alert alert-success border-0 shadow-sm mb-0">
                            Selamat Datang, <strong>{auth.user.name}</strong>
                        </div>
                    </div>
                </div>

            </LayoutAccount>
        </>
    )

}
