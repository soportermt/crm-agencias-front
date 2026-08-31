"use client";

import React, { useState } from "react";
import Link from "next/link";
import DataTable from "@/components/common/DataTable";
import SearchBar from "@/components/common/SearchBar";
import ExportButton from "@/components/common/ExportButton";
import PillBadge from "@/components/common/PillBadge";
import FilterButton from "@/components/common/FilterButton";
import OperadoresSummary from "./OperadoresSummary";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { es } from "date-fns/locale";

registerLocale("es", es);

const CATEGORY_STYLES = {
  Hospedaje: { backgroundColor: "#e7f1fe", color: "#0f1901" },
  Traslado: { backgroundColor: "#f4faeb", color: "#0f1901" },
  // Grupo:                   { backgroundColor: "rgba(230,174,44,0.1)", color: "#0f1901" },
  // Boda:                    { backgroundColor: "rgba(175,35,58,0.1)", color: "#af233a" },
  Circuitos: { backgroundColor: "rgba(64, 64, 64, 0.08)", color: "#0f1901" },
  // Vuelos:                  { backgroundColor: "#e7f1fe", color: "#227cf2" },
  // "Renta de autos":        { backgroundColor: "rgba(185,134,31,0.15)", color: "#b9861f" },
  // "Actividades Turísticas": { backgroundColor: "#ecfdf3", color: "#037847" },
  // "Renta de Transporte":   { backgroundColor: "rgba(230,174,44,0.15)", color: "#b9861f" },
  // Otros:                   { backgroundColor: "rgba(64,64,64,0.1)", color: "#0f1901" },
};

const DIAS_STYLES = {
  Vencido: { backgroundColor: "rgba(175,35,58,0.15)", color: "#af233a" },
  "Por vencer": { backgroundColor: "rgba(185,134,31,0.15)", color: "#b9861f" },
  Pendiente: { backgroundColor: "rgba(64,64,64,0.1)", color: "#0f1901" },
  Pagado: { backgroundColor: "#ecfdf3", color: "#037847" },
};

function parseLocalDate(dateString) {
  if (!dateString || dateString === "0000-00-00") return null;

  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatDateRange(inicio, fin) {
  const fechaInicio = parseLocalDate(inicio);

  if (!fechaInicio) return "-";

  const opts = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };

  const dInicio = fechaInicio.toLocaleDateString("es-MX", opts);

  if (
    !fin ||
    fin === "0000-00-00" ||
    fin === "0000-00-00 00:00:00" ||
    fin === inicio
  ) {
    return dInicio;
  }

  const fechaFin = parseLocalDate(fin);

  if (!fechaFin) return dInicio;

  const dFin = fechaFin.toLocaleDateString("es-MX", opts);

  return `${dInicio} a ${dFin}`;
}

function getDiasEstadoInfo(fechaLimite) {
  const fecha = parseLocalDate(fechaLimite);
  if (!fecha) return { estado: "Pendiente", diasLabel: "-" };

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  fecha.setHours(0, 0, 0, 0);

  const diffDias = Math.round((fecha - hoy) / (1000 * 60 * 60 * 24));

  if (diffDias < 0) {
    return { estado: "Vencido", diasLabel: "Vencido" };
  }
  if (diffDias <= 15) {
    return {
      estado: "Por vencer",
      diasLabel: diffDias === 0 ? "Hoy" : `${diffDias} día${diffDias === 1 ? "" : "s"}`,
    };
  }
  return { estado: "Pendiente", diasLabel: `${diffDias} días` };
}

