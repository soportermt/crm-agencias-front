"use client";

import React from "react";
import Link from "next/link";
import DataTable from "@/components/common/DataTable";
import StatusBadge from "@/components/common/StatusBadge";

const COLUMNS = [
  { key: "id", label: "ID", sortable: true, width: "80px" },
  { key: "name", label: "Nombre Completo", sortable: true },
  { key: "city", label: "Ciudad", sortable: true },
  { key: "state", label: "Estado", sortable: true },
  { key: "status", label: "Estatus", sortable: true, align: "center", width: "140px" },
  { key: "actions", label: "Acciones", sortable: false, align: "center", width: "120px" },
];

export default function ClientTable({ clients = [], currentPage, totalPages, totalItems, onPageChange, onEdit }) {

  const renderCell = (key, row) => {
    if (key === "name") {
      const initials = row.name 
        ? (row.name.split(" ").filter(p => p.trim()).length >= 2 
            ? (row.name.split(" ").filter(p => p.trim())[0][0] + row.name.split(" ").filter(p => p.trim())[1][0]) 
            : row.name.substring(0, 2)).toUpperCase()
        : "CL";

      return (
        <div className="d-flex align-items-center gap-2">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 fw-bold animate-fade-in"
            style={{ width: "32px", height: "32px", backgroundColor: "#e7f1fe", color: "#0c5cc6", fontSize: "12px" }}
          >
            {initials}
          </div>
          <span className="fw-medium text-dark">{row.name}</span>
        </div>
      );
    }
    if (key === "status") {
      return <StatusBadge status={row.status} />;
    }
    if (key === "actions") {
      return (
        <div className="d-flex justify-content-center gap-2">
          <button
            className="btn btn-icon-custom d-flex align-items-center justify-content-center transition-smooth bg-brand-blue-light text-brand-blue"
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              border: "none",
            }}
            onClick={() => onEdit && onEdit(row)}
          >
            <i className="bi bi-pencil" style={{ fontSize: "12px" }}></i>
          </button>
          <Link href={`/clientes/${row.id}`} passHref>
            <button
              className="btn btn-icon-custom d-flex align-items-center justify-content-center transition-smooth bg-brand-blue-light text-brand-blue"
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                border: "none",
              }}
            >
              <i className="bi bi-eye" style={{ fontSize: "12px" }}></i>
            </button>
          </Link>
        </div>
      );
    }
    return row[key];
  };

  return (
    <DataTable
      columns={COLUMNS}
      data={clients}
      renderCell={renderCell}
      pagination={true}
      currentPage={currentPage || 1}
      totalPages={totalPages || 1}
      totalItems={totalItems || clients.length}
      onPageChange={onPageChange}
      emptyMessage="No se encontraron clientes."
    />
  );
}
