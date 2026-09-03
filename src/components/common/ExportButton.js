import React from "react";
import { CloudArrowDownIcon } from "@heroicons/react/24/outline";

export default function ExportButton({ onExport, disabled = false, className = "" }) {
  return (
    <button
      onClick={onExport}
      disabled={disabled}
      className={`btn d-flex align-items-center gap-2 px-2 py-0 transition-smooth ${className}`}
      style={{
        backgroundColor: "#e7f1fe",
        border: "1px solid #0c5cc6",
        borderRadius: "8px",
        color: "#0c5cc6",
        fontSize: "12px",
        fontWeight: 500,
        width: "fit-content",
        height:30
      }}
    >
      <CloudArrowDownIcon style={{ width: "18px", height: "18px" }} />
      <span>Exportar</span>
    </button>
  );
}
