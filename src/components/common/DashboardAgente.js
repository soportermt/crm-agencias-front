"use client";

import React, { useEffect, useState } from 'react'
import InfoTableVendedor from '../vendedores/InfoTableVendedor';
import StatCard from './StatCard';
import { dashboardService } from '@/services/dashboard.service';
import { CobradoPendientePieChart, VentasBarChart } from './VentasCharts';

const SKELETON_KEYS = ["cobrar", "pagar", "generado", "clientes"];
export default function DashboardAgente({ user, sales }) {
    const [data, setData] = useState(null);
    const [dataUser, setDataUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await dashboardService.getSalesStats();
                setData(data);
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (!user?.id_usuario) return;

        async function loadInfoUser() {
            try {
                const dataUser = await dashboardService.getSalesStatsByUser(user.id_usuario);
                setDataUser(dataUser);
            } catch (err) {
                console.error(err);
            }
        }

        loadInfoUser();
    }, [user]);

    const rawDate = new Intl.DateTimeFormat("es-MX", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(new Date());

    const fecha = rawDate.charAt(0).toUpperCase() + rawDate.slice(1);
    const userName = user?.idUsuario?.profiles?.fullname || user?.nombre || "Usuario";

    const formatCurrency = (value) => {
        if (value == null || isNaN(value)) return "$0.00";
        return new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency: "MXN",
        }).format(value);
    };

    if (loading) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="container-fluid p-0">
            <div className="mb-4">
                <p className="text-secondary small mb-1" style={{ fontFamily: "var(--font-inter)" }}>{fecha}</p>
                <h1 className="h4 fw-semibold font-poppins text-dark m-0">Bienvenido de vuelta, {userName}</h1>
            </div>

            {loading ? (
                <div className="row g-3 mb-4">
                    {SKELETON_KEYS.map((key) => (
                        <div className="col-12 col-sm-6 col-xl-3" key={key}>
                            <div
                                className="p-3"
                                style={{
                                    borderRadius: "12px",
                                    backgroundColor: "#f2f2f2",
                                    minHeight: "96px",
                                }}
                            >
                                <div
                                    className="placeholder-glow"
                                    style={{ display: "flex", flexDirection: "column", gap: "8px" }}
                                >
                                    <span className="placeholder col-6" style={{ height: "14px", borderRadius: "4px" }} />
                                    <span className="placeholder col-4" style={{ height: "24px", borderRadius: "4px" }} />
                                    <span className="placeholder col-8" style={{ height: "12px", borderRadius: "4px" }} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="row g-3 mb-4">
                    <div className="col-12 col-sm-6 col-md-3">
                        <StatCard
                            title="Total de ventas en el mes"
                            value={formatCurrency(dataUser?.total_ventas_mes)}
                            trend="up"
                            hasShadow={true}
                            dashboard
                        />
                    </div>
                    <div className="col-12 col-sm-6 col-md-3">
                        <StatCard
                            title="Total de ventas en el año"
                            value={formatCurrency(dataUser?.total_ventas_anio)}
                            trend="up"
                            hasShadow={true}
                            dashboard
                        />
                    </div>
                    <div className="col-12 col-sm-6 col-md-3">
                        <StatCard
                            title="Total de pagos pendientes"
                            value={formatCurrency(dataUser?.total_pagos_pendientes)}
                            trend="up"
                            hasShadow={true}
                            dashboard
                        />
                    </div>
                    <div className="col-12 col-sm-6 col-md-3">
                        <StatCard
                            title="Comisión generada (fee)"
                            value={formatCurrency(dataUser?.comision_generada)}
                            trend="user"
                            hasShadow={true}
                            dashboard
                        />
                    </div>
                </div>
            )}

            <div className="row g-3 mb-4">
                <div className="col-12 col-md-6">
                    <VentasBarChart dataUser={dataUser} />
                </div>
                <div className="col-12 col-md-6">
                    <CobradoPendientePieChart dataUser={dataUser} />
                </div>
            </div>

            <div className="bg-white p-2 border shadow-premium" style={{ borderRadius: "12px" }}>
                <InfoTableVendedor data={sales} dashboardAgente dashboard />
            </div>
        </div>
    )
}
