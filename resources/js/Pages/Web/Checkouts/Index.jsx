//import React
import React, { useState } from "react";

//import layout web
import LayoutWeb from '../../../Layouts/Web';

//import Head, usePage, router
import { Head, usePage, router } from '@inertiajs/react';

//import formatPrice
import FormatPrice from '../../../Utils/FormatPrice';

//import axios
import axios from "axios";

//import SweetAlert2
import Swal from 'sweetalert2';

export default function CheckoutIndex() {

    //destruct props "provinces" & "dataCarts"
    const { provinces = [], dataCarts = { price: 0, weight: 1000 } } = usePage().props;

    //define state
    const [provinceID, setProvinceID] = useState('');
    const [cityID, setCityID] = useState('');
    const [cities, setCities] = useState([]);
    const [districtID, setDistrictID] = useState('');
    const [districts, setDistricts] = useState([]);

    const [showCourier, setShowCourier] = useState(false);
    const [courierName, setCourierName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showOngkir, setShowOngkir] = useState(false);
    const [ongkirs, setOngkirs] = useState([]);

    const [courierService, setCourierService] = useState('');
    const [courierCost, setCourierCost] = useState(0);

    const [grandTotal, setGrandTotal] = useState(Number(dataCarts?.price) || 0);
    const [address, setAddress] = useState('');

    //method getCityByProvince
    const getCityByProvince = async (province_id) => {
        setProvinceID(province_id);
        setCityID('');
        setDistrictID('');
        setCities([]);
        setDistricts([]);
        setShowCourier(false);
        setShowOngkir(false);
        setCourierCost(0);

        if (province_id) {
            axios.get(`/checkouts/cities?province_id=${province_id}`)
                .then(response => {
                    setCities(response.data);
                });
        }
    }

    //method getDistrictByCity
    const getDistrictByCity = async (city_id) => {
        setCityID(city_id);
        setDistrictID('');
        setDistricts([]);
        setShowCourier(false);
        setShowOngkir(false);
        setCourierCost(0);

        if (city_id) {
            axios.get(`/checkouts/districts?city_id=${city_id}`)
                .then(response => {
                    setDistricts(response.data);
                });
        }
    }

    //method show courier expedition
    const showCourierExpedition = (district_id) => {
        setDistrictID(district_id);
        if (district_id) {
            setShowCourier(true);
        } else {
            setShowCourier(false);
        }
    }

    //method checkOngkir
    const checkOngkir = (e) => {
        setIsLoading(true);
        setShowOngkir(false);
        setOngkirs([]); 
        setCourierName(e.target.value);
        setCourierCost(0);

        axios.post('/checkouts/check-ongkir', {
            destination: districtID,
            weight: dataCarts.weight || 1000,
            courier: e.target.value
        }).then(response => {
            if (Array.isArray(response.data)) {
                setOngkirs(response.data);
            } else if (response.data && Array.isArray(response.data.data)) {
                setOngkirs(response.data.data);
            } else {
                setOngkirs([]);
            }
            setIsLoading(false);
            setShowOngkir(true);
        }).catch(error => {
            console.error("Gagal memuat ongkir:", error);
            setOngkirs([]);
            setIsLoading(false);
            setShowOngkir(true);
        });
    }

    //method getServiceAndCost
    const getServiceAndCost = (e) => {
        let shipping = e.target.value.split("|");
        const cost = parseInt(shipping[0]) || 0;
        const service = shipping[1] || '';

        const cartPrice = parseInt(dataCarts?.price) || 0;

        setCourierCost(cost);
        setCourierService(service);
        setGrandTotal(cartPrice + cost);
    }

    //method storeCheckout
    const storeCheckout = (e) => {
        e.preventDefault();

        if (!courierCost) {
            Swal.fire('Perhatian!', 'Silakan pilih layanan ongkos kirim terlebih dahulu.', 'warning');
            return;
        }

        if (!address.trim()) {
            Swal.fire('Perhatian!', 'Silakan isi alamat lengkap pengiriman Anda.', 'warning');
            return;
        }

        Swal.fire({
            title: 'Memproses Pembayaran...',
            text: 'Mohon tunggu, Anda sedang dialihkan ke gateway pembayaran Duitku.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        router.post('/checkouts', {
            province_id: provinceID,
            city_id: cityID,
            district_id: districtID,
            courier_name: courierName,
            courier_service: courierService,
            courier_cost: courierCost,
            weight: dataCarts.weight || 1000,
            grand_total: grandTotal,
            address: address
        }, {
            onError: (errors) => {
                Swal.fire({
                    title: 'Gagal Checkout!',
                    text: errors.payment || 'Terjadi kesalahan pada respon Duitku.',
                    icon: 'error'
                });
            }
        });
    }

    const isFormValid = courierCost > 0 && address.trim().length > 0;

    return (
        <>
            <Head>
                <title>Checkouts - 2R STORE</title>
            </Head>
            <LayoutWeb>

                <div className="container mt-55 mb-5">
                    <div className="row justify-content-center">
                        <div className="col-md-8">
                            
                            <div className="card border-0 rounded-3 shadow-sm">
                                <div className="card-header bg-white fw-bold py-3">
                                    <i className="fa fa-shipping-fast me-2"></i> Shipping Information
                                </div>
                                <div className="card-body">

                                    {/* Province */}
                                    <div className="mb-3">
                                        <label className="mb-2 fw-bold">Province</label>
                                        <select className="form-select" onChange={(e) => getCityByProvince(e.target.value)}>
                                            <option value="">-- Select Province --</option>
                                            {provinces.map((province, index) => (
                                                <option key={index} value={province.id}>{province.title || province.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* City */}
                                    <div className="mb-3">
                                        <label className="mb-2 fw-bold">City</label>
                                        <select className="form-select" onChange={(e) => getDistrictByCity(e.target.value)} disabled={!provinceID}>
                                            <option value="">-- Select City --</option>
                                            {cities.map((city, index) => (
                                                <option key={index} value={city.id}>{city.title || city.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* District */}
                                    <div className="mb-3">
                                        <label className="mb-2 fw-bold">District</label>
                                        <select className="form-select" onChange={(e) => showCourierExpedition(e.target.value)} disabled={!cityID}>
                                            <option value="">-- Select District --</option>
                                            {districts.map((district, index) => (
                                                <option key={index} value={district.id}>{district.title || district.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Expedisi / Courier Options */}
                                    {showCourier && (
                                        <div className="mb-3">
                                            <label className="mb-2 fw-bold">Shipping Expedition</label>
                                            <div className="d-flex flex-wrap gap-4 mt-1">
                                                <div className="form-check">
                                                    <input className="form-check-input" name="courier" type="radio" id="jne" value="jne" onChange={checkOngkir} />
                                                    <label className="form-check-label fw-bold ms-1" htmlFor="jne">JNE</label>
                                                </div>
                                                <div className="form-check">
                                                    <input className="form-check-input" name="courier" type="radio" id="pos" value="pos" onChange={checkOngkir} />
                                                    <label className="form-check-label fw-bold ms-1" htmlFor="pos">POS</label>
                                                </div>
                                                <div className="form-check">
                                                    <input className="form-check-input" name="courier" type="radio" id="jnt" value="jnt" onChange={checkOngkir} />
                                                    <label className="form-check-label fw-bold ms-1" htmlFor="jnt">J&T</label>
                                                </div>
                                                <div className="form-check">
                                                    <input className="form-check-input" name="courier" type="radio" id="ninja" value="ninja" onChange={checkOngkir} />
                                                    <label className="form-check-label fw-bold ms-1" htmlFor="ninja">Ninja Xpress</label>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Loading State */}
                                    {isLoading && (
                                        <div className="text-center my-3">
                                            <div className="spinner-border text-success" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                            <h6 className="mt-2">Memuat Biaya Pengiriman...</h6>
                                        </div>
                                    )}

                                    {/* Ongkir Service Options */}
                                    {showOngkir && (
                                        <div className="mb-3">
                                            <hr />
                                            <label className="fw-bold mb-2">Shipping Cost & Service</label>
                                            
                                            {ongkirs.length > 0 ? (
                                                <div className="d-flex flex-column gap-2">
                                                    {ongkirs.map((ongkir, index) => (
                                                        <div className="form-check" key={index}>
                                                            <input 
                                                                className="form-check-input" 
                                                                type="radio" 
                                                                name="cost" 
                                                                id={`service-${index}`} 
                                                                value={`${ongkir.cost}|${ongkir.service}`} 
                                                                onChange={getServiceAndCost} 
                                                            />
                                                            <label className="form-check-label ms-1" htmlFor={`service-${index}`}>
                                                                {ongkir.service} - <strong>Rp. {FormatPrice(ongkir.cost)}</strong>
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="alert alert-warning py-2 mb-0 small">
                                                    Layanan ekspedisi <strong>{courierName.toUpperCase()}</strong> tidak tersedia untuk rute tujuan ini. Silakan pilih ekspedisi lain.
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Address */}
                                    <div className="mb-3">
                                        <label className="mb-2 fw-bold">Address</label>
                                        <textarea className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} rows="3" placeholder="Alamat Lengkap Pengiriman"></textarea>
                                    </div>

                                </div>
                            </div>

                            {/* Ringkasan Pembayaran */}
                            <div className="card border-0 rounded-3 shadow-sm mt-3 mb-3">
                                <div className="card-body">
                                    <div className="table-responsive">
                                        <table className="table mb-0">
                                            <tbody>
                                                <tr>
                                                    <td style={{ width: '30%' }}>Total Orders</td>
                                                    <td style={{ width: '1%' }}>:</td>
                                                    <td><strong>Rp. {FormatPrice(dataCarts?.price || 0)}</strong></td>
                                                </tr>
                                                <tr>
                                                    <td>Shipping Cost</td>
                                                    <td>:</td>
                                                    <td><strong>Rp. {FormatPrice(courierCost)}</strong></td>
                                                </tr>
                                                <tr>
                                                    <td className="fs-5 fw-bold">Grand Total</td>
                                                    <td className="fs-5 fw-bold">:</td>
                                                    <td className="fs-5 fw-bold text-success"><strong>Rp. {FormatPrice(grandTotal || dataCarts?.price || 0)}</strong></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* Tombol Bayar */}
                            <button
                                type="button"
                                onClick={storeCheckout}
                                disabled={!isFormValid}
                                className={`btn w-100 fw-bold py-2 shadow-sm text-uppercase mb-5 ${isFormValid ? 'btn-success' : 'btn-secondary'}`}
                                style={{
                                    backgroundColor: isFormValid ? "#8B4513" : "#6c757d",
                                    borderColor: isFormValid ? "#8B4513" : "#6c757d",
                                    cursor: isFormValid ? "pointer" : "not-allowed"
                                }}
                            >
                                BAYAR SEKARANG
                            </button>

                        </div>
                    </div>
                </div>

            </LayoutWeb>
        </>
    );
}