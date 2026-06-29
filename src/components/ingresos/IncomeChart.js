"use client";

import React, { useState } from "react";
import { DocumentArrowDownIcon } from "@heroicons/react/24/outline";

export default function IncomeChart({
  title = "Reporte de ingresos del año",
  data = [],
  onExport,
  barColor = "#619e05",
  barBgColor = "rgba(97,158,5,0.15)",
}) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const maxValue = Math.max(...data.map((d) => d.value));

  const formatCurrency = (value) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 0,
    }).format(value);

  return (
    <div
      className="bg-white border p-4 h-100 d-flex flex-column"
      style={{ borderRadius: "12px" }}
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <p
          className="font-inter mb-0"
          style={{ fontSize: "16px", color: "#0f1901" }}
        >
          <span className="fw-normal">Reporte de </span>
          <span className="fw-semibold">ingresos</span>
          <span className="fw-normal"> del año</span>
        </p>
        <button
          onClick={onExport}
          className="btn d-flex align-items-center gap-2 border-0"
          style={{
            backgroundColor: "#227cf2",
            color: "#f2f2f2",
            borderRadius: "12px",
            padding: "8px 12px",
            fontSize: "11px",
            fontWeight: 700,
            lineHeight: "18px",
          }}
        >
          <DocumentArrowDownIcon style={{ width: "16px", height: "16px" }} />
          <span>Exportar PDF</span>
        </button>
      </div>

      <div
        className="d-flex align-items-end flex-grow-1"
        style={{ gap: "8px", minHeight: "120px", position: "relative" }}
      >
        {data.map((item, index) => {
          const heightPercent = (item.value / maxValue) * 100;
          const isHovered = hoveredIndex === index;

          return (
            <div
              key={index}
              className="d-flex flex-column align-items-center flex-grow-1 h-100"
              style={{ position: "relative", minWidth: 0 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {isHovered && (
                <div
                  style={{
                    position: "absolute",
                    bottom: `calc(${heightPercent}% + 8px)`,
                    left: "50%",
                    transform: "translateX(-50%)",
                    backgroundColor: "#fff",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    borderRadius: "8px",
                    padding: "6px 10px",
                    whiteSpace: "nowrap",
                    zIndex: 10,
                    pointerEvents: "none",
                    textAlign: "center",
                  }}
                >
                  <p
                    className="font-jakarta fw-medium mb-0"
                    style={{ fontSize: "10px", color: "#71717a", lineHeight: "20px" }}
                  >
                    {item.month} 2025
                  </p>
                  <p
                    className="font-jakarta fw-bold mb-0"
                    style={{ fontSize: "11px", color: "#18181b", lineHeight: "22px" }}
                  >
                    {formatCurrency(item.value)}
                  </p>
                </div>
              )}

              <div
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: barBgColor,
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "flex-end",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: `${heightPercent}%`,
                    backgroundColor: barColor,
                    borderRadius: "10px",
                    transition: "height 0.3s ease",
                    opacity: isHovered ? 1 : 0.85,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div
        className="d-flex mt-2 font-inter fw-medium"
        style={{ gap: "0", color: "#52525b", fontSize: "12px" }}
      >
        {data.map((item, index) => (
          <div
            key={index}
            className="flex-grow-1 text-center"
            style={{ minWidth: 0 }}
          >
            {item.month}
          </div>
        ))}
      </div>
    </div>
  );
}
