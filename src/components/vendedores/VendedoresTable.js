"use client";

import React from "react";
import DataTable from "@/components/common/DataTable";
import StatusBadge from "@/components/common/StatusBadge";

export default function VendedoresTable({ vendedores }) {
  const columns = [
    { key: "id", label: "ID", sortable: true, align: "center", width: "118px" },
    { key: "nombre", label: "Nombre Completo", sortable: true, align: "center", width: "225px" },
    { key: "celular", label: "Num. Celular", sortable: true, align: "center", width: "155px" },
    { key: "correo", label: "Correo", sortable: true, align: "center", width: "155px" },
    { key: "nivel", label: "Nivel", sortable: true, align: "center", width: "155px" },
    { key: "estatus", label: "Estatus", sortable: true, align: "center", width: "130px" },
    { key: "acciones", label: "Acciones", align: "center" },
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
              console.log("Ver info", row.id);
            }}
          >
            Ver información
          </a>
        </div>
      );
    }
    return row[colKey];
  };

  return (
    <DataTable
      columns={columns}
      data={vendedores}
      renderCell={renderCell}
      pagination={true}
      currentPage={1}
      totalPages={2}
      emptyMessage="No se encontraron vendedores."
    />
  );
}
