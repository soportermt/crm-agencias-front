import React, { useEffect, useMemo, useRef, useState } from 'react'
import DataTable from '../common/DataTable';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker, { registerLocale } from "react-datepicker";
import { es } from "date-fns/locale";
import {
    startOfDay, endOfDay, subDays,
    startOfWeek, endOfWeek, subWeeks,
    startOfMonth, endOfMonth, subMonths,
} from "date-fns";
import SearchBar from '../common/SearchBar';
import ExportDocuments from '../common/ExportDocuments';
import Link from 'next/link';
import { EyeIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

registerLocale("es", es);
const ITEMS_PER_PAGE = 15;
const columns = [
    { key: "folio", label: "Folio", width: "110px" },
    { key: "titulo_evento", label: "Titulo del evento", width: "150px" },
    { key: "pasajero_titular", label: "Pasajero titular", width: "150px" },
    { key: "num_habitaciones", label: "Habs.", width: "80px" },
    { key: "noches", label: "Noches", width: "80px" },
    { key: "hotel", label: "Hotel", width: "150px" },
    { key: "tipo_habitacion", label: "Tipo de habitación", align: "end", width: "100px" },
    { key: "acciones", label: "Acciones", width: "100px", align: "center" },
];

const gruposExportColumns = columns
    .filter((c) => c.key !== "acciones")
    .map(({ key, label }) => ({ key, label }));

const normalize = (s) =>
    String(s ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

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

export default function GruposTable({ data = [], filters, onFiltersChange, isLoading = false, onEditClick }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchValue, setSearchValue] = useState("");
    const pickerRef = useRef(null);

    const { startDate, endDate } = filters;

    const setFilter = (patch) => onFiltersChange((prev) => ({ ...prev, ...patch }));
    const handleDateChange = ([start, end]) => setFilter({ startDate: start, endDate: end });

    const applyPreset = (preset) => {
        handleDateChange(preset.range());
        pickerRef.current?.setOpen(false);
    };

    const rows = useMemo(
        () =>
            data.map((g) => {
                const venta = g.idVentaservicio?.idVenta;
                return {
                    ...g,
                    id_venta: venta?.id_venta ?? "—",
                    folio: venta?.folio ?? "—",
                    pasajero_titular: venta?.pasajero_titular ?? "—",
                    hotel: g.hotel,
                };
            }),
        [data]
    );

    const filteredData = useMemo(() => {
        const search = normalize(searchValue.trim());
        if (!search) return rows;

        return rows.filter((r) =>
            normalize(
                [r.folio, r.pasajero_titular, r.titulo_evento, r.hotel].join(" ")
            ).includes(search)
        );
    }, [rows, searchValue]);

    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
    const paginatedData = filteredData.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [searchValue, data]);

    const renderCell = (key, row) => {
        switch (key) {
            case "folio":
                return (
                    <Link
                        className="font-inter fw-semibold text-brand-blue"
                        style={{ textDecoration: "none" }}
                        href={`/reservaciones/editar/${row.id_venta}`}
                        target="_blank"
                    >
                        {row.folio}
                    </Link>
                );

            case "hotel":
            case "pasajero_titular":
                return <span className="font-inter fw-semibold">{row[key]}</span>;

            case "acciones":
                return (
                    <div className="d-flex align-items-center justify-content-center gap-1">
                        <a
                            href={`/grupos/${row.id_venta}`}
                            className="btn btn-link p-1 text-primary"
                        >
                            <EyeIcon style={{ width: "20px", height: "20px", color: "rgb(12, 92, 198)" }} />
                        </a>
                        <button
                            onClick={() => onEditClick(row)}
                            className="btn btn-link p-0 text-decoration-none text-start text-primary fw-medium"
                            style={{ whiteSpace: "normal", textAlign: "left", fontSize: 14 }}
                        >
                            <PencilSquareIcon style={{ width: "20px", height: "20px", color: "rgb(34, 124, 242)" }} /> {row[key]}
                        </button>
                        <a
                            href={`/grupos/${row.id_venta}`}
                            className="btn btn-link p-1 text-primary"
                        >
                            <TrashIcon style={{ width: "20px", height: "20px", color: "rgb(175, 35, 58)" }} />
                        </a>
                    </div>
                );

            default:
                return row[key];
        }
    };

    return (
        <div className='mt-4'>
            <div className="row g-3 justify-content-between align-items-center mb-2">
                <div className="col-12 col-lg-8">
                    <div className="col-12 col-md-4">
                        <DatePicker
                            ref={pickerRef}
                            selectsRange
                            startDate={startDate}
                            endDate={endDate}
                            onChange={handleDateChange}
                            isClearable
                            placeholderText="Fecha de venta"
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
                </div>
                <div className="col-12 col-lg-4 d-flex flex-column flex-sm-row justify-content-lg-end align-items-sm-center gap-2">
                    <div className="flex-grow-1 flex-sm-grow-0 w-100">
                        <SearchBar
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            placeholder="Buscar por folio, pasajero, evento, hotel"
                            width="300px"
                        />
                    </div>
                    <ExportDocuments
                        data={filteredData}
                        columns={gruposExportColumns}
                        filename="grupos"
                        sheetName="Grupos"
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="text-muted mt-2 font-poppins small">Cargando...</p>
                </div>
            ) : (
                <DataTable
                    columns={columns}
                    data={paginatedData}
                    renderCell={renderCell}
                    pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    onPageChange={setCurrentPage}
                    emptyMessage="No se encontraron resultados"
                    minWidth="1100px"
                />
            )}
        </div>
    )
}