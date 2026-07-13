"use client";

import { useState } from "react";
import DataTable from "../common/DataTable";
import { bookingPassengersTableMock } from "@/mocks/bookingMock";
import ExportButton from "../common/ExportButton";
import SearchBar from "../common/SearchBar";

const COLUMNS = [
  { key: "nombre", label: "Pasajero", width: "216px", align: "start" },
  { key: "reserva", label: "Reserva", width: "216px", align: "start" },
  { key: "tipo", label: "Tipo", width: "216px", align: "start" },
  { key: "nacimiento", label: "Nacimiento", width: "216px", align: "start" },
  { key: "nacionalidad", label: "Nacionalidad", width: "216px", align: "start" },
];

const ITEMS_PER_PAGE = 5;

export default function BookingPassengers() {
  const [searchValue, setSearchValue] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredPassengers = bookingPassengersTableMock[0].pasajeros.filter(
    (passenger) => {
      const matchesSearch =
        passenger.nombre.toLowerCase().includes(searchValue.toLowerCase()) ||
        passenger.reserva.toLowerCase().includes(searchValue.toLowerCase());

      const matchesType =
        !typeFilter || passenger.tipo === typeFilter;

      return matchesSearch && matchesType;
    }
  );

  const paginatedPassengers = filteredPassengers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredPassengers.length / ITEMS_PER_PAGE);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("es-MX", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };


  const renderCell = (key, row) => {
    switch (key) {
      case "reserva":
        return (
          <a href="#" className="font-inter fw-semibold text-brand-blue" style={{ textDecoration: "none" }}>
            {row.reserva}
          </a>
        );

      case "tipo":
        const isAdult = row.tipo === "Adulto";

        return (
          <span
            style={{
              padding: "4px 8px",
              backgroundColor: isAdult ? "#E7F1FE" : "#FAEBF9",
              borderRadius: "12px",
              fontWeight: 600,
            }}
          >
            {row.tipo}
          </span>
        );

      case "nacimiento":
        return (
          <span>{formatDate(row.nacimiento)}</span>
        );

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
          Lista de pasajeros
        </h1>
        <div className="row g-3">
          <div className="col-6">
            <div
              className="bg-white transition-smooth d-flex justify-content-between align-items-center"
              style={{
                border: "1px solid rgba(161, 161, 170, 0.35)",
                borderRadius: "12px",
                padding: "12px 14px",
              }}
            >
              <span style={{ fontWeight: 600 }}>Adultos</span>
              <span className="card-passenger-number"> {bookingPassengersTableMock[0].adultos}</span>
            </div>
          </div>
          <div className="col-6">
            <div
              className="bg-white transition-smooth d-flex justify-content-between align-items-center"
              style={{
                border: "1px solid rgba(161, 161, 170, 0.35)",
                borderRadius: "12px",
                padding: "12px 14px",
              }}
            >
              <span style={{ fontWeight: 600 }}>Menores</span>
              <span className="card-passenger-number"> {bookingPassengersTableMock[0].menores}</span>
            </div>
          </div>
        </div>
        <div className="d-flex flex-column flex-lg-row justify-content-between gap-3">
          <div className="d-flex flex-column flex-sm-row flex-wrap gap-2">
            <ExportButton onExport={() => console.log("Exportar")} />
            <select name="tipo" id="tipo"
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
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="">Todos los tipos</option>
              <option value="Adulto">Adultos</option>
              <option value="Menor">Menores</option>
            </select>
          </div>
          <SearchBar
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Buscar por cliente, folio"
            width="300px"
          />
        </div>
        {bookingPassengersTableMock.map((group, index) => (
          <div key={index}>
            <DataTable
              columns={COLUMNS}
              data={paginatedPassengers}
              renderCell={renderCell}
              pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredPassengers.length}
              onPageChange={setCurrentPage}
            />
          </div>
        ))}
      </div>
    </div>
  );
}