import React, { useState } from 'react';
import LayoutWeb from '../../../Layouts/Web';
import { Head, usePage, useForm } from '@inertiajs/react';
import axios from 'axios';

export default function CheckoutIndex() {
    // Ambil props dari CheckoutController
    const { provinces = [], carts = [], totalPrice = 0, totalWeight = 0 } = usePage().props;

    // State lokasi
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [loadingCity, setLoadingCity] = useState(false);
    const [loadingDistrict, setLoadingDistrict] = useState(false);

    // Form Inertia
    const { data, setData, post, processing, errors } = useForm({
        province_id: '',
        city_id: '',
        district_id: '',
        address: '',
    });

    // Format mata uang Rupiah
    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(number || 0);
    };

    // 1. Fetch Cities saat Province berubah (Method GET)
    const handleProvinceChange = (e) => {
        const provinceId = e.target.value;
        setData((prev) => ({
            ...prev,
            province_id: provinceId,
            city_id: '',
            district_id: '',
        }));
        setCities([]);
        setDistricts([]);

        if (provinceId) {
            setLoadingCity(true);
            axios.get(`/checkouts/cities?province_id=${provinceId}`)
                .then((response) => {
                    setCities(response.data);
                    setLoadingCity(false);
                })
                .catch((error) => {
                    console.error('Error fetching cities:', error);
                    setLoadingCity(false);
                });
        }
    };

    // 2. Fetch Districts saat City berubah (Method GET)
    const handleCityChange = (e) => {
        const cityId = e.target.value;
        setData((prev) => ({
            ...prev,
            city_id: cityId,
            district_id: '',
        }));
        setDistricts([]);

        if (cityId) {
            setLoadingDistrict(true);
            axios.get(`/checkouts/districts?city_id=${cityId}`)
                .then((response) => {
                    setDistricts(response.data);
                    setLoadingDistrict(false);
                })
                .catch((error) => {
                    console.error('Error fetching districts:', error);
                    setLoadingDistrict(false);
                });
        }
    };

    return (
        <LayoutWeb>
            <Head>
                <title>Checkout - Geek Store</title>
            </Head>

            <div className="container mt-80 mb-5">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card border-0 shadow-sm rounded-3">
                            <div className="card-header bg-white py-3">
                                <h5 className="fw-bold mb-0">
                                    <i className="fa fa-truck me-2"></i> Shipping Information
                                </h5>
                            </div>
                            <div className="card-body p-4">
                                {/* Dropdown Province */}
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Province</label>
                                    <select
                                        className="form-select"
                                        value={data.province_id}
                                        onChange={handleProvinceChange}
                                    >
                                        <option value="">-- Select Province --</option>
                                        {Array.isArray(provinces) && provinces.map((prov) => {
                                            const id = prov.id || prov.province_id;
                                            const name = prov.name || prov.province || prov.title;
                                            return (
                                                <option key={id} value={id}>
                                                    {name}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>

                                {/* Dropdown City */}
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">City</label>
                                    <select
                                        className="form-select"
                                        value={data.city_id}
                                        onChange={handleCityChange}
                                        disabled={!data.province_id || loadingCity}
                                    >
                                        <option value="">
                                            {loadingCity ? 'Loading Cities...' : '-- Select City --'}
                                        </option>
                                        {cities.map((city) => {
                                            const id = city.id || city.city_id;
                                            const name = city.name || city.city_name || city.title;
                                            return (
                                                <option key={id} value={id}>
                                                    {city.type ? `${city.type} ` : ''}{name}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>

                                {/* Dropdown District */}
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">District</label>
                                    <select
                                        className="form-select"
                                        value={data.district_id}
                                        onChange={(e) => setData('district_id', e.target.value)}
                                        disabled={!data.city_id || loadingDistrict}
                                    >
                                        <option value="">
                                            {loadingDistrict ? 'Loading Districts...' : '-- Select District --'}
                                        </option>
                                        {districts.map((district) => {
                                            const id = district.id || district.district_id;
                                            const name = district.name || district.district_name;
                                            return (
                                                <option key={id} value={id}>
                                                    {name}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>

                                {/* Address */}
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Address</label>
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        placeholder="Address"
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        {/* Summary / Totals */}
                        <div className="card border-0 shadow-sm rounded-3 mt-4">
                            <div className="card-body p-4">
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Total Orders</span>
                                    <span className="fw-bold">{formatRupiah(totalPrice)}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Shipping Cost</span>
                                    <span className="fw-bold">{formatRupiah(0)}</span>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between">
                                    <span className="fw-bold">Grand Total</span>
                                    <span className="fw-bold text-success">{formatRupiah(totalPrice)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </LayoutWeb>
    );
}
