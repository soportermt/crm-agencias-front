"use client";

import React from "react";

export default function StatCard({
  title,
  value,
  trend = "none",
  onLinkClick = (e) => e.preventDefault(),
}) {
  const isUp = trend === "up";
  const isDown = trend === "down";
  const isUser = trend === "user";

  return (
    <div
      className="p-3 bg-white transition-smooth d-flex flex-column justify-content-between"
      style={{
        border: "1px solid rgba(0, 0, 0, 0.1)",
        borderRadius: "12px",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.05)",
        height: "100%",
        minHeight: "104px",
      }}
    >
      <div className="d-flex justify-content-between align-items-start mb-2">
        <span
          className="font-inter fw-normal"
          style={{
            color: "#0f1901",
            fontSize: "16px",
            lineHeight: "20px",
          }}
        >
          {title}
        </span>
        
        {isUp && (
          <div style={{ color: "#0f1901", transform: "rotate(45deg)", fontSize: "16px", lineHeight: "1" }}>
            <i className="bi bi-arrow-up"></i>
          </div>
        )}
        {isDown && (
          <div style={{ color: "#0f1901", transform: "rotate(135deg)", fontSize: "16px", lineHeight: "1" }}>
            <i className="bi bi-arrow-up"></i>
          </div>
        )}
        {isUser && (
          <div style={{ color: "rgba(0, 0, 0, 0.6)", fontSize: "16px", lineHeight: "1" }}>
            <i className="bi bi-person"></i>
          </div>
        )}
      </div>

      <div className="d-flex flex-column gap-1">
        <h3
          className="font-inter fw-semibold mb-0"
          style={{
            color: "#0f1901",
            fontSize: "26px",
            lineHeight: "36px",
          }}
        >
          {value}
        </h3>

        <div className="text-end">
          <a
            href="#"
            onClick={onLinkClick}
            className="font-inter fw-semibold text-decoration-none hover-underline"
            style={{
              color: "rgba(0, 0, 0, 0.4)",
              fontSize: "12px",
              lineHeight: "1.2",
            }}
          >
            Ver detalles
          </a>
        </div>
      </div>
    </div>
  );
}
