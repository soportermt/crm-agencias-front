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

  const formatCurrency = (value) => {
    if (value == null || isNaN(value)) return "$0.00";
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(value);
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
