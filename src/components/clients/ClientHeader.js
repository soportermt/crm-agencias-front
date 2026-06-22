"use client";

import React from "react";

export default function ClientHeader({ onRegisterClientClick }) {
  return (
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
      <div>
        <h1 className="h3 fw-bold mb-1" style={{ color: "#0f1901" }}>
          Control de clientes
        </h1>
        <p className="text-secondary small mb-0" style={{ color: "rgba(0, 0, 0, 0.4)", fontSize: "13px" }}>
          47 clientes registrados
        </p>
      </div>
      <button
        onClick={onRegisterClientClick}
        className="btn btn-primary-custom d-flex align-items-center gap-2 shadow-premium"
        style={{
          padding: "10px 20px",
          fontSize: "14px",
          borderRadius: "8px",
        }}
      >
        <i className="bi bi-plus-lg"></i>
        <span>Agregar cliente</span>
      </button>
    </div>
  );
}
