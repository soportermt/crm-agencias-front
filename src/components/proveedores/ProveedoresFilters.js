"use client";

import React from "react";
import ExportButton from "@/components/common/ExportButton";
import SearchBar from "@/components/common/SearchBar";

export default function ProveedoresFilters({ searchTerm, onSearchChange, filteredData }) {

  function exportToCSV(data) {
    if (!data.length) return;

    const headers = ["Nombre comercial", "Correo electrónico", "Dirección", "Comisión", "Estatus"];

    const rows = data.map((row) => [
      row.nombre_comercial,
      row.correo,
      row.direccion,
      row.comision,
      row.estatus === "A" ? "Activo" : "Inactivo",
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
    link.setAttribute("download", `proveedores_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-stretch align-items-md-center gap-3 mb-3 mt-4">
      <div className="d-flex align-items-center gap-3">
        <ExportButton onExport={() => exportToCSV(filteredData)} disabled={filteredData.length === 0} />
      </div>
      <div className="w-100" style={{ maxWidth: "300px" }}>
        <SearchBar
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar proveedor..."
        />
      </div>
    </div>
  );
}
