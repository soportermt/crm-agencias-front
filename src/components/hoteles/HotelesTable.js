"use client";

import React from "react";
import DataTable from "@/components/common/DataTable";

export default function HotelesTable({ hoteles }) {
  const columns = [
    { key: "id", label: "ID", sortable: true, align: "center", width: "80px" },
    { key: "nombre", label: "Nombre", sortable: true, align: "left" },
    { key: "destino", label: "Destino", sortable: true, align: "left" },
    { key: "zona", label: "Zona", sortable: true, align: "center" },
    { key: "calle", label: "Calle", sortable: true, align: "left" },
    { key: "colonia", label: "Colonia / Sector", sortable: true, align: "left" },
    { key: "cp", label: "CP", sortable: true, align: "center" },
    { key: "acciones", label: "Acciones", align: "center", width: "100px" },
  ];

  const renderCell = (colKey, row) => {
    if (colKey === "acciones") {
      return (
        <div className="d-flex justify-content-center">
          <a
            href="#"
            className="text-decoration-none fw-medium font-inter"
            style={{ color: "#0c5cc6", fontSize: "12px" }}
            onClick={(e) => {
              e.preventDefault();
              console.log("Editar hotel", row.id);
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
      data={hoteles}
      renderCell={renderCell}
      pagination={true}
      currentPage={1}
      totalPages={2}
      emptyMessage="No se encontraron hoteles."
    />
  );
}
