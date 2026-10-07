import React, { useEffect, useMemo, useRef, useState } from 'react';
import DatePicker, { registerLocale } from "react-datepicker";
import { es } from "date-fns/locale";
import {
    format,
    startOfDay, endOfDay, subDays,
    startOfWeek, endOfWeek, subWeeks,
    startOfMonth, endOfMonth, subMonths,
} from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import DataTable from "../common/DataTable";
import SearchBar from '../common/SearchBar';
import ExportButton from '../common/ExportButton';
import { cajaService } from '@/services/caja.service';
import { createPortal } from 'react-dom';
import ExportDocuments from '../common/ExportDocuments';

registerLocale("es", es);

const WEEK = { weekStartsOn: 1 };

const PRESETS = [
    { label: "Hoy", range: () => [startOfDay(new Date()), endOfDay(new Date())] },
    {
        label: "Ayer",
        range: () => {
            const d = subDays(new Date(), 1);
            return [startOfDay(d), endOfDay(d)];
        },
    },
    {
        label: "Últimos 7 días",
        range: () => [startOfDay(subDays(new Date(), 6)), endOfDay(new Date())],
    },
    {
        label: "Esta semana",
        range: () => [startOfWeek(new Date(), WEEK), endOfWeek(new Date(), WEEK)],
    },
    {
        label: "Semana pasada",
        range: () => {
            const d = subWeeks(new Date(), 1);
            return [startOfWeek(d, WEEK), endOfWeek(d, WEEK)];
        },
    },
    {
        label: "Este mes",
        range: () => [startOfMonth(new Date()), endOfMonth(new Date())],
    },
    {
        label: "Mes pasado",
        range: () => {
            const d = subMonths(new Date(), 1);
            return [startOfMonth(d), endOfMonth(d)];
        },
    },
];

const ITEMS_PER_PAGE = 5;

const COLUMNS = [
    { key: "id_pago", label: "No. pago", width: "100px" },
    { key: "fecha", label: "Fecha de pago", width: "140px" },
    { key: "forma_pago", label: "Forma de pago", width: "200px" },
    { key: "descripcion", label: "Descripcion", width: "140px" },
    { key: "acciones", label: "Acciones", width: "100px", align: "center" },
];

const toYMD = (date) => (date ? format(date, "yyyy-MM-dd") : "");

const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = String(dateStr).slice(0, 10).split("-");
    return `${day}/${month}/${year}`;
};

const money = (n, currency = "MXN") =>
    new Intl.NumberFormat("es-MX", { style: "currency", currency }).format(Number(n) || 0);

const formaPagoNombre = (p) => p.idFormaPago?.descripcion ?? "";

const folioDeDetalle = (d) => d.idVentaservicio?.idVenta?.folio ?? "";

const monedaDeDetalle = (d) => d.idVentaservicio?.idVenta?.moneda || "MXN";

const foliosDePago = (p) => [
    ...new Set((p.pagosDetalles || []).map(folioDeDetalle).filter(Boolean)),
];

const exportColumns = [
    { header: "No. pago", key: "id_pago" },
    { header: "Fecha de pago", value: (row) => formatDate(row.fecha) },
    { header: "Forma de pago", value: (row) => formaPagoNombre(row) },
    { header: "Folio", value: (row) => foliosDePago(row).join(" | ") },
    { header: "Total", key: "total_pago" },
];

