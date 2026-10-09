"use client";

import React, { useEffect, useMemo, useState } from 'react'
import StatCard from '../common/StatCard'
import { reportesService } from '@/services/reportes.service';
import DataTable from '../common/DataTable';
import Link from 'next/link';
import StatusBadge from '../common/StatusBadge';

const ITEMS_PER_PAGE = 8;
const columns = [
    { key: "folio", label: "Folio", width: "100px", align: "start" },
    { key: "fecha", label: "Fecha", width: "100px", align: "start" },
    { key: "cliente", label: "Cliente", width: "140px", align: "start" },
    { key: "descripcion", label: "Descripción", width: "180px", align: "start" },
    { key: "servicio", label: "Servicio", width: "110px", align: "start" },
    { key: "importe", label: "Total", width: "125px", align: "end" },
    { key: "forma_pago", label: "Forma de pago", width: "125px", align: "start" },
    { key: "estatus", label: "Estatus", width: "80px", align: "center" },
    { key: "vendedor", label: "Vendedor", width: "80px", align: "center" },
];

const formatDate = (value) => {
    if (!value || value === "0000-00-00") return "";
    const [y, m, d] = String(value).slice(0, 10).split("-");
    return `${d}/${m}/${y}`;
};

function mapDetalleToRow(item) {
    return {
        id: item.id_ventaservicio,
        id_venta: item.id_venta,
        folio: item.folio || "-",
        fecha: formatDate(item.fecha),
        cliente: item.cliente || "-",
        descripcion: item.descripcion || "-",
        servicio: item.servicio || "-",
        importe: Number(item.importe) || 0,
        forma_pago: item.forma_pago || "Sin pago",
        estatus: item.estatus,
        vendedor: item.vendedor || "-",
    };
}

export default function ResumenView({ mes, anio }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchValue, setSearchValue] = useState("");

    const formatCurrency = (value) => {
        if (value == null || isNaN(value)) return "$0.00";
        return new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency: "MXN",
        }).format(value);
    };

    useEffect(() => {
        let cancelled = false;
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await reportesService.getReportesResumen(mes, anio);
                if (!cancelled) setData(res);
            } catch (error) {
                console.error("Error fetching reportes:", error);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchData();
        return () => { cancelled = true; };
    }, [mes, anio]);

    const resumen = data?.resumen_mensual?.[0];

    const rows = useMemo(() => {
        const detalle = data?.detalle_ventas;
        if (!Array.isArray(detalle)) return [];
        return detalle.map(mapDetalleToRow);
    }, [data]);

    const filteredData = useMemo(() => {
        const term = searchValue.trim().toLowerCase();
        if (!term) return rows;
        return rows.filter((row) =>
            [row.folio, row.cliente, row.vendedor, row.servicio, row.descripcion]
                .some((v) => String(v).toLowerCase().includes(term))
        );
    }, [rows, searchValue]);

    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE) || 1;

    const paginatedData = useMemo(() => {
        return filteredData.slice(
            (currentPage - 1) * ITEMS_PER_PAGE,
            currentPage * ITEMS_PER_PAGE
        );
    }, [filteredData, currentPage]);

    const renderCell = (key, row) => {
        switch (key) {
            case "folio":
                return <Link className="font-inter fw-semibold text-brand-blue" style={{ textDecoration: "none" }} href={`/reservaciones/editar/${row.id_venta}`} target="_blank">{row.folio}</Link>;
            case "importe":
                return <span className='fw-bold'>{formatCurrency(row.importe)}</span>;
            case "estatus":
                return <StatusBadge status={row.estatus === "venta" ? "Activo" : row.estatus} />;
            default:
                return row[key];
        }
    };

    return (
        <div>
            <div className="row g-3 mb-2">
                <div className="col-12 col-sm-6 col-md-3">
                    <StatCard
                        title={`Ventas totales de ${resumen?.nombre_mes || 'este mes'}`}
                        value={resumen?.total_ventas}
                        hasShadow={true}
                        dashboard
                    />
                </div>
                <div className="col-12 col-sm-6 col-md-3">
                    <StatCard
                        title="Ingresos"
                        value={formatCurrency(resumen?.total_ingresos)}
                        hasShadow={true}
                        dashboard
                        valueColor="rgb(22, 163, 74)"
                    />
                </div>
                <div className="col-12 col-sm-6 col-md-3">
                    <StatCard
                        title="Egresos"
                        value={formatCurrency(resumen?.total_egresos)}
                        hasShadow={true}
                        dashboard
                        valueColor="rgb(245, 158, 11)"
                    />
                </div>
                <div className="col-12 col-sm-6 col-md-3">
                    <StatCard
                        title="Utilidad"
                        value={formatCurrency(resumen?.utilidad)}
                        hasShadow={true}
                        dashboard
                    />
                </div>
            </div>
            <div className='mt-5'>
                <DataTable
                    columns={columns}
                    data={paginatedData}
                    renderCell={renderCell}
                    pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={filteredData.length}
                    onPageChange={setCurrentPage}
                    loading={loading}
                    emptyMessage={loading ? "Cargando reservaciones..." : "No se encontraron reservas."}
                    minWidth="1265px"
                />
            </div>
        </div>
    )
}
