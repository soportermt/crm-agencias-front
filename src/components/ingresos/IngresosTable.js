"use client";

import React from "react";
import Link from "next/link";
import DataTable from "@/components/common/DataTable";
import SearchBar from "@/components/common/SearchBar";
import ExportButton from "@/components/common/ExportButton";
import StatusBadge from "@/components/common/StatusBadge";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { es } from "date-fns/locale";

registerLocale("es", es);

const COLUMNS = [
  { key: "folio", label: "Folio", width: "180px" },
  { key: "cliente", label: "Cliente", width: "225px" },
  { key: "descripcion", label: "Descripción", width: "155px" },
  { key: "tipo_servicio", label: "Servicio", width: "155px" },
  { key: "fecha_limite", label: "Límite pago", width: "155px" },
  { key: "tarifa_publica", label: "Total Publico", width: "100px" },
  { key: "fee", label: "Comisión", width: "100px" },
  { key: "moneda", label: "Moneda", width: "130px" },
  { key: "estatus", label: "Estatus", width: "130px", align: "center" },
];

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

function getEstatusByFechaLimite(fechaLimiteStr) {
  const fechaLimite = parseLocalDate(fechaLimiteStr);
  if (!fechaLimite) return "Pendiente";

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  fechaLimite.setHours(0, 0, 0, 0);

  const diffTime = fechaLimite.getTime() - hoy.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return "Vencido";
  } else if (diffDays <= 7) {
    return "Próximo a vencer";
  } else {
    return "Pendiente";
  }
}

function exportToCSV(data) {
  if (!data.length) return;

  const headers = ["Folio", "Cliente", "Descripción", "Servicio", "Límite pago", "Total Publico	", "Comisión", "Moneda", "Estatus"];

  const rows = data.map((row) => [
    row.folio,
    row.cliente,
    row.descripcion,
    row.tipo_servicio,
    row.fecha_limite,
    row.tarifa_publica,
    row.fee,
    row.moneda,
    getEstatusByFechaLimite(row.fecha_limite),
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
  link.setAttribute("download", `gestion_pagos_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

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
  startDate,
  endDate,
  onDateRangeChange,
}) {
  const isPendientes = activeTab === "pendientes";
  const formatCurrency = (value) => {
    if (value == null || isNaN(value)) return "$0.00";
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(value);
  };
  const handleDateChange = (dates) => {
    if (!dates) {
      onDateRangeChange({ startDate: null, endDate: null });
      return;
    }
    const [start, end] = dates;
    onDateRangeChange({ startDate: start, endDate: end });
  };

  const renderCell = (key, row) => {
    const estatusCalculado = getEstatusByFechaLimite(row.fecha_limite);

    switch (key) {
      case "folio":
        return (
          <span className="font-inter fw-semibold text-brand-blue">
            {row.folio}
          </span>
        );

      case "fecha_limite":
        return (
          <span
            className="font-inter"
            style={{
              color: estatusCalculado === "Vencido" ? "#af233a" : "#0f1901",
              fontWeight: estatusCalculado === "Vencido" ? 600 : 400,
            }}
          >
            {formatDateRange(row.fecha_limite)}
          </span>
        );

      case "tarifa_publica":
        return (
          <span className="font-inter fw-semibold">
            {formatCurrency(row.tarifa_publica)}
          </span>
        );

      case "fee":
        return (
          <span className="font-inter fw-semibold">
            {formatCurrency(row.fee)}
          </span>
        );

      case "fecha_limite":
        return (
          <span style={{ color: row.estatus === "Vencido" ? "#af233a" : "#0f1901" }}>
            {row.fecha_limite}
          </span>
        );

      case "estatus":
        return <StatusBadge status={estatusCalculado} />;

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
        {[
          { key: "pendientes", label: "Pendientes" },
          { key: "lista", label: "Lista de pagos" },
        ].map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={`btn border-0 transition-smooth ${isActive ? "bg-brand-blue-light text-brand-blue" : ""}`}
              style={{
                padding: "12px 24px",
                borderRadius: "24px",
                fontSize: "14px",
                color: isActive ? undefined : "rgba(0,0,0,0.4)",
                fontWeight: 500,
              }}
            >
              {tab.label}
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
                Consulta la información de tus pagos (filtra por límite de pago).
              </p>
            </div>
            <ExportButton onExport={() => exportToCSV(data)} disabled={data.length === 0} />
          </div>

        </div>
        {isPendientes ?
          <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="d-flex align-items-center gap-2">
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
                placeholder="Buscar por folio, cliente, descripcion o servicio..."
                width="350px"
              />
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
              emptyMessage="No se encontraron ventas"
              minWidth="1500px"
            />
          </div>
          :
          <div className="d-flex justify-content-center">En espera de caja</div>
        }
      </div>
    </div>
  );
}
