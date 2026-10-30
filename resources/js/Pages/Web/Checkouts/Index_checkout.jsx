//import React
import React, { useState } from "react";

//import layout web
import LayoutWeb from '../../../Layouts/Web';

//import Head, usePage
import { Head, usePage } from '@inertiajs/react';

//import formatPrice
import FormatPrice from '../../../Utils/FormatPrice';

export default function CheckoutIndex() {

    //destruct props "provinces"
    const { provinces, dataCarts } = usePage().props;

    //define state
    const [address, setAddress] = useState('');

    return (
        <>
            <Head>
                <title>Checkouts - Geek Store - Where Developer Shopping</title>
            </Head>
            <LayoutWeb>

                <div className="container mt-80 mb-5">
                    <div className="fade-in">
                        <div className="row justify-content-center">
                            <div className="col-md-8">
                                
                                <div className="card border-0 rounded-3 shadow-sm">
                                    <div className="card-header">
                                        <i className="fa fa-shopping-cart"></i> Shipping Information
                                    </div>
                                    <div className="card-body">

                                        <div className="mb-3">
                                            <label className="mb-2 fw-bold">Province</label>
                                            <select className="form-select" onChange={(e) => getCityByProvince(e.target.value)}>
                                                <option value="">-- Select Province --</option>
                                                {
                                                    provinces.map((province, index) => (
                                                        <option key={index} value={province.id}>{province.name}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>

                                        <div className="mb-3">
                                            <label className="mb-2 fw-bold">Address</label>
                                            <textarea className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} rows="3" placeholder="Address"></textarea>
                                        </div>

                                    </div>
                                </div>

                                <div className="card border-0 rounded-3 shadow-sm mt-3 mb-5">
                                    <div className="card-body">
                                        <div className="table-responsive">
                                            <table className="table mb-0 mt-0">
                                                <tbody>
                                                    <tr>
                                                        <td style={{ width: '25%' }}>Total Orders</td>
                                                        <td style={{ width: '1%' }}>:</td>
                                                        <td><strong>Rp. {FormatPrice(dataCarts.price)}</strong></td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{ width: '25%' }}>Shipping Cost</td>
                                                        <td style={{ width: '1%' }}>:</td>
                                                        <td><strong>Rp. 0</strong></td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{ width: '25%' }}>Grand Total</td>
                                                        <td style={{ width: '1%' }}>:</td>
                                                        <td><strong>Rp. 0</strong></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

            </LayoutWeb>
        </>
    )

}
