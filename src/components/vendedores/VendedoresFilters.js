"use client";

import React from "react";
import ExportButton from "@/components/common/ExportButton";
import SearchBar from "@/components/common/SearchBar";
import ExportDocuments from "../common/ExportDocuments";

export default function VendedoresFilters({ searchTerm, onSearchChange, filteredData }) {
  const exportColumns = [
    { header: "Id", key: "id" },
    { header: "Nombre", key: "nombre" },
    { header: "Correo", key: "correo" },
    { header: "Telefono", key: "telefono" },
    { header: "Estatus", value: (row) => row.estatus === "1" ? "Activo" : "Inactivo" },
  ];
  

  return (
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-stretch align-items-md-center gap-3 mb-3 mt-1">
      <div className="d-flex align-items-center justify-content-between gap-2 w-100">
        <div  style={{ maxWidth: "300px" }}>
          <SearchBar
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar vendedor..."
        />
        </div>
        <ExportDocuments
          data={filteredData}
          columns={exportColumns}
          filename="vendedores"
          sheetName="Vendedores"
        />
      </div>
    </div>
  );
}
