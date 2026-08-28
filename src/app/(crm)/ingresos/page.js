"use client";

import React, { useState, useEffect } from "react";
import IngresosTable from "@/components/ingresos/IngresosTable";
import {
  ingresosTableMock,
  pendientesTableMock,
} from "@/mocks/ingresosMock";
import Chart from "@/components/ingresos/Chart";
import { ingresosService } from "@/services/ingresos.service";

export default function IngresosPage() {
  const [activeTab, setActiveTab] = useState("pendientes");
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState({
    startDate: "2026-05-01",
    endDate: "2026-12-31",
  });

  const [data, setData] = useState([]);
  const [resumen, setResumen] = useState([]);

  const ITEMS_PER_PAGE = 5;

  const tableData =
    activeTab === "pendientes" ? pendientesTableMock : ingresosTableMock;

  const parseSpanishDate = (dateStr) => {
    if (!dateStr) return null;
    const months = {
      "ene.": 0, "feb.": 1, "mar.": 2, "abr.": 3, "may.": 4, "jun.": 5,
      "jul.": 6, "ago.": 7, "sep.": 8, "oct.": 9, "nov.": 10, "dic.": 11,
      "ene": 0, "feb": 1, "mar": 2, "abr": 3, "may": 4, "jun": 5,
      "jul": 6, "ago": 7, "sep": 8, "oct": 9, "nov": 10, "dic": 11
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
      row.cliente.toLowerCase().includes(searchValue.toLowerCase()) ||
      row.codigoConfirmacion.toLowerCase().includes(searchValue.toLowerCase());

    const rowDate = parseSpanishDate(row.limitePago);
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
    async function loadChartData() {
      try {
        const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null;
        const currentUser = storedUser ? JSON.parse(storedUser) : null;
        const idUsuario = currentUser?.id_usuario || currentUser?.id;
        const [dataAnio, dataResumen] = await Promise.all([
          idUsuario ? ingresosService.getReporteIngresosAnio(idUsuario) : Promise.resolve([]),
          idUsuario ? ingresosService.getResumenVentas(idUsuario) : Promise.resolve([]),
        ]);
        setData(dataAnio || []);
        setResumen(dataResumen || []);
      } catch (err) {
        console.error(err);
      }
    }

    loadChartData();
  }, []);

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
            Control de ingresos
          </h1>

          <Chart chart={data} resumen={resumen}/>

          <IngresosTable
            activeTab={activeTab}
            onTabChange={setActiveTab}
            data={paginatedData}
            searchValue={searchValue}
            onSearchChange={setSearchValue}
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
