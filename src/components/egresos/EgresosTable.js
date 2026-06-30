"use client";

import React from "react";
import Link from "next/link";
import DataTable from "@/components/common/DataTable";
import SearchBar from "@/components/common/SearchBar";
import ExportButton from "@/components/common/ExportButton";
import PillBadge from "@/components/common/PillBadge";
import DateRangeSelector from "@/components/common/DateRangeSelector";
import FilterButton from "@/components/common/FilterButton";
import OperadoresSummary from "./OperadoresSummary";

const CATEGORY_STYLES = {
  Hotel: { backgroundColor: "#e7f1fe", color: "#0f1901" },
  Vuelo: { backgroundColor: "#f4faeb", color: "#0f1901" },
  Operador: { backgroundColor: "rgba(230,174,44,0.1)", color: "#0f1901" },
};

const DIAS_STYLES = {
  Vencido: { backgroundColor: "rgba(175,35,58,0.15)", color: "#af233a" },
  "Por vencer": { backgroundColor: "rgba(185,134,31,0.15)", color: "#b9861f" },
  Pendiente: { backgroundColor: "rgba(64,64,64,0.1)", color: "#0f1901" },
  Pagado: { backgroundColor: "#ecfdf3", color: "#037847" },
};

function getDiasStyle(value) {
  if (DIAS_STYLES[value]) return DIAS_STYLES[value];
  if (value.includes("día")) return { backgroundColor: "rgba(185,134,31,0.15)", color: "#b9861f" };
  return { backgroundColor: "rgba(64,64,64,0.1)", color: "#0f1901" };
}

function getEstadoStyle(estado) {
  if (DIAS_STYLES[estado]) return DIAS_STYLES[estado];
  return { backgroundColor: "rgba(64,64,64,0.1)", color: "#0f1901" };
}

