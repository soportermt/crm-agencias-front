import React, { useMemo, useState } from 'react'
import DataTable from '../common/DataTable';
import Link from 'next/link';
import StatusBadge from '../common/StatusBadge';
import SearchBar from '../common/SearchBar';
import ExportButton from '../common/ExportButton';

const ITEMS_PER_PAGE = 25;

const columns = [
    { key: "folio", label: "Folio", width: "140px", align: "start" },
    { key: "cliente", label: "Cliente", width: "180px", align: "start" },
    { key: "hotel", label: "Hotel", width: "125px", align: "start" },
    { key: "plan", label: "Servicio", width: "1250px", align: "start" },
    { key: "estancia", label: "Fecha de estancia", width: "200px", align: "start" },
    { key: "destino", label: "Destino", width: "125px", align: "start" },
    { key: "total", label: "Total", width: "125px", align: "start" },
    { key: "estatus", label: "Estatus", width: "80px", align: "center" },
];

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

export default function InfoTableVendedor({ data }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchValue, setSearchValue] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [destinationFilter, setDestinationFilter] = useState("");

    const rows = useMemo(() => {
        if (!Array.isArray(data)) return [];
        return data.map(mapVentaToRow);
    }, [data]);

    const availableDestinations = useMemo(() => {
        return [...new Set(rows.map((r) => r.destino).filter((d) => d && d !== "-"))];
    }, [rows]);

    const availableStatuses = useMemo(() => {
        return [...new Set(rows.map((r) => r.estatus).filter(Boolean))];
    }, [rows]);

    const filteredData = useMemo(() => {
        return rows.filter((row) => {
            const matchesSearch =
                row.cliente?.toLowerCase().includes(searchValue.toLowerCase()) ||
                row.folio?.toLowerCase().includes(searchValue.toLowerCase()) ||
                row.hotel?.toLowerCase().includes(searchValue.toLowerCase());

            const matchesStatus = !statusFilter || row.estatus === statusFilter;
            const matchesDestination = !destinationFilter || row.destino === destinationFilter;

            return matchesSearch && matchesStatus && matchesDestination;
        });
    }, [rows, searchValue, statusFilter, destinationFilter]);

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
                return <Link className="font-inter fw-semibold text-brand-blue" style={{ textDecoration: "none" }} href={`reservaciones/editar/${row.id_venta}`}>{row.folio}</Link>;
            case "total":
                return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(row.total);
            case "estatus":
                return <StatusBadge status={row.estatus === "venta" ? "Activo" : row.estatus} />;
            default:
                return row[key];
        }
    };

    return (
        <div>
            <div className='p-3 d-flex align-items-center justify-content-between'>
                <p className='m-0' style={{ fontWeight: 500 }}>Listado de ventas</p>
                <ExportButton onExport={() => exportToCSV(filteredData)} disabled={filteredData.length === 0} />
            </div>
            <div className='row pb-3 px-3'>
                <div className='col-6 d-flex gap-2'>
                    <select
                        name="estado"
                        className="form-select form-select-sm"
                        style={{ width: "fit-content", minWidth: "160px" }}
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                    >
                        <option value="">Todos los estados</option>
                        {availableStatuses.map((st) => (
                            <option key={st} value={st}>
                                {st.charAt(0).toUpperCase() + st.slice(1)}
                            </option>
                        ))}
                    </select>
                    <select
                        name="destino"
                        className="form-select form-select-sm"
                        style={{ width: "fit-content", minWidth: "170px" }}
                        value={destinationFilter}
                        onChange={(e) => {
                            setDestinationFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                    >
                        <option value="">Todos los destinos</option>
                        {availableDestinations.map((d) => (
                            <option key={d} value={d}>
                                {d}
                            </option>
                        ))}
                    </select>
                </div>
                <div className='col-6 d-flex justify-content-end'>
                    <SearchBar
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder="Buscar por cliente, folio, hotel"
                        width="300px"
                    />
                </div>
            </div>
            <DataTable
                columns={columns}
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
        </div>
    )
}
