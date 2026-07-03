"use client";

import React from "react";
import Link from "next/link";
import DataTable from "@/components/common/DataTable";
import SearchBar from "@/components/common/SearchBar";
import ExportButton from "@/components/common/ExportButton";
import StatusBadge from "@/components/common/StatusBadge";
import DateRangeSelector from "@/components/common/DateRangeSelector";
import FilterButton from "@/components/common/FilterButton";

const COLUMNS = [
  { key: "id", label: "ID", width: "80px" },
  { key: "codigoConfirmacion", label: "Código de confirmación", width: "225px" },
  { key: "cliente", label: "Cliente", width: "225px" },
  { key: "metodoPago", label: "Método pago", width: "155px" },
  { key: "tipoPago", label: "Tipo pago", width: "155px" },
  { key: "limitePago", label: "Límite pago", width: "155px" },
  { key: "total", label: "Total", width: "155px" },
  { key: "moneda", label: "Moneda", width: "130px" },
  { key: "estatus", label: "Estatus", width: "130px", align: "center" },
  { key: "acciones", label: "Acciones", width: "174px", align: "center" },
];

export default function IngresosTable({
  activeTab,
  onTabChange,
  data,
  searchValue,
  onSearchChange,
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  onExport,
  startDate,
  endDate,
  onDateRangeChange,
}) {

  const renderCell = (key, row) => {
    switch (key) {
      case "codigoConfirmacion":
        return (
          <span className="font-inter fw-semibold text-brand-blue">
            {row.codigoConfirmacion}
          </span>
        );

      case "limitePago":
        return (
          <span style={{ color: row.estatus === "Vencido" ? "#af233a" : "#0f1901" }}>
            {row.limitePago}
          </span>
        );

      case "estatus":
        return <StatusBadge status={row.estatus} />;

      case "acciones":
        return (
          <Link
            href={`/pagos/${row.id}`}
            className="text-decoration-none fw-medium text-brand-blue"
            style={{ fontSize: "12px" }}
          >
            Ver información
          </Link>
        );

      default:
        return row[key];
    }
  };

  return (
    <div>
      <div className="d-flex align-items-center gap-2 mb-3">
        {["pendientes", "lista"].map((tab) => {
          const isActive = activeTab === tab;
          const label = tab === "pendientes" ? "Pendientes" : "Lista de pagos";
          return (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`btn border-0 transition-smooth ${isActive ? "bg-brand-blue-light text-brand-blue" : ""}`}
              style={{
                padding: "12px 24px",
                borderRadius: "24px",
                fontSize: "14px",
                color: isActive ? undefined : "rgba(0,0,0,0.4)",
                fontWeight: isActive ? 500 : 500,
                overflow: "hidden",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="bg-white" style={{ borderRadius: "12px" }}>
        <div className="px-0 pt-3">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <h3
                  className="font-inter fw-medium mb-0"
                  style={{ fontSize: "18px", color: "#0f1901" }}
                >
                  Gestión de pagos
                </h3>
              </div>
              <p
                className="font-inter mb-0"
                style={{ fontSize: "13px", color: "#a1a1aa" }}
              >
                Consulta la información de tus pagos.
              </p>
            </div>
            <ExportButton onExport={onExport} />
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex align-items-center gap-2">
              <DateRangeSelector
                startDate={startDate}
                endDate={endDate}
                onChange={onDateRangeChange}
                showIcon={false}
              />
              <FilterButton>
                <span>
                  Sucursal{" "}
                  <span className="fw-semibold">Viajemos Juntos ATM</span>
                </span>
                <i
                  className="bi bi-chevron-down"
                  style={{ fontSize: "12px" }}
                ></i>
              </FilterButton>
            </div>
            <SearchBar
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar"
              width="300px"
            />
          </div>
        </div>

        <DataTable
          columns={COLUMNS}
          data={data}
          renderCell={renderCell}
          pagination={true}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          onPageChange={onPageChange}
          emptyMessage="No se encontraron pagos."
          minWidth="1500px"
        />
      </div>
    </div>
  );
}