export default function EgresosTable({
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
  porOperadorData = [],
  estadoCuentasData = [],
}) {
  const tabs = [
    { key: "pendientes", label: "Pendientes" },
    { key: "operadores", label: "Pagos a operadores" },
    { key: "vuelosHoteles", label: "Vuelos y hoteles" },
    { key: "historial", label: "Historial", icon: "bi-arrow-counterclockwise" },
  ];

  const tableTitle = activeTab === "pendientes"
    ? "Egresos pendientes y vencidos"
    : activeTab === "operadores"
    ? "Pagos a operadores"
    : activeTab === "vuelosHoteles"
    ? "Vuelos y hoteles"
    : "Historial de egresos";

  const getColumns = () => {
    switch (activeTab) {
      case "vuelosHoteles":
        return [
          { key: "reserva", label: "Reserva", width: "140px" },
          { key: "categoria", label: "Categoría", width: "155px" },
          { key: "proveedor", label: "Proveedor", width: "225px" },
          { key: "servicio", label: "Servicio", width: "225px" },
          { key: "monto", label: "Monto", width: "130px" },
          { key: "fechaLimite", label: "Fecha límite", width: "130px" },
          { key: "estado", label: "Estados", width: "130px" },
          { key: "acciones", label: "Acciones", width: "130px" },
        ];
      case "historial":
        return [
          { key: "folio", label: "Folio", width: "140px" },
          { key: "reserva", label: "Reserva", width: "140px" },
          { key: "proveedor", label: "Proveedor", width: "225px" },
          { key: "categoria", label: "Categoría", width: "155px" },
          { key: "servicio", label: "Servicio", width: "225px" },
          { key: "monto", label: "Monto", width: "130px" },
          { key: "fechaLimite", label: "Fecha límite", width: "130px" },
          { key: "registradoPor", label: "Registrado por", width: "130px" },
          { key: "estado", label: "Estados", width: "130px" },
        ];
      default:
        return [
          { key: "reserva", label: "Reserva", width: "140px" },
          { key: "proveedor", label: "Proveedor", width: "225px" },
          { key: "categoria", label: "Categoría", width: "155px" },
          { key: "servicio", label: "Servicio", width: "225px" },
          { key: "monto", label: "Monto", width: "130px" },
          { key: "fechaLimite", label: "Fecha límite", width: "130px" },
          { key: "diasRestantes", label: "Días restantes", width: "130px" },
          { key: "estado", label: "Estados", width: "130px" },
          { key: "acciones", label: "Acciones", width: "130px" },
        ];
    }
  };

  const columns = getColumns();

  const renderCell = (key, row) => {
    switch (key) {
      case "folio":
        return (
          <span className="font-inter fw-semibold text-primary">
            {row.folio}
          </span>
        );

      case "registradoPor":
        return (
          <span>
            {row.registradoPor}
          </span>
        );

      case "reserva":
        return (
          <span className="font-inter fw-semibold text-primary">
            {row.reserva}
          </span>
        );

      case "categoria": {
        const catStyle = CATEGORY_STYLES[row.categoria] || { backgroundColor: "#e7f1fe", color: "#0f1901" };
        return <PillBadge label={row.categoria} backgroundColor={catStyle.backgroundColor} color={catStyle.color} />;
      }

      case "fechaLimite": {
        const isOverdue = row.estado === "Vencido";
        return (
          <span style={{ color: isOverdue ? "#af233a" : row.estado === "Por vencer" ? "#b9861f" : "#0f1901" }}>
            {row.fechaLimite}
          </span>
        );
      }

      case "diasRestantes": {
        const diasStyle = getDiasStyle(row.diasRestantes);
        return <PillBadge label={row.diasRestantes} backgroundColor={diasStyle.backgroundColor} color={diasStyle.color} />;
      }

      case "estado": {
        const estadoStyle = getEstadoStyle(row.estado);
        return <PillBadge label={row.estado} backgroundColor={estadoStyle.backgroundColor} color={estadoStyle.color} />;
      }

      case "acciones":
        return (
          <Link
            href={`/pagos/${row.id}`}
            className="text-decoration-none fw-semibold text-primary"
            style={{ fontSize: "13px" }}
          >
            Pagar
          </Link>
        );

      default:
        return row[key];
    }
  };

  const renderTableContent = () => {
    const tableComponent = (
      <DataTable
        columns={columns}
        data={data}
        renderCell={renderCell}
        pagination={true}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={onPageChange}
        emptyMessage="No se encontraron egresos."
        minWidth="1400px"
      />
    );

    if (activeTab === "operadores") {
      return (
        <div className="d-flex flex-column gap-4 px-3 pb-3">
          <OperadoresSummary
            porOperadorData={porOperadorData}
            estadoCuentasData={estadoCuentasData}
          />
          <div style={{ minWidth: 0, overflowX: "auto" }}>
            {tableComponent}
          </div>
        </div>
      );
    }

    return (
      <div className="px-3 pb-3">
        {tableComponent}
      </div>
    );
  };

  return (
    <div>
      <div className="d-flex align-items-center gap-2 mb-3" style={{ flexWrap: "wrap" }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={`btn border-0 transition-smooth d-flex align-items-center gap-2 ${isActive ? "bg-brand-blue-light text-brand-blue" : ""}`}
              style={{
                padding: "12px 24px",
                borderRadius: "24px",
                fontSize: "14px",
                color: isActive ? undefined : "rgba(0,0,0,0.4)",
                fontWeight: 500,
              }}
            >
              {tab.icon && <i className={tab.icon} style={{ fontSize: "14px" }}></i>}
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="bg-white" style={{ borderRadius: "12px" }}>
        <div className="px-3 pt-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div className="d-flex align-items-center gap-3">
              <h3
                className="font-inter fw-medium mb-0"
                style={{ fontSize: "18px", color: "#0f1901" }}
              >
                {tableTitle}
              </h3>
              <span
                className="font-inter"
                style={{ fontSize: "13px", color: "#a1a1aa" }}
              >
                Ordenado por fecha límite
              </span>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3">
            {activeTab === "historial" ? (
              <>
                <div className="d-flex align-items-center gap-2">
                  <ExportButton onExport={onExport} />
                  <FilterButton>Mayo 2026</FilterButton>
                  <FilterButton>Todas las categorías</FilterButton>
                </div>
                <SearchBar
                  value={searchValue}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Buscar por reserva, proveedor"
                  width="300px"
                />
              </>
            ) : (
              <>
                <div className="d-flex align-items-center gap-2">
                  <ExportButton onExport={onExport} />
                  <FilterButton>Todas las categorías</FilterButton>
                  <FilterButton>Todos los estados</FilterButton>
                  <DateRangeSelector
                    startDate={startDate}
                    endDate={endDate}
                    onChange={onDateRangeChange}
                    showIcon={false}
                  />
                </div>
                <SearchBar
                  value={searchValue}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Buscar"
                  width="300px"
                />
              </>
            )}
          </div>
        </div>

        {renderTableContent()}
      </div>
    </div>
  );
}
