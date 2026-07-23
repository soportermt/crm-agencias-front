"use client";

import React from "react";
import DataTable from "@/components/common/DataTable";
import StatusBadge from "@/components/common/StatusBadge";
import { mockBancos } from "@/mocks/configuracion";

export default function BancosTab() {
  const columns = [
    { key: "id", label: "ID", align: "center", width: "80px" },
    { key: "descripcion", label: "Descripción", align: "left" },
    { key: "cuenta", label: "Cuenta", align: "left" },
    { key: "estatus", label: "Estatus", align: "center" },
    { key: "acciones", label: "", align: "center", width: "100px" },
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
              console.log("Editar cuenta de banco", row.id);
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
    <div className="d-flex flex-column font-inter w-100">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0 fw-medium text-dark" style={{ fontSize: "18px", letterSpacing: "-0.126px" }}>
          Cuentas de banco
        </h5>
        <button
          className="btn btn-primary-custom d-flex align-items-center justify-content-center gap-2 shadow-premium"
          style={{ padding: "10px 16px", fontSize: "14px", borderRadius: "8px" }}
          onClick={() => console.log("Agregar cuenta de banco")}
        >
          <i className="bi bi-plus-lg"></i>
          <span>Agregar cuentas de banco</span>
        </button>
      </div>

      <div className="w-100">
        <DataTable
          columns={columns}
          data={mockBancos}
          renderCell={renderCell}
          pagination={false}
          emptyMessage="No se encontraron cuentas de banco."
          minWidth="100%"
        />
      </div>
    </div>
  );
}
