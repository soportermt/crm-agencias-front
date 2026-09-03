"use client";

import React, { useState, useEffect, useCallback } from "react";
import IngresosTable, { getEstatusByFechaLimite } from "@/components/ingresos/IngresosTable";
import Chart from "@/components/ingresos/Chart";
import { ingresosService } from "@/services/ingresos.service";


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

export default function IngresosPage() {
  const [activeTab, setActiveTab] = useState("pendientes");
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState(getInitialMonthRange);

  const [statusFilter, setStatusFilter] = useState("");

  const [user, setUser] = useState(null);
  const [data, setData] = useState([]);
  const [resumen, setResumen] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [loadingVentas, setLoadingVentas] = useState(false);

  const ITEMS_PER_PAGE = 25;

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error("Error al parsear el usuario:", err);
    }
  }, []);

  useEffect(() => {
    const idUsuario = user?.id_usuario || user?.id;
    if (!idUsuario) return;

    async function loadChartData() {
      try {
        const [dataAnio, dataResumen] = await Promise.all([
          ingresosService.getReporteIngresosAnio(idUsuario),
          ingresosService.getResumenVentas(idUsuario),
        ]);

        setData(dataAnio || []);
        setResumen(dataResumen || []);
      } catch (err) {
        console.error("Error al cargar datos del dashboard:", err);
      }
    }

    loadChartData();
  }, [user]);

  const fetchVentas = useCallback(async () => {
    const idUsuario = user?.id_usuario || user?.id;
    if (!idUsuario) return;

    if (dateRange.startDate && !dateRange.endDate) return;

    try {
      setLoadingVentas(true);
      const strStart = formatToYMD(dateRange.startDate);
      const strEnd = formatToYMD(dateRange.endDate);

      const dataVentas = await ingresosService.getVentas(strStart, strEnd);
      setVentas(dataVentas || []);
    } catch (err) {
      console.error("Error al cargar ventas con filtro:", err);
    } finally {
      setLoadingVentas(false);
    }
  }, [user, dateRange]);

  useEffect(() => {
    fetchVentas();
  }, [fetchVentas]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchValue, dateRange, statusFilter]);

  const filteredData = ventas.filter((row) => {
    const term = searchValue.toLowerCase();
    const matchesSearch =
      row.cliente?.toLowerCase().includes(term) ||
      row.folio?.toLowerCase().includes(term) ||
      row.descripcion?.toLowerCase().includes(term) ||
      row.tipo_servicio?.toLowerCase().includes(term);

    const matchesStatus =
      !statusFilter || getEstatusByFechaLimite(row.fecha_limite) === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE) || 1;
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );


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
            Control de ingresos
          </h1>

          <Chart chart={data} resumen={resumen} />

          <IngresosTable
            activeTab={activeTab}
            onTabChange={setActiveTab}
            data={paginatedData}
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredData.length}
            onPageChange={setCurrentPage}
            onExport={() => console.log("Exportar tabla de ingresos")}
            startDate={dateRange.startDate}
            endDate={dateRange.endDate}
            onDateRangeChange={setDateRange}
          />
        </div>
      </div>
    </div>
  );
}
