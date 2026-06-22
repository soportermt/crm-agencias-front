"use client";

import React from "react";
import ExportButton from "@/components/common/ExportButton";
import SearchBar from "@/components/common/SearchBar";

export default function ClientFilters({
  searchTerm,
  onSearchChange,
  activeFilter,
  onFilterChange,
}) {
  const isActivosActive = activeFilter === "Activos";

  return (
    <div className="d-flex flex-column gap-3 mb-4">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h3 className="h6 fw-bold mb-0" style={{ color: "#0f1901" }}>
            Gestión de clientes
          </h3>
          <p className="text-secondary small mb-0" style={{ fontSize: "12px" }}>
            Consulta, filtra y actualiza información de tus clientes
          </p>
        </div>
        <div>
          <ExportButton onExport={() => console.log("Exportando clientes...")} />
        </div>
      </div>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-stretch align-items-md-center gap-3">
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <div className="d-flex align-items-center gap-1.5 border px-2 py-1 bg-white" style={{ borderRadius: "8px", height: "38px" }}>
            <input
              type="date"
              className="border-0 bg-transparent text-secondary small"
              onClick={(e) => e.target.showPicker && e.target.showPicker()}
              style={{
                outline: "none",
                fontSize: "12px",
                width: "115px",
                cursor: "pointer",
              }}
            />
            <span className="text-secondary px-1" style={{ fontSize: "11px" }}>a</span>
            <input
              type="date"
              className="border-0 bg-transparent text-secondary small"
              onClick={(e) => e.target.showPicker && e.target.showPicker()}
              style={{
                outline: "none",
                fontSize: "12px",
                width: "115px",
                cursor: "pointer",
              }}
            />
          </div>

          <button
            onClick={() => onFilterChange(isActivosActive ? "Todos" : "Activos")}
            className={`btn d-flex align-items-center justify-content-center transition-smooth px-3`}
            style={{
              height: "38px",
              fontSize: "13px",
              borderRadius: "8px",
              border: isActivosActive ? "1px solid #0c5cc6" : "1px solid rgba(0, 0, 0, 0.1)",
              backgroundColor: isActivosActive ? "#e7f1fe" : "#fff",
              color: isActivosActive ? "#0c5cc6" : "#3f3f46",
              fontWeight: isActivosActive ? "600" : "500",
            }}
          >
            <span>Activos</span>
          </button>
        </div>

        <SearchBar
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar cliente..."
        />
      </div>
    </div>
  );
}
