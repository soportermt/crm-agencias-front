import React from "react";
import ExportButton from "@/components/common/ExportButton";
import SearchBar from "@/components/common/SearchBar";
import DateRangeSelector from "@/components/common/DateRangeSelector";
import FilterButton from "@/components/common/FilterButton";
import ExportDocuments from "../common/ExportDocuments";

export default function ClientFilters({
  searchTerm,
  onSearchChange,
  activeFilter,
  onFilterChange,
  startDate,
  endDate,
  onDateRangeChange,
  getExportData,
  exportColumns,
}) {
  const isActivosActive = activeFilter === "Activos";

  return (
    <div className="d-flex flex-column gap-3 mb-2">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h3 className="h6 fw-bold mb-0" style={{ color: "#0f1901" }}>
            Gestión de clientes
          </h3>
          <p className="text-secondary small mb-0" style={{ fontSize: "12px" }}>
            Consulta, filtra y actualiza información de tus clientes
          </p>
        </div>
      </div>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-stretch align-items-md-center gap-3">
        <div className="d-flex align-items-center gap-2 flex-wrap">
          {/* <DateRangeSelector
            startDate={startDate}
            endDate={endDate}
            onChange={onDateRangeChange}
            showIcon={false}
          /> */}

          <FilterButton
            onClick={() => onFilterChange(isActivosActive ? "Todos" : "Activos")}
            active={isActivosActive}
            style={{
              border: isActivosActive ? "1px solid #0c5cc6" : "1px solid rgba(0, 0, 0, 0.1)",
              backgroundColor: isActivosActive ? "#e7f1fe" : "#fff",
              color: isActivosActive ? "#0c5cc6" : "#3f3f46",
              fontWeight: isActivosActive ? "600" : "500",
            }}
          >
            <span>Activos</span>
          </FilterButton>
        </div>

        <div className="d-flex gap-2">
          <SearchBar
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar cliente..."
          />
          <ExportDocuments
            data={getExportData}
            columns={exportColumns}
            filename="clientes"
            sheetName="Clientes"
          />
        </div>
      </div>
    </div>
  );
}
