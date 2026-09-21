"use client";
import CajaTable from "@/components/caja/CajaTable";
import { cajaService } from "@/services/caja.service";
import React, { useEffect, useState } from "react";

const toYMD = (d) =>
  d
    ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
    : null;
export default function Caja() {
  const [caja, setCaja] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    cliente: "",
    vendedor: "",
  });

  useEffect(() => {
    if (filters.startDate && !filters.endDate) return;
    let cancelado = false;
    async function cargarVentas() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await cajaService.caja(
          toYMD(filters.startDate),
          toYMD(filters.endDate),
          filters.cliente || null,
          filters.vendedor || null
        );
        if (!cancelado) setCaja(data);
      } catch (err) {
        console.error("Error al cargar ventas:", err);
        if (!cancelado) setError("No se pudieron cargar las ventas");
      } finally {
        if (!cancelado) setIsLoading(false);
      }
    }

    cargarVentas();
    return () => {
      cancelado = true;
    };
  }, [filters]);

  return (
    <div className="container-fluid p-0">
      <div className="bg-white p-4 shadow-premium" style={{ borderRadius: "12px" }}>
        <h1
          className="font-inter fw-medium mb-1"
          style={{ color: "#0f1901", fontSize: "20px", lineHeight: "1.2" }}
        >
          Gestión de caja
        </h1>

        {error && <div className="alert alert-danger mt-3">{error}</div>}
        {isLoading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="text-muted mt-2 font-poppins small">Cargando...</p>
          </div>
        ) : (
          <CajaTable
          ventas={caja}
          filters={filters}
          onFiltersChange={setFilters}
        />
        )}
      </div>
    </div>
  );
}