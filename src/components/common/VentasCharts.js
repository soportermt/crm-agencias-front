"use client";

import React from "react";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
    PieChart, Pie, Cell, Legend,
} from "recharts";

const formatCurrency = (value) => {
    if (value == null || isNaN(value)) return "$0.00";
    return new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
    }).format(value);
};

export function VentasBarChart({ dataUser }) {
    const chartData = [
        { name: "Mes", value: dataUser?.total_ventas_mes || 0 },
        { name: "Año", value: dataUser?.total_ventas_anio || 0 },
        { name: "Pendiente", value: dataUser?.total_pagos_pendientes || 0 },
        { name: "Comisión", value: dataUser?.comision_generada || 0 },
    ];

    return (
        <div className="bg-white p-3 border shadow-premium h-100" style={{ borderRadius: "12px" }}>
            <p className="fw-semibold font-poppins text-dark mb-3">Resumen de ventas</p>
            <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis
                        tick={{ fontSize: 11 }}
                        tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Bar dataKey="value" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export function CobradoPendientePieChart({ dataUser }) {
    const totalAnio = dataUser?.total_ventas_anio || 0;
    const pendiente = dataUser?.total_pagos_pendientes || 0;
    const cobrado = Math.max(totalAnio - pendiente, 0);

    const chartData = [
        { name: "Cobrado", value: cobrado },
        { name: "Pendiente", value: pendiente },
    ];
    const COLORS = ["#22c55e", "#f59e0b"];

    const sinDatos = totalAnio === 0;

    return (
        <div className="bg-white p-3 border shadow-premium h-100" style={{ borderRadius: "12px" }}>
            <p className="fw-semibold font-poppins text-dark mb-3">Cobrado vs. pendiente (año)</p>
            {sinDatos ? (
                <p className="text-secondary small">Sin ventas registradas este año</p>
            ) : (
                <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                        <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={55}
                            outerRadius={80}
                            paddingAngle={2}
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={entry.name} fill={COLORS[index]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                        <Legend verticalAlign="bottom" height={24} />
                    </PieChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}