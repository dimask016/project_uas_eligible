import React, { useState } from 'react';
import LayoutWeb from '../../../Layouts/Web';
import { Head, usePage, useForm } from '@inertiajs/react';
import axios from 'axios';

export default function CheckoutIndex() {
    const { provinces = [], carts = [], totalPrice = 0, totalWeight = 0 } = usePage().props;

    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [loadingCity, setLoadingCity] = useState(false);
    const [loadingDistrict, setLoadingDistrict] = useState(false);

    const [courier, setCourier] = useState('');
    const [courierServices, setCourierServices] = useState([]);
    const [loadingOngkir, setLoadingOngkir] = useState(false);

    const { data, setData, post, processing } = useForm({
        province_id: '',
        city_id: '',
        district_id: '',
        address: '',
        courier_name: '',
        courier_service: '',
        courier_cost: 0,
        weight: totalWeight,
        grand_total: totalPrice,
    });

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 2
        }).format(number || 0);
    };

    const handleProvinceChange = (e) => {
        const provinceId = e.target.value;
        setData((prev) => ({
            ...prev,
            province_id: provinceId,
            city_id: '',
            district_id: '',
            courier_cost: 0,
            grand_total: totalPrice,
        }));
        setCities([]);
        setDistricts([]);
        setCourierServices([]);
        setCourier('');

        if (provinceId) {
            setLoadingCity(true);
            axios.get(`/checkouts/cities?province_id=${provinceId}`)
                .then((response) => {
                    setCities(response.data);
                    setLoadingCity(false);
                })
                .catch(() => setLoadingCity(false));
        }
    };

    const handleCityChange = (e) => {
        const cityId = e.target.value;
        setData((prev) => ({
            ...prev,
            city_id: cityId,
            district_id: '',
            courier_cost: 0,
            grand_total: totalPrice,
        }));
        setDistricts([]);
        setCourierServices([]);
        setCourier('');

        if (cityId) {
            setLoadingDistrict(true);
            axios.get(`/checkouts/districts?city_id=${cityId}`)
                .then((response) => {
                    setDistricts(response.data);
                    setLoadingDistrict(false);
                })
                .catch(() => setLoadingDistrict(false));
        }
    };

    // Dynamic Ongkir berdasarkan Radio Expedition
    const handleCourierChange = (selectedCourier) => {
        setCourier(selectedCourier);
        setCourierServices([]);
        setData((prev) => ({
            ...prev,
            courier_name: selectedCourier.toUpperCase(),
            courier_service: '',
            courier_cost: 0,
            grand_total: totalPrice,
        }));

        if (selectedCourier && data.district_id) {
            setLoadingOngkir(true);
            axios.post('/checkouts/checkOngkir', {
                destination: data.district_id,
                weight: totalWeight,
                courier: selectedCourier,
            })
            .then((response) => {
                setCourierServices(response.data || []);
                setLoadingOngkir(false);
            })
            .catch(() => setLoadingOngkir(false));
        }
    };

    // Handler Radio Service Ongkir
    const handleServiceChange = (service) => {
        const cost = service.cost || service.price || 0;
        setData((prev) => ({
            ...prev,
            courier_service: service.service || service.description,
            courier_cost: cost,
            grand_total: totalPrice + cost,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/checkouts');
    };

    return (
        <LayoutWeb>
            <Head>
                <title>Checkout - 2R Store</title>
            </Head>

            <div className="container mt-80 mb-5">
                <form onSubmit={handleSubmit}>
                    <div className="row justify-content-center">
                        <div className="col-md-8">
                            <div className="card border-0 shadow-sm rounded-3">
                                <div className="card-header bg-white py-3">
                                    <h5 className="fw-bold mb-0">
                                        <i className="fa fa-shopping-cart me-2"></i> Shipping Information
                                    </h5>
                                </div>
                                <div className="card-body p-4">
                                    {/* Province Dropdown */}
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Province</label>
                                        <select
                                            className="form-select"
                                            value={data.province_id}
                                            onChange={handleProvinceChange}
                                        >
                                            <option value="">-- Select Province --</option>
                                            {Array.isArray(provinces) && provinces.map((prov) => (
                                                <option key={prov.id || prov.province_id} value={prov.id || prov.province_id}>
                                                    {prov.name || prov.province || prov.title}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* City Dropdown */}
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
                                            {cities.map((city) => (
                                                <option key={city.id || city.city_id} value={city.id || city.city_id}>
                                                    {city.name || city.city_name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* District Dropdown */}
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
                                            {districts.map((district) => (
                                                <option key={district.id || district.district_id} value={district.id || district.district_id}>
                                                    {district.name || district.district_name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Shipping Expedition (Radio Buttons) */}
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold d-block">Shipping Expedition</label>
                                        {['jne', 'pos', 'jnt', 'ninja'].map((item) => (
                                            <div className="form-check form-check-inline me-4" key={item}>
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="courier"
                                                    id={`courier-${item}`}
                                                    value={item}
                                                    checked={courier === item}
                                                    onChange={() => handleCourierChange(item)}
                                                    disabled={!data.district_id}
                                                />
                                                <label className="form-check-input-label ms-1" htmlFor={`courier-${item}`}>
                                                    {item === 'jne' ? 'JNE' : item === 'pos' ? 'POS' : item === 'jnt' ? 'J&T' : 'Ninja Xpress'}
                                                </label>
                                            </div>
                                        ))}
                                    </div>

                                    <hr />

                                    {/* Shipping Cost Options (Radio Buttons) */}
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold d-block">Shipping Cost</label>
                                        {loadingOngkir && <div className="text-muted small">Loading shipping cost...</div>}
                                        {courierServices.length > 0 ? (
                                            courierServices.map((srv, idx) => (
                                                <div className="form-check mb-2" key={idx}>
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="shipping_service"
                                                        id={`service-${idx}`}
                                                        onChange={() => handleServiceChange(srv)}
                                                    />
                                                    <label className="form-check-label ms-1" htmlFor={`service-${idx}`}>
                                                        {srv.service} - {formatRupiah(srv.cost || srv.price)}
                                                    </label>
                                                </div>
                                            ))
                                        ) : (
                                            !loadingOngkir && <div className="text-muted small">- Select expedition first -</div>
                                        )}
                                    </div>

                                    {/* Address Textarea */}
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

                            {/* Orders Summary */}
                            <div className="card border-0 shadow-sm rounded-3 mt-4">
                                <div className="card-body p-4">
                                    <div className="d-flex justify-content-between mb-2">
                                        <span>Total Orders</span>
                                        <span className="fw-bold">: {formatRupiah(totalPrice)}</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span>Shipping Cost</span>
                                        <span className="fw-bold">: {formatRupiah(data.courier_cost)}</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span>Grand Total</span>
                                        <span className="fw-bold">: {formatRupiah(data.grand_total)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </LayoutWeb>
    );
}
