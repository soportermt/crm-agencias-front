"use client";

import React, { useState, useEffect, useCallback } from "react";
import StatCard from "@/components/common/StatCard";
import AlertBanner from "@/components/common/AlertBanner";
import EgresosTable from "@/components/egresos/EgresosTable";
import {
  egresosPorOperadorMock,
  egresosEstadoCuentasMock,
} from "@/mocks/egresosMock";
import { egresosService } from "@/services/egresos.service";
import { catalogosService } from "@/services/catalogos.service";

function formatToYMD(date) {
  if (!date) return null;
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return null;

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
function getInitialMonthRange() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  return {
    startDate: new Date(year, month, 1),
    endDate: new Date(year, month + 1, 0),
  };
}

export default function EgresosPage() {
  const [activeTab, setActiveTab] = useState("pendientes");
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState(getInitialMonthRange);

  const [resumen, setResumen] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [loadingVentas, setLoadingVentas] = useState(false);
  const [servicioFilter, setServicioFilter] = useState("");

  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    async function loadChartData() {
      try {
        const dataResumen = await egresosService.getResumenVentas();
        const servicios = await catalogosService.servicios();
        setResumen(dataResumen);
        setServicios(servicios || []);
      } catch (err) {
        console.error("Error al cargar datos del dashboard:", err);
      }
    }

    loadChartData();
  }, []);

  const fetchVentas = useCallback(async () => {
    if (dateRange.startDate && !dateRange.endDate) return;

    try {
      setLoadingVentas(true);
      const strStart = formatToYMD(dateRange.startDate);
      const strEnd = formatToYMD(dateRange.endDate);

      const dataVentas = await egresosService.getVentas(strStart, strEnd, servicioFilter);
      setVentas(dataVentas || []);
    } catch (err) {
      console.error("Error al cargar ventas con filtro:", err);
    } finally {
      setLoadingVentas(false);
    }
  }, [dateRange, servicioFilter]);

  useEffect(() => {
    fetchVentas();
  }, [fetchVentas]);

  const parseSpanishDate = (dateStr) => {
    if (!dateStr) return null;
    const months = {
      "ene.": 0, "feb.": 1, "mar.": 2, "abr.": 3, "may.": 4, "jun.": 5,
      "jul.": 6, "ago.": 7, "sep.": 8, "oct.": 9, "nov.": 10, "dic.": 11,
      "ene": 0, "feb": 1, "mar": 2, "abr": 3, "may": 4, "jun": 5,
      "jul": 6, "ago": 7, "sep": 8, "oct": 9, "nov": 10, "dic": 11,
      "enero": 0, "febrero": 1, "marzo": 2, "abril": 3, "mayo": 4, "junio": 5,
      "julio": 6, "agosto": 7, "septiembre": 8, "octubre": 9, "noviembre": 10, "diciembre": 11
    };
    const cleanStr = dateStr.replace(/de\s+/g, "").trim().toLowerCase();
    const parts = cleanStr.split(/\s+/);
    if (parts.length < 3) return null;
    const day = parseInt(parts[0], 10);
    const month = months[parts[1]] ?? 0;
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
  };

  const filteredData = ventas.filter((row) => {
    const term = searchValue.toLowerCase();
    return (
      row.proveedor?.toLowerCase().includes(term) ||
      row.folio?.toLowerCase().includes(term) ||
      row.descripcion?.toLowerCase().includes(term) ||
      row.tipo_servicio?.toLowerCase().includes(term)
    );
  });

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE) || 1;
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchValue, servicioFilter]);

  const formatCurrency = (value) => {
    if (value == null || isNaN(value)) return "$0.00";
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(value);
  };

  return (
    <div className="container-fluid p-0">
      <div
        className="bg-white shadow-premium"
        style={{ borderRadius: "12px", padding: "24px" }}
      >
        <div className="d-flex flex-column" style={{ gap: "16px" }}>
          <h1
            className="font-inter fw-medium mb-0"
            style={{ fontSize: "24px", color: "#0f1901", lineHeight: "1.2" }}
          >
            Control de egresos
          </h1>

          <AlertBanner
            message="3 pagos vencen en los próximos 5 días"
            description="— Reserva #0042 (hotel), #0051 (vuelo), #0067 (operador). Revisa la pestaña Pendientes."
          />

          <div className="row g-4">
            <div className="col-12 col-sm-6 col-xl-3">
              <StatCard
                title={
                  <>
                    Total egresos en <span className="fw-semibold">{resumen?.mes}</span>
                  </>
                }
                value={formatCurrency(resumen?.total_egresos)}
                dashboard
                valueColor="#227cf2"
              />
            </div>
            <div className="col-12 col-sm-6 col-xl-3">
              <StatCard
                title="Pendientes de pago"
                value={formatCurrency(resumen?.total_pendientes_pago)}
                dashboard
                valueColor="#b9861f"
              />
            </div>
            <div className="col-12 col-sm-6 col-xl-3">
              <StatCard
                title="Vencidos"
                value={formatCurrency(resumen?.total_vencidos)}
                subtext={
                  <>
                    {resumen?.vencidos} ventas vencidos
                  </>
                }
                valueColor="#af233a"
              />
            </div>
            <div className="col-12 col-sm-6 col-xl-3">
              <StatCard
                title="Pagados este mes"
                value={formatCurrency(resumen?.total_pagados_mes)}
                subtext={
                  <>
                    {resumen?.pagados_mes} ventas este mes
                  </>
                }
                valueColor="#0e803c"
              />
            </div>
          </div>

          <EgresosTable
            activeTab={activeTab}
            onTabChange={setActiveTab}
            data={paginatedData}
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredData.length}
            onPageChange={setCurrentPage}
            onExport={() => console.log("Exportar egresos")}
            startDate={dateRange.startDate}
            endDate={dateRange.endDate}
            onDateRangeChange={setDateRange}
            porOperadorData={egresosPorOperadorMock}
            estadoCuentasData={egresosEstadoCuentasMock}
            servicios={servicios}
            servicioFilter={servicioFilter}
            onServicioFilterChange={setServicioFilter}
          />
        </div>
      </div>
    </div>
  );
}
