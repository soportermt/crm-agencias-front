"use client";

import React from "react";

export default function StatCard({
  title,
  value,
  trend = "none",
  subtext,
  linkText,
  onLinkClick = (e) => e.preventDefault(),
  valueColor,
  size = "md", // "sm" | "md"
  titleColor,
  titleFontFamily = "font-inter",
}) {
  const isUp = trend === "up";
  const isDown = trend === "down";
  const isUser = trend === "user";

  const finalLinkText = linkText || (size === "md" ? "Ver detalles" : null);
  const showFooter = !!subtext || !!finalLinkText;

  return (
    <div
      className="p-3 bg-white transition-smooth d-flex flex-column justify-content-center"
      style={{
        border: "1px solid rgba(0, 0, 0, 0.1)",
        borderRadius: "12px",
        boxShadow: size === "sm" ? "none" : "0px 4px 12px rgba(0, 0, 0, 0.05)",
        height: "100%",
        minHeight: size === "sm" ? "86px" : "104px",
        overflow: "hidden",
      }}
    >
      <div className="d-flex justify-content-between align-items-start mb-1">
        <span
          className={`${titleFontFamily} fw-normal`}
          style={{
            color: titleColor || "#0f1901",
            fontSize: size === "sm" ? "14px" : "16px",
            lineHeight: "20px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          title={title}
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
        <span
          className="font-inter fw-bold mb-0"
          style={{
            color: valueColor || "#0f1901",
            fontSize: size === "sm" ? "16px" : "26px",
            lineHeight: size === "sm" ? "24px" : "36px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          title={typeof value === "string" || typeof value === "number" ? String(value) : undefined}
        >
          {value}
        </span>

        {showFooter && (
          <div className="text-end">
            {subtext ? (
              <span
                className="font-inter fw-medium"
                style={{
                  color: "rgba(0, 0, 0, 0.4)",
                  fontSize: "12px",
                  lineHeight: "1.2",
                }}
              >
                {subtext}
              </span>
            ) : (
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
                {finalLinkText}
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
