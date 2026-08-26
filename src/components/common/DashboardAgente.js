import React from 'react'
import InfoTableVendedor from '../vendedores/InfoTableVendedor';

export default function DashboardAgente({ user, sales }) {
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

            <div className="bg-white p-2 border shadow-premium" style={{ borderRadius: "12px" }}>
                <InfoTableVendedor data={sales} dashboardAgente dashboard/>
            </div>
        </div>
    )
}
