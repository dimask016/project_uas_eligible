import React from 'react';
import LayoutAccount from '../../../Layouts/Account';
import { Head, usePage } from '@inertiajs/react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Registrasi modul ChartJS
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function Dashboard() {
    const { count, chart, auth } = usePage().props;

    // Konfigurasi Data Grafik Bar
    const chartData = {
        labels: chart?.labels || [],
        datasets: [
            {
                label: 'REVENUE (Rp)',
                data: chart?.revenues || [],
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                borderRadius: 4,
            },
        ],
    };

    // Konfigurasi Opsi Grafik
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: `STATISTIC REVENUE : ${chart?.year || ''}`,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value) {
                        return 'Rp. ' + value.toLocaleString('id-ID');
                    },
                },
            },
        },
    };

    return (
        <LayoutAccount>
            <Head>
                <title>Dashboard - Geek Store</title>
            </Head>

            {/* Banner Welcome */}
            <div className="alert alert-success border-0 shadow-sm mb-4">
                Selamat Datang, <strong>{auth?.user?.name || 'Administrator'}</strong>
            </div>

            {/* Row Widget Status Transaksi */}
            <div className="row mb-4">
                <div className="col-md-3 col-6 mb-3">
                    <div className="card border-0 shadow-sm bg-primary text-white rounded-3">
                        <div className="card-body d-flex align-items-center justify-content-between">
                            <div>
                                <h3 className="mb-0 fw-bold">{count?.unpaid || 0}</h3>
                                <small>UNPAID</small>
                            </div>
                            <i className="fa fa-spinner fa-2x opacity-50"></i>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 col-6 mb-3">
                    <div className="card border-0 shadow-sm bg-success text-white rounded-3">
                        <div className="card-body d-flex align-items-center justify-content-between">
                            <div>
                                <h3 className="mb-0 fw-bold">{count?.paid || 0}</h3>
                                <small>PAID</small>
                            </div>
                            <i className="fa fa-check-circle fa-2x opacity-50"></i>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 col-6 mb-3">
                    <div className="card border-0 shadow-sm bg-warning text-dark rounded-3">
                        <div className="card-body d-flex align-items-center justify-content-between">
                            <div>
                                <h3 className="mb-0 fw-bold">{count?.expired || 0}</h3>
                                <small>EXPIRED</small>
                            </div>
                            <i className="fa fa-exclamation-triangle fa-2x opacity-50"></i>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 col-6 mb-3">
                    <div className="card border-0 shadow-sm bg-danger text-white rounded-3">
                        <div className="card-body d-flex align-items-center justify-content-between">
                            <div>
                                <h3 className="mb-0 fw-bold">{count?.cancelled || 0}</h3>
                                <small>CANCELLED</small>
                            </div>
                            <i className="fa fa-times-circle fa-2x opacity-50"></i>
                        </div>
                    </div>
                </div>
            </div>

            {/* Row Chart Revenue */}
            <div className="row">
                <div className="col-12">
                    <div className="card border-0 rounded shadow-sm">
                        <div className="card-header bg-white fw-bold py-3">
                            <i className="fa fa-bar-chart me-2"></i> CHART REVENUE {chart?.year}
                        </div>
                        <div className="card-body">
                            <Bar data={chartData} options={chartOptions} height={100} />
                        </div>
                    </div>
                </div>
            </div>
        </LayoutAccount>
    );
}
