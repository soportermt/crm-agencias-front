import React from "react";

export default function ExportButton({ onExport, disabled = false, className = "" }) {
  return (
    <button
      onClick={onExport}
      disabled={disabled}
      className={`btn d-flex align-items-center gap-2 px-3 py-2 transition-smooth ${className}`}
      style={{
        backgroundColor: "#e7f1fe",
        border: "1px solid #0c5cc6",
        borderRadius: "8px",
        color: "#0c5cc6",
        fontSize: "13px",
        fontWeight: 500,
      }}
    >
      <i className="bi bi-cloud-arrow-down-fill"></i>
      <span>Exportar</span>
    </button>
  );
}