function PagoDetalleModal({ pago, onClose }) {
    useEffect(() => {
        const onKey = (e) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", onKey);

        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = prevOverflow;
        };
    }, [onClose]);

    const detalles = pago.pagosDetalles || [];

    return (
        <div
            onClick={onClose}
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 2000,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "16px",
                background: "rgba(0, 0, 0, 0.5)",
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: "#fff",
                    borderRadius: "8px",
                    width: "100%",
                    maxWidth: "800px",
                    maxHeight: "90vh",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
                }}
            >
                <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                    <h5 className="m-0">Pago #{pago.id_pago}</h5>
                    <button
                        type="button"
                        className="btn-close"
                        aria-label="Cerrar"
                        onClick={onClose}
                    />
                </div>

                <div className="p-3" style={{ overflowY: "auto" }}>
                    <div className="d-flex flex-wrap gap-4 mb-3 small">
                        <div>
                            <div className="text-muted">Fecha de pago</div>
                            <div className="fw-semibold">{formatDate(pago.fecha)}</div>
                        </div>
                        <div>
                            <div className="text-muted">Forma de pago</div>
                            <div className="fw-semibold">{formaPagoNombre(pago)}</div>
                        </div>
                        {pago.descripcion && (
                            <div>
                                <div className="text-muted">Descripción</div>
                                <div className="fw-semibold">{pago.descripcion}</div>
                            </div>
                        )}
                    </div>

                    <div className="table-responsive">
                        <table className="table table-sm align-middle">
                            <thead>
                                <tr>
                                    <th>Folio</th>
                                    <th>Servicio</th>
                                    <th>Pasajero titular</th>
                                    <th className="text-end">Monto</th>
                                </tr>
                            </thead>
                            <tbody>
                                {detalles.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="text-center text-muted">
                                            Sin detalles
                                        </td>
                                    </tr>
                                )}
                                {detalles.map((d) => (
                                    <tr key={d.id_pago_detalle}>
                                        <td>{folioDeDetalle(d) || "—"}</td>
                                        <td>
                                            <div>{d.idVentaservicio?.descripcion}</div>
                                            {d.idVentaservicio?.codigo && (
                                                <div className="small text-muted">
                                                    Código: {d.idVentaservicio.codigo}
                                                </div>
                                            )}
                                        </td>
                                        <td>{d.idVentaservicio?.idVenta?.pasajero_titular}</td>
                                        <td className="text-end">
                                            {money(d.monto, monedaDeDetalle(d))}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="d-flex justify-content-between align-items-center p-3 border-top">
                    <div className="fw-semibold">
                        Total: {money(pago.total_pago, monedaDeDetalle(detalles[0] || {}))}
                    </div>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function PagosDetalleTable() {
    const pickerRef = useRef(null);

    const [pagos, setPagos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchValue, setSearchValue] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pagoSeleccionado, setPagoSeleccionado] = useState(null);
    const [filters, setFilters] = useState({
        startDate: subDays(new Date(), 30),
        endDate: new Date(),
    });

    const { startDate, endDate } = filters;

    useEffect(() => {
        if (startDate && !endDate) return;

        let cancelado = false;
        async function cargarPagos() {
            setIsLoading(true);
            setError(null);
            try {
                const data = await cajaService.getAgencyPayments(
                    toYMD(startDate),
                    toYMD(endDate),
                );
                if (!cancelado) setPagos(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Error al cargar pagos:", err);
                if (!cancelado) setError("No se pudieron cargar los pagos");
            } finally {
                if (!cancelado) setIsLoading(false);
            }
        }

        cargarPagos();
        return () => { cancelado = true; };
    }, [startDate, endDate]);

    const handleDateChange = ([start, end]) => {
        setFilters({ startDate: start, endDate: end });
        setCurrentPage(1);
    };

    const applyPreset = (preset) => {
        const [start, end] = preset.range();
        setFilters({ startDate: start, endDate: end });
        setCurrentPage(1);
        pickerRef.current?.setOpen(false);
    };

    const filteredData = useMemo(() => {
        const q = searchValue.trim().toLowerCase();
        if (!q) return pagos;
        return pagos.filter((p) =>
            [p.id_pago, formaPagoNombre(p), foliosDePago(p).join(" ")]
                .some((v) => String(v ?? "").toLowerCase().includes(q))
        );
    }, [pagos, searchValue]);

    const totalItems = filteredData.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredData.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredData, currentPage]);

    const renderCell = (key, row) => {
        switch (key) {
            case "id_pago":
                return `#${row.id_pago}`;
            case "fecha":
                return formatDate(row.fecha);
            case "forma_pago":
                return formaPagoNombre(row);
            case "descripcion":
                return `${row.descripcion}`;
            case "acciones":
                return (
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => setPagoSeleccionado(row)}
                    >
                        Ver
                    </button>
                );
            default:
                return row[key] ?? "";
        }
    };

    return (
        <div>
            <h3
                className="font-inter fw-medium mb-3"
                style={{ fontSize: "18px", color: "#0f1901" }}
            >
                Todos los pagos realizados
            </h3>
            <div className="row mb-2">
                <div className='col-3'>
                    <DatePicker
                        ref={pickerRef}
                        selectsRange
                        startDate={startDate}
                        endDate={endDate}
                        onChange={handleDateChange}
                        isClearable
                        placeholderText="Fecha de pago"
                        locale="es"
                        dateFormat="dd/MM/yyyy"
                        className="form-control form-control-sm"
                        autoComplete="off"
                    >
                        <div className="d-flex flex-wrap gap-1 p-2 border-top">
                            {PRESETS.map((p) => (
                                <button
                                    key={p.label}
                                    type="button"
                                    className="btn btn-sm btn-outline-secondary"
                                    onClick={() => applyPreset(p)}
                                >
                                    {p.label}
                                </button>
                            ))}
                        </div>
                    </DatePicker>
                </div>

                <div className="col-9 d-flex gap-2 ms-auto justify-content-end">
                    <SearchBar
                        value={searchValue}
                        onChange={(e) => {
                            setSearchValue(e.target.value);
                            setCurrentPage(1);
                        }}
                        placeholder="Buscar por pago, forma de pago, folio"
                        width="300px"
                    />
                    <ExportDocuments
                        data={filteredData}
                        columns={exportColumns}
                        filename="pagos-detalle"
                        sheetName="Pagos-Detalle"
                    />
                </div>
            </div>

            {error && <div className="alert alert-danger py-2">{error}</div>}
            {isLoading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="text-muted mt-2 font-poppins small">Cargando...</p>
                </div>
            ) : (
                <DataTable
                    columns={COLUMNS}
                    data={paginatedData}
                    renderCell={renderCell}
                    pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    onPageChange={setCurrentPage}
                    emptyMessage="No se encontraron pagos"
                    minWidth="600px"
                />
            )}

            {pagoSeleccionado && createPortal(
                <PagoDetalleModal
                    pago={pagoSeleccionado}
                    onClose={() => setPagoSeleccionado(null)}
                />,
                document.body
            )}
        </div>
    );
}