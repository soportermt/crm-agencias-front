"use client";

import { useEffect, useState } from "react";
import DataTable from "../common/DataTable";
import { bookingPassengersTableMock } from "@/mocks/bookingMock";
import ExportButton from "../common/ExportButton";
import SearchBar from "../common/SearchBar";
import { bookingService } from "@/services/booking.service";
import Link from "next/link";

const COLUMNS = [
  { key: "nombre", label: "Pasajero", width: "50px", align: "start" },
  { key: "folio", label: "Reserva", width: "50px", align: "start" },
  { key: "tipo", label: "Tipo", width: "50px", align: "start" },
];

const ITEMS_PER_PAGE = 25;

export default function BookingPassengers() {
  const [searchValue, setSearchValue] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [passengers, setPassengers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function cargarPasajeros() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await bookingService.pasajeros();
        setPassengers(data);
      } catch (err) {
        console.error("Error al cargar pasajeros:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }

    cargarPasajeros();
  }, []);

  const filteredPassengers = passengers.filter(
    (passenger) => {
      const matchesSearch =
        passenger.nombre.toLowerCase().includes(searchValue.toLowerCase()) ||
        passenger.folio.toLowerCase().includes(searchValue.toLowerCase());

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

  const adultos = passengers.filter(p => p.tipo === "Adulto").length;
  const menores = passengers.filter(p => p.tipo === "Menor").length;

  const renderCell = (key, row) => {
    switch (key) {
      case "folio":
        return (
          <Link
            href="#"
            className="font-inter fw-semibold text-brand-blue"
            style={{ textDecoration: "none" }}
          >
            {row.folio}
          </Link>
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
              <span className="card-passenger-number"> {adultos}</span>
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
              <span className="card-passenger-number"> {menores}</span>
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
    </div>
  );
}