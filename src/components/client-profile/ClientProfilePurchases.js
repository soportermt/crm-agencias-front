"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import SearchBar from "@/components/common/SearchBar";
import DataTable from "@/components/common/DataTable";
import DateRangeSelector from "@/components/common/DateRangeSelector";
import ExportButton from "@/components/common/ExportButton";
import FilterButton from "@/components/common/FilterButton";
import { clientsService } from "@/services/clients.service";

function exportToCSV(data) {
  if (!data.length) return;

  const headers = ["Folio", "Fecha de venta", "Destino", "Descripción", "Total", "Moneda"];

  const rows = data.map((row) => [
    row.folio,
    row.date,
    row.destination,
    row.description,
    row.total,
    row.currency,
  ]);

  const escapeCsvValue = (value) => {
    const str = String(value ?? "");
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const csvContent = [headers, ...rows]
    .map((r) => r.map(escapeCsvValue).join(","))
    .join("\n");

  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `historial_compras_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function ClientProfilePurchases({ clientId }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState({
    startDate: "2024-01-01",
    endDate: "2026-12-31",
  });
  const itemsPerPage = 2;

  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPurchases() {
      try {
        setLoading(true);
        if (clientId) {
          const data = await clientsService.getClientPurchases(clientId);
          const formattedData = data.map((d) => ({
            id: d.id,
            folio: d.title || `Folio ${d.id}`,
            date: d.date ? d.date.split("-").reverse().join("/") : "N/A",
            destination: d.destination || "No especificado",
            description: d.details || "Sin descripción",
            total: d.total || "$ 0.00",
            currency: d.currency || "MXN",
          }));
          setPurchases(formattedData);
        }
      } catch (error) {
        console.error("Error al cargar compras:", error);
      } finally {
        setLoading(false);
      }
    }
    loadPurchases();
  }, [clientId]);

  if (loading) {
    return <div className="text-center py-4"><div className="spinner-border text-primary" role="status"></div></div>;
  }


  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    const [day, month, year] = dateStr.split("/");
    return new Date(year, month - 1, day);
  };

  const filteredPurchases = purchases.filter((item) => {
    const matchesSearch =
      item.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.folio.toLowerCase().includes(searchTerm.toLowerCase());

    const itemDate = parseDate(item.date);
    const start = new Date(dateRange.startDate);
    const end = new Date(dateRange.endDate);
    end.setHours(23, 59, 59, 999);

    const matchesDate = !itemDate || (itemDate >= start && itemDate <= end);

    return matchesSearch && matchesDate;
  });

  const totalPages = Math.ceil(filteredPurchases.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPurchases = filteredPurchases.slice(startIndex, startIndex + itemsPerPage);

  const columns = [
    { key: "folio", label: "Folio", sortable: true, width: "225px" },
    { key: "date", label: "Fecha de venta", sortable: true, width: "155px" },
    { key: "destination", label: "Destino", sortable: true, width: "155px" },
    { key: "description", label: "Descripción", sortable: true, width: "155px" },
    { key: "total", label: "Total", sortable: true, width: "155px", align: "end" },
    { key: "currency", label: "Moneda", sortable: true, width: "130px" },
  ];

  const renderCell = (key, row) => {
    if (key === "folio") {
      return (
        <Link
          className="font-inter fw-semibold text-brand-blue"
          style={{ textDecoration: "none" }}
          href={`/reservaciones/editar/${row.id}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          {row.folio}
        </Link>
      );
    }
    return row[key];
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div>
      {/* Encabezado y Botón Exportar */}
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
        <h3 className="font-poppins h6 fw-semibold mb-0" style={{ color: "var(--dark-green)" }}>
          Historial de compras
        </h3>
        
        <ExportButton
          onExport={() => exportToCSV(filteredPurchases)}
          disabled={filteredPurchases.length === 0}
        />
      </div>

      {/* Filtros e Input de Búsqueda */}
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <DateRangeSelector
            startDate={dateRange.startDate}
            endDate={dateRange.endDate}
            onChange={setDateRange}
            showIcon={false}
          />
          
          <FilterButton>Activos</FilterButton>
        </div>

        <SearchBar value={searchTerm} onChange={handleSearchChange} />
      </div>

      <div style={{ border: "1px solid rgba(0,0,0,0.08)" }}>
        <DataTable
          columns={columns}
          data={paginatedPurchases}
          renderCell={renderCell}
          minWidth="1000px"
          emptyMessage="No se encontraron compras."
          pagination={true}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
}
