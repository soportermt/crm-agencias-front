"use client";

import React from "react";
import ExportButton from "@/components/common/ExportButton";
import SearchBar from "@/components/common/SearchBar";

export default function VendedoresFilters({ searchTerm, onSearchChange }) {
  return (
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-stretch align-items-md-center gap-3 mb-3 mt-4">
      <div className="d-flex align-items-center gap-3">
        <ExportButton onClick={() => console.log("Exportar")} />
      </div>
      <div className="w-100" style={{ maxWidth: "300px" }}>
        <SearchBar
          value={searchTerm}
          onChange={onSearchChange}
          placeholder="Buscar"
        />
      </div>
    </div>
  );
}
