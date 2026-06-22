"use client";

import React from "react";
import Link from "next/link";
import DataTable from "@/components/common/DataTable";
import StatusBadge from "@/components/common/StatusBadge";

export default function ClientTable({ clients = [] }) {
  const columns = [
    { key: "id", label: "ID", sortable: true, width: "80px" },
    { key: "name", label: "Nombre Completo", sortable: true },
    { key: "username", label: "Usuario", sortable: true },
    { key: "city", label: "Ciudad", sortable: true },
    { key: "state", label: "Estado", sortable: true },
    { key: "status", label: "Estatus", sortable: true, align: "center", width: "140px" },
    { key: "actions", label: "Acciones", sortable: false, align: "center", width: "120px" },
  ];

  const renderCell = (key, row) => {
    if (key === "status") {
      return <StatusBadge status={row.status} />;
    }
    if (key === "actions") {
      return (
        <div className="d-flex justify-content-center gap-2">
          <button
            className="btn btn-icon-custom d-flex align-items-center justify-content-center transition-smooth"
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              backgroundColor: "#e7f1fe",
              border: "none",
              color: "#0c5cc6"
            }}
          >
            <i className="bi bi-pencil" style={{ fontSize: "12px" }}></i>
          </button>
          <Link href={`/clientes/${row.id}`} passHref>
            <button
              className="btn btn-icon-custom d-flex align-items-center justify-content-center transition-smooth"
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                backgroundColor: "#e7f1fe",
                border: "none",
                color: "#0c5cc6"
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
      columns={columns}
      data={clients}
      renderCell={renderCell}
      pagination={true}
      currentPage={1}
      totalPages={2}
      totalItems={clients.length}
      emptyMessage="No se encontraron clientes."
    />
  );
}
