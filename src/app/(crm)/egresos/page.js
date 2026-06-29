"use client";

import React, { useState, useEffect } from "react";
import StatCard from "@/components/common/StatCard";
import AlertBanner from "@/components/common/AlertBanner";
import EgresosTable from "@/components/egresos/EgresosTable";
import {
  egresosMetricsMock,
  egresosPendientesMock,
  egresosOperadoresMock,
  egresosVuelosHotelesMock,
  egresosHistorialMock,
  egresosPorOperadorMock,
  egresosEstadoCuentasMock,
} from "@/mocks/egresosMock";

const TAB_DATA = {
  pendientes: egresosPendientesMock,
  operadores: egresosOperadoresMock,
  vuelosHoteles: egresosVuelosHotelesMock,
  historial: egresosHistorialMock,
};

export default function EgresosPage() {
  const [activeTab, setActiveTab] = useState("pendientes");
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState({
    startDate: "2025-05-01",
    endDate: "2025-12-31",
  });

  const ITEMS_PER_PAGE = 5;

  const tableData = TAB_DATA[activeTab] || egresosPendientesMock;

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

  const filteredData = tableData.filter((row) => {
    const matchesSearch =
      row.proveedor.toLowerCase().includes(searchValue.toLowerCase()) ||
      row.reserva.toLowerCase().includes(searchValue.toLowerCase()) ||
      row.servicio.toLowerCase().includes(searchValue.toLowerCase());

    const rowDate = parseSpanishDate(row.fechaLimite);
    const start = new Date(dateRange.startDate);
    const end = new Date(dateRange.endDate);
    end.setHours(23, 59, 59, 999);

    const matchesDate = !rowDate || (rowDate >= start && rowDate <= end);

    return matchesSearch && matchesDate;
  });

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchValue]);

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
                title="Total egresos mayo"
                value={egresosMetricsMock.totalEgresos.value}
                subtext={egresosMetricsMock.totalEgresos.subtext}
                valueColor="#227cf2"
              />
            </div>
            <div className="col-12 col-sm-6 col-xl-3">
              <StatCard
                title="Pendientes de pago"
                value={egresosMetricsMock.pendientesPago.value}
                subtext={egresosMetricsMock.pendientesPago.subtext}
                valueColor="#b9861f"
              />
            </div>
            <div className="col-12 col-sm-6 col-xl-3">
              <StatCard
                title="Vencidos"
                value={egresosMetricsMock.vencidos.value}
                linkText="Ver detalles"
                valueColor="#af233a"
              />
            </div>
            <div className="col-12 col-sm-6 col-xl-3">
              <StatCard
                title="Pagados este mes"
                value={egresosMetricsMock.pagadosEsteMes.value}
                subtext={egresosMetricsMock.pagadosEsteMes.subtext}
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
          />
        </div>
      </div>
    </div>
  );
}
