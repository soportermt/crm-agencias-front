"use client";

import React from "react";

export default function DocumentCard({ name, size, type, url, onDelete, onDownload }) {
  return (
    <div
      className="d-flex align-items-center justify-content-between px-3 py-2 w-100"
      style={{
        backgroundColor: "#f5f5f5",
        borderRadius: "12px",
        minHeight: "56px",
      }}
    >
      <div className="d-flex align-items-center gap-3">
        {/* File Icon */}
        <div
          className="d-flex align-items-center justify-content-center rounded text-white"
          style={{
            width: "28px",
            height: "28px",
            backgroundColor: type === "PDF" ? "#e11d48" : "#0c5cc6",
            fontSize: "9px",
            fontWeight: "bold",
            flexShrink: 0,
          }}
        >
          {type}
        </div>
        <div className="d-flex flex-column" style={{ gap: "2px" }}>
          <p
            className="fw-normal mb-0"
            style={{
              fontSize: "12px",
              lineHeight: "16px",
              color: "#0f1901",
            }}
          >
            {name}
          </p>
          <p
            className="mb-0 text-muted"
            style={{
              fontSize: "12px",
              lineHeight: "16px",
              color: "rgba(0, 0, 0, 0.4)",
            }}
          >
            {size} • {type}
          </p>
        </div>
      </div>

      {/* Acciones */}
      <div className="d-flex align-items-center gap-3">
        <a
          href={url || "#"}
          target={url ? "_blank" : "_self"}
          rel="noopener noreferrer"
          onClick={(e) => {
            if (!url && onDownload) {
              e.preventDefault();
              onDownload();
            }
          }}
          className="fw-semibold text-decoration-none"
          style={{
            fontSize: "14px",
            lineHeight: "16px",
            color: "#0c5cc6",
            cursor: "pointer",
          }}
        >
          Ver / Descargar
        </a>

        {onDelete && (
          <button
            onClick={onDelete}
            className="btn btn-link p-0 text-danger text-decoration-none"
            style={{ fontSize: "14px", fontWeight: "500" }}
          >
            Eliminar
          </button>
        )}
      </div>
    </div>
  );
}
