"use client";

import { useState } from "react";
import DataTable from "../common/DataTable";
import ExportButton from "../common/ExportButton";
import SearchBar from "../common/SearchBar";
import StatusBadge from "../common/StatusBadge";
import { bookingListTableMock } from "@/mocks/bookingMock";

const COLUMNS = [
    { key: "folio", label: "Folio", width: "140px", align: "start" },
    { key: "cliente", label: "Cliente", width: "225px", align: "start" },
    { key: "hotel", label: "Hotel", width: "155px", align: "start" },
    { key: "plan", label: "Tipo de plan", width: "130px", align: "start" },
    { key: "estancia", label: "Fecha de estancia", width: "225px", align: "start" },
    { key: "destino", label: "Destino", width: "130px", align: "start" },
    { key: "total", label: "Total", width: "130px", align: "start" },
    { key: "estatus", label: "Estatus", width: "130px", align: "center" },
];

const ITEMS_PER_PAGE = 5;

export default function BookingList() {
    const [searchValue, setSearchValue] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [destinationFilter, setDestinationFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const filteredData = bookingListTableMock.filter((row) => {
        const matchesSearch =
            row.cliente.toLowerCase().includes(searchValue.toLowerCase()) ||
            row.folio.toLowerCase().includes(searchValue.toLowerCase());

        const matchesStatus =
            !statusFilter || row.estatus === statusFilter;

        const matchesDestination =
            !destinationFilter || row.destino === destinationFilter;

        return (
            matchesSearch &&
            matchesStatus &&
            matchesDestination
        );
    });

    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

    const paginatedData = filteredData.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const renderCell = (key, row) => {
        switch (key) {
            case "folio":
                return (
                    <a href="#" className="font-inter fw-semibold text-brand-blue" style={{ textDecoration: "none" }}>
                        {row.folio}
                    </a>
                );

            case "estatus":
                return <StatusBadge status={row.estatus} />;

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
                        <ExportButton  onExport={() => console.log("Exportar")} />
                        <select name="estado" id="estado"
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
                            onChange={(e) => onStatusFilterChange(e.target.value)}
                        >
                            <option value="">Todos los estados</option>
                            <option value="Pagado">Pagados</option>
                            <option value="Vigente">Vigente</option>
                        </select>
                        <select name="destino" id="destino"
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
                            onChange={(e) => onDestinationFilterChange(e.target.value)}
                        >
                            <option value="">Todos los destinos</option>
                            <option value="Cancún">Cancún</option>
                            <option value="Playa del Carmen">Playa del Carmen</option>
                        </select>
                    </div>
                    <SearchBar
                        value={searchValue}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Buscar por cliente, folio"
                        width="300px"
                    />
                </div>

                <DataTable
                    columns={COLUMNS}
                    data={paginatedData}
                    renderCell={renderCell}
                    pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={filteredData.length}
                    onPageChange={setCurrentPage}
                    emptyMessage="No se encontraron reservas."
                    minWidth="1265px"
                />
            </div>
        </div>
    );
}