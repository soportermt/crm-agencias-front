"use client";

import React, { useEffect, useState } from 'react'
import InfoTableVendedor from '../vendedores/InfoTableVendedor';
import StatCard from './StatCard';
import { dashboardService } from '@/services/dashboard.service';

const SKELETON_KEYS = ["cobrar", "pagar", "generado", "clientes"];
export default function DashboardAgente({ user, sales }) {
    const [data, setData] = useState(null);
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

    const rawDate = new Intl.DateTimeFormat("es-MX", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(new Date());

    const fecha = rawDate.charAt(0).toUpperCase() + rawDate.slice(1);
    const userName = user?.idUsuario?.profiles?.fullname || user?.nombre || "Usuario";

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
                            title="Total a Cobrar"
                            value="0"
                            trend="up"
                            hasShadow={true}
                            dashboard
                        />
                    </div>
                    <div className="col-12 col-sm-6 col-md-3">
                        <StatCard
                            title="Total a Pagar"
                            value="0"
                            trend="down"
                            hasShadow={true}
                            dashboard
                        />
                    </div>
                    <div className="col-12 col-sm-6 col-md-3">
                        <StatCard
                            title="Total Generado en Ventas"
                            value="0"
                            trend="up"
                            hasShadow={true}
                            dashboard
                        />
                    </div>
                    <div className="col-12 col-sm-6 col-md-3">
                        <StatCard
                            title="Clientes Registrados"
                            value="0"
                            trend="user"
                            hasShadow={true}
                            dashboard
                        />
                    </div>
                </div>
            )}

            <div className="row g-3 mb-4">
                <div className="col-12 col-md-6">
                    <div className="bg-white p-3 border shadow-premium h-100" style={{ borderRadius: "12px" }}>
                    </div>
                </div>
                <div className="col-12 col-md-6">
                    <div className="bg-white p-3 border shadow-premium h-100" style={{ borderRadius: "12px" }}>
                    </div>
                </div>
            </div>

            <div className="bg-white p-2 border shadow-premium" style={{ borderRadius: "12px" }}>
                <InfoTableVendedor data={sales} dashboardAgente dashboard />
            </div>
        </div>
    )
}
