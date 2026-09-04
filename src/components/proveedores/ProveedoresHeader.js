"use client";

import React from "react";

export default function ProveedoresHeader({ onAddVendedorClick }) {
  return (
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
      <div>
        <div className="d-flex align-items-center gap-2">
          <h5 className="mb-0 fw-semibold text-dark font-inter" style={{ fontSize: "18px" }}>
            Gestión de proveedores
          </h5>
        </div>
        <p className="text-secondary mb-0 mt-1 font-inter" style={{ fontSize: "13px", color: "#a1a1aa" }}>
          Consulta, filtra y actualiza la información de tus proveedores.
        </p>
      </div>
      <div className="w-100" style={{ maxWidth: "250px" }}>
        <button
          onClick={onAddVendedorClick}
          className="btn btn-primary-custom d-flex align-items-center justify-content-center gap-2 shadow-premium w-100"
          style={{
            padding: "10px 20px",
            fontSize: "14px",
            borderRadius: "8px",
          }}
        >
          <i className="bi bi-plus-lg"></i>
          <span>Agregar proveedor</span>
        </button>
      </div>
    </div>
  );
}
