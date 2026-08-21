"use client";

import { useEffect, useState } from "react";
import DataTable from "../common/DataTable";
import ExportButton from "../common/ExportButton";
import SearchBar from "../common/SearchBar";
import StatusBadge from "../common/StatusBadge";
import { bookingService } from "@/services/booking.service";
import Link from "next/link";

const COLUMNS = [
    { key: "folio", label: "Folio", width: "140px", align: "start" },
    { key: "cliente", label: "Cliente", width: "225px", align: "start" },
    { key: "hotel", label: "Descripción", width: "155px", align: "start" },
    { key: "plan", label: "Servicio", width: "130px", align: "start" },
    { key: "estancia", label: "Fecha de estancia", width: "225px", align: "start" },
    { key: "destino", label: "Destino", width: "130px", align: "start" },
    { key: "total", label: "Total", width: "130px", align: "start" },
    { key: "estatus", label: "Estatus", width: "100px", align: "center" },
    // { key: "acciones", label: "Acciones", width: "80px", align: "center" },
];

const ITEMS_PER_PAGE = 25;

function parseDesglose(desgloseStr) {
    try {
        return JSON.parse(desgloseStr);
    } catch {
        return {};
    }
}

function parseLocalDate(dateString) {
    if (!dateString || dateString === "0000-00-00") return null;

    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
}

function formatDateRange(inicio, fin) {
    const fechaInicio = parseLocalDate(inicio);

    if (!fechaInicio) return "-";

    const opts = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    };

    const dInicio = fechaInicio.toLocaleDateString("es-MX", opts);

    if (
        !fin ||
        fin === "0000-00-00" ||
        fin === "0000-00-00 00:00:00" ||
        fin === inicio
    ) {
        return dInicio;
    }

    const fechaFin = parseLocalDate(fin);

    if (!fechaFin) return dInicio;

    const dFin = fechaFin.toLocaleDateString("es-MX", opts);

    return `${dInicio} a ${dFin}`;
}

