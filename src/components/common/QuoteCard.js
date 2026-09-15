"use client";

import React from "react";

export default function QuoteCard({ title, details, dateRange, type, icon, pdfUrl, amount, userName }) {
  const connectivityBase = process.env.NEXT_PUBLIC_CONNECTIVITY_API_URL?.replace(/\/$/, "") || "http://localhost:4000";
  const fullPdfUrl = pdfUrl ? (pdfUrl.startsWith("http") ? pdfUrl : `${connectivityBase}${pdfUrl}`) : null;

  return (
    <div
      className="d-flex align-items-center justify-content-between p-3 flex-wrap gap-3"
      style={{
        backgroundColor: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        width: "100%",
      }}
    >
      {/* Información Izquierda */}
      <div className="d-flex align-items-center gap-3">
        <div
          className="d-flex align-items-center justify-content-center bg-white rounded-3 shadow-sm"
          style={{
            width: "42px",
            height: "42px",
            flexShrink: 0,
            border: "1px solid #f1f5f9",
          }}
        >
          {pdfUrl ? (
            <i
              className="bi bi-file-earmark-pdf-fill text-danger"
              style={{ fontSize: "22px" }}
            ></i>
          ) : icon === "hotel" ? (
            <i
              className="bi bi-building-fill"
              style={{ fontSize: "20px", color: "#1e293b" }}
            ></i>
          ) : (
            <i
              className="bi bi-bus-front-fill"
              style={{ fontSize: "20px", color: "#1e293b" }}
            ></i>
          )}
        </div>
        <div className="d-flex flex-column justify-content-center" style={{ gap: "4px" }}>
          <p
            className="fw-semibold mb-0"
            style={{
              fontSize: "15px",
              lineHeight: "18px",
              color: "#1e293b",
            }}
          >
            {title}
          </p>
          <p
            className="fw-normal mb-0"
            style={{
              fontSize: "13px",
              lineHeight: "16px",
              color: "#64748b",
            }}
          >
            {details}
            {userName ? ` • Enviado por: ${userName}` : ""}
          </p>
          <p
            className="mb-0"
            style={{
              fontSize: "13px",
              lineHeight: "16px",
              color: "#64748b",
            }}
          >
            Fecha: <span className="fw-semibold text-dark">{dateRange}</span>
          </p>
        </div>
      </div>

      {/* Categoría y Acciones Derecha */}
      <div className="d-flex align-items-center gap-3 ms-auto">
        <div className="d-flex flex-column align-items-end justify-content-center">
          {amount !== null && amount !== undefined && Number(amount) > 0 && (
            <span className="fw-bold text-dark mb-1" style={{ fontSize: "15px" }}>
              ${Number(amount).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
            </span>
          )}
          <span
            className="badge bg-primary-subtle text-primary px-2 py-1 rounded-pill fw-medium"
            style={{ fontSize: "12px" }}
          >
            {type}
          </span>
        </div>

        {fullPdfUrl && (
          <a
            href={fullPdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
            style={{ borderRadius: "8px", fontSize: "12px", padding: "6px 12px" }}
            title="Ver o descargar PDF"
          >
            <i className="bi bi-download"></i>
            <span>Ver PDF</span>
          </a>
        )}
      </div>
    </div>
  );
}
