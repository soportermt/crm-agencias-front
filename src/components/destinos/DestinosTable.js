"use client";

import React from "react";
import DataTable from "@/components/common/DataTable";
import StatusBadge from "@/components/common/StatusBadge";

export default function DestinosTable({ destinos }) {
  const columns = [
    { key: "id", label: "ID", sortable: true, align: "center", width: "80px" },
    { key: "codigo", label: "Código", sortable: true, align: "center" },
    { key: "nombre", label: "Nombre", sortable: true, align: "center" },
    { key: "descripcion", label: "Descripción", sortable: true, align: "center" },
    { key: "estatus", label: "Estatus", sortable: true, align: "center", width: "130px" },
    { key: "acciones", label: "Acciones", align: "center", width: "130px" },
  ];

  const renderCell = (colKey, row) => {
    if (colKey === "estatus") {
      return (
        <div className="d-flex justify-content-center">
          <StatusBadge status={row.estatus} />
        </div>
      );
    }
    if (colKey === "acciones") {
      return (
        <div className="d-flex justify-content-center">
          <a
            href="#"
            className="text-decoration-none fw-medium font-inter"
            style={{ color: "#0c5cc6", fontSize: "12px" }}
            onClick={(e) => {
              e.preventDefault();
              console.log("Editar", row.id);
            }}
          >
            Editar
          </a>
        </div>
      );
    }
    return row[colKey];
  };

  return (
    <DataTable
      columns={columns}
      data={destinos}
      renderCell={renderCell}
      pagination={true}
      currentPage={1}
      totalPages={1}
      emptyMessage="No se encontraron destinos."
    />
  );
}