function formatDate(date) {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("es-MX", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function mapVentaToRow(venta) {
    const servicios = venta.ventasServicioses || [];
    const primero = servicios[0] || {};

    const hoteles = [...new Set(servicios.map((s) => s.descripcion).filter(Boolean))];
    const destinos = [...new Set(
        servicios.map((s) => parseDesglose(s.desglose)?.destino).filter(Boolean)
    )];
    const tipos = [...new Set(
        servicios.map((s) => s.idTipoServicio?.tipo_servicio).filter(Boolean)
    )];

    const total = servicios.reduce(
        (sum, s) => sum + (Number(s.tarifa_publica) || 0) + (Number(s.fee) || 0),
        0
    );

    return {
        id_venta: venta.id_venta,
        folio: venta.folio,
        cliente: venta.idCliente?.nombre || venta.pasajero_titular || "-",
        hotel: hoteles.join(", ") || "-",
        plan: tipos.join(", ") || "-",
        estancia: primero.fin_servicio
        ? formatDateRange(primero.inicio_servicio, primero.fin_servicio)
        : "",
        destino: destinos.join(", ") || "-",
        total,
        estatus: venta.estatus,
        fecha: formatDate(venta.fecha),
        desglose: JSON.parse(venta.ventasServicioses[0].desglose),
        _venta: venta
    };
}

function exportToCSV(data) {
    if (!data.length) return;

    const headers = ["Folio", "Cliente", "Hotel", "Servicio", "Fecha de estancia", "Destino", "Total", "Estatus"];

    const rows = data.map((row) => [
        row.folio,
        row.cliente,
        row.hotel,
        row.plan,
        row.estancia,
        row.destino,
        row.total,
        row.estatus === "venta" ? "Activo" : row.estatus,
        row.id_venta,
    ]);

    const escapeCsvValue = (value) => {
        const str = String(value ?? "");
        if (str.includes(",") || str.includes('"') || str.includes("\n")) {
            return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
    };

    const csvContent = [headers, ...rows]
        .map((r) => r.map(escapeCsvValue).join(","))
        .join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `reservaciones_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}


export default function BookingList() {
    const [searchValue, setSearchValue] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [destinationFilter, setDestinationFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelado = false;

        async function cargarReservas() {
            setIsLoading(true);
            setError(null);
            try {
                const data = await bookingService.reservas();
                const filas = Array.isArray(data) ? data.map(mapVentaToRow) : [];
                if (!cancelado) setBookings(filas);
            } catch (err) {
                console.error("Error al cargar reservas:", err);
                if (!cancelado) setError("No se pudieron cargar las reservaciones.");
            } finally {
                if (!cancelado) setIsLoading(false);
            }
        }

        cargarReservas();
        return () => { cancelado = true; };
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchValue, statusFilter, destinationFilter]);

    const filteredData = bookings.filter((row) => {
        const matchesSearch =
            row.cliente?.toLowerCase().includes(searchValue.toLowerCase()) ||
            row.folio?.toLowerCase().includes(searchValue.toLowerCase()) ||
            row.hotel?.toLowerCase().includes(searchValue.toLowerCase());

        const matchesStatus = !statusFilter || row.estatus === statusFilter;
        const matchesDestination = !destinationFilter || row.destino === destinationFilter;

        return matchesSearch && matchesStatus && matchesDestination;
    });

    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

    const paginatedData = filteredData.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const renderCell = (key, row) => {
        switch (key) {
            case "folio":
                return <Link className="font-inter fw-semibold text-brand-blue" style={{ textDecoration: "none" }} href={`reservaciones/editar/${row.id_venta}`} target="_blank">{row.folio}</Link>;
            case "total":
                return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(row.total);
            case "estatus":
                return <StatusBadge status={row.estatus === "venta" ? "Activo" : row.estatus} />;
            default:
                return row[key];
        }
    };

    return (
        <div className="container-fluid p-0">
            <div className="d-flex flex-column" style={{ gap: "16px" }}>
                <h1
                    className="font-inter fw-medium mb-0"
                    style={{ fontSize: "24px", color: "#0f1901", lineHeight: "1.2" }}
                >
                    Lista de reservaciones
                </h1>
                <div className="d-flex flex-column flex-lg-row justify-content-between gap-3">
                    <div className="d-flex flex-column flex-sm-row flex-wrap gap-2">
                        <ExportButton onExport={() => exportToCSV(filteredData)} disabled={filteredData.length === 0} />
                        <select name="estado"
                            className="btn d-flex align-items-center justify-content-center gap-2 border transition-smooth px-3"
                            style={{
                                height: "38px",
                                borderRadius: "8px",
                                borderColor: "#d0d5dd",
                                backgroundColor: "#fff",
                                fontSize: "13px",
                                color: "#0f1901",
                                fontWeight: 400,
                                appearance: "none",
                                textAlign: "start",
                                width: "fit-content"
                            }}
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">Todos los estados</option>
                            <option value="venta">Venta</option>
                        </select>
                        <select name="destino"
                            className="btn d-flex align-items-center justify-content-center gap-2 border transition-smooth px-3"
                            style={{
                                height: "38px",
                                borderRadius: "8px",
                                borderColor: "#d0d5dd",
                                backgroundColor: "#fff",
                                fontSize: "13px",
                                color: "#0f1901",
                                fontWeight: 400,
                                appearance: "none",
                                textAlign: "start",
                                width: "fit-content"
                            }}
                            value={destinationFilter}
                            onChange={(e) => setDestinationFilter(e.target.value)}
                        >
                            <option value="">Todos los destinos</option>
                            {[...new Set(bookings.map((b) => b.destino))].filter(Boolean).map((d) => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                    </div>
                    <SearchBar
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder="Buscar por cliente, folio, hotel"
                        width="300px"
                    />
                </div>
                {error && (
                    <div className="alert alert-danger py-2 mb-0" role="alert">
                        {error}
                    </div>
                )}

                {isLoading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </div>
                        <p className="text-muted mt-2 font-poppins small">Cargando...</p>
                    </div>
                ) : error ? (
                    <p className="text-danger">{error}</p>
                ) : (
                    <DataTable
                        columns={COLUMNS}
                        data={paginatedData}
                        renderCell={renderCell}
                        pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={filteredData.length}
                        onPageChange={setCurrentPage}
                        loading={isLoading}
                        emptyMessage={isLoading ? "Cargando reservaciones..." : "No se encontraron reservas."}
                        minWidth="1265px"
                    />
                )}
            </div>
        </div>
    );
}