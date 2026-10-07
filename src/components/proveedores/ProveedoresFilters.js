"use client";

import React from "react";
import ExportButton from "@/components/common/ExportButton";
import SearchBar from "@/components/common/SearchBar";
import ExportDocuments from "../common/ExportDocuments";

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

  const exportColumns = [
    { header: "Nombre comercial", key: "nombre_comercial" },
    { header: "Correo", key: "correo" },
    { header: "Direccion", key: "direccion" },
    { header: "Comision", key: "comision" },
    { header: "Estatus", value: (row) => row.estatus === "A" ? "Activo" : "Inactivo" },
  ];

  return (
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-stretch align-items-md-center gap-3 mb-3 mt-1">
      <div className="d-flex align-items-center justify-content-between gap-2 w-100">
        <div style={{ maxWidth: "300px" }}>
          <SearchBar
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar proveedor..."
          />
        </div>
        <ExportDocuments
          data={filteredData}
          columns={exportColumns}
          filename="proveedores"
          sheetName="Proveedores"
        />
      </div>
    </div>
  );
}
