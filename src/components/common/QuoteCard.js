"use client";

import React from "react";

export default function QuoteCard({ title, details, dateRange, type, icon }) {
  return (
    <div
      className="d-flex align-items-center justify-content-between p-3 flex-wrap gap-3"
      style={{
        backgroundColor: "#f2f2f2",
        borderRadius: "12px",
        width: "100%",
      }}
    >
      {/* Información Izquierda */}
      <div className="d-flex align-items-center gap-3">
        <div
          className="d-flex align-items-center justify-content-center bg-white rounded-3 shadow-sm"
          style={{
            width: "40px",
            height: "40px",
            flexShrink: 0,
          }}
        >
          {icon === "hotel" ? (
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
              lineHeight: "16px",
              color: "#1e293b",
            }}
          >
            {title}
          </p>
          <p
            className="fw-medium mb-0"
            style={{
              fontSize: "14px",
              lineHeight: "16px",
              color: "#1e293b",
            }}
          >
            {details}
          </p>
          <p
            className="mb-0"
            style={{
              fontSize: "14px",
              lineHeight: "16px",
              color: "rgba(64, 64, 64, 0.8)",
            }}
          >
            Fecha del servicio:{" "}
            <span className="fw-semibold">{dateRange}</span>
          </p>
        </div>
      </div>

      {/* Categoría Derecha */}
      <div className="d-flex flex-column align-items-end justify-content-center">
        <p
          className="fw-semibold mb-0"
          style={{
            fontSize: "15px",
            lineHeight: "16px",
            color: "#227cf2",
          }}
        >
          {type}
        </p>
      </div>
    </div>
  );
}