function exportToCSV(data) {
  if (!data.length) return;

  const headers = ["Reserva", "Proveedor", "Categoría", "Servicio", "Tarifa publica", "Comisión", "Tarifa neta", "Moneda", "Fecha límite", "Días restantes", "Estado"];

  const rows = data.map((row) => [
    row.folio,
    row.proveedor,
    row.tipo_servicio,
    row.descripcion,
    row.tarifa_publica,
    row.comision,
    row.costo,
    row.moneda,
    row.fecha_limite,
    row.diasRestantes,
    row.estado,
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
  link.setAttribute("download", `egresos_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
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
  servicios = [],
  servicioFilter,
  onServicioFilterChange,
}) {

  const tabs = [
    { key: "pendientes", label: "Pendientes" },
    { key: "operadores", label: "Pagos a operadores" },
    { key: "vuelosHoteles", label: "Hoteles" },
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
      default:
        return [
          { key: "folio", label: "Reserva", width: "140px" },
          { key: "proveedor", label: "Proveedor", width: "225px" },
          { key: "tipo_servicio", label: "Categoría", width: "155px" },
          { key: "descripcion", label: "Servicio", width: "225px" },
          { key: "tarifa_publica", label: "Tarifa publica", width: "130px" },
          { key: "comision", label: "Comision", width: "130px" },
          { key: "costo", label: "Tarifa neta", width: "130px" },
          { key: "moneda", label: "Moneda", width: "130px" },
          { key: "fecha_limite", label: "Fecha límite", width: "130px" },
          { key: "diasRestantes", label: "Días restantes", width: "130px" },
          { key: "estado", label: "Estado", width: "130px" },
          // { key: "acciones", label: "Acciones", width: "130px" },
        ];
    }
  };

  const handleDateChange = (dates) => {
    if (!dates) {
      onDateRangeChange({ startDate: null, endDate: null });
      return;
    }
    const [start, end] = dates;
    onDateRangeChange({ startDate: start, endDate: end });
  };

  const formatCurrency = (value) => {
    if (value == null || isNaN(value)) return "$0.00";
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(value);
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

      case "tipo_servicio": {
        const catStyle = CATEGORY_STYLES[row.tipo_servicio] || { backgroundColor: "rgba(64,64,64,0.1)", color: "#0f1901" };
        return <PillBadge label={row.tipo_servicio} backgroundColor={catStyle.backgroundColor} color={catStyle.color} />;
      }

      case "tarifa_publica": {
        return (
          <span className="font-inter">
            {formatCurrency(row.tarifa_publica)}
          </span>
        );
      }

      case "comision": {
        return (
          <span className="font-inter">
            {formatCurrency(row.comision)}
          </span>
        );
      }

      case "costo": {
        return (
          <span className="font-inter fw-semibold">
            {formatCurrency(row.costo)}
          </span>
        );
      }

      case "fecha_limite": {
        return (
          <span className="font-inter fw-semibold">
            {formatDateRange(row.fecha_limite)}
          </span>
        );
      }

      case "diasRestantes": {
        const { estado, diasLabel } = getDiasEstadoInfo(row.fecha_limite);
        const style = DIAS_STYLES[estado] || { backgroundColor: "rgba(64,64,64,0.1)", color: "#0f1901" };
        return <PillBadge label={diasLabel} backgroundColor={style.backgroundColor} color={style.color} />;
      }
      
      case "estado": {
        const { estado } = getDiasEstadoInfo(row.fecha_limite);
        const style = DIAS_STYLES[estado] || { backgroundColor: "rgba(64,64,64,0.1)", color: "#0f1901" };
        return <PillBadge label={estado} backgroundColor={style.backgroundColor} color={style.color} />;
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
                  <ExportButton onExport={() => exportToCSV(data)} disabled={data.length === 0} />
                  <select
                    name="categorias"
                    className="btn d-flex align-items-center justify-content-center gap-2 border transition-smooth px-3"
                    style={{
                      height: "38px",
                      borderRadius: "8px",
                      borderColor: "#d0d5dd",
                      backgroundColor: "#fff",
                      fontSize: "13px",
                      color: "#0f1901",
                      fontWeight: 400,
                      appearance: "none",
                      textAlign: "start",
                      width: "fit-content",
                    }}
                    value={servicioFilter}
                    onChange={(e) => onServicioFilterChange(e.target.value)}
                  >
                    <option value="">Todas las categorias</option>
                    {servicios.map((s) => (
                      <option key={s.id_servicio} value={s.id_servicio}>
                        {s.tipo_servicio}
                      </option>
                    ))}
                  </select>
                  <DatePicker
                    selectsRange={true}
                    startDate={startDate}
                    endDate={endDate}
                    onChange={handleDateChange}
                    isClearable={true}
                    placeholderText="Filtrar por fecha límite"
                    locale="es"
                    dateFormat="dd/MM/yyyy"
                    className="form-control form-control-sm"
                    autoComplete="off"
                  />
                </div>
                <SearchBar
                  value={searchValue}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Buscar por reserva, proveedor, categoria o servicio..."
                  width="350px"
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
