"use client";

import React, { useState } from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export default function AlertBanner({ message, description, variant = "warning", dismissible = true }) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const variants = {
    warning: { backgroundColor: "#fbf0da", color: "#73510d" },
    error: { backgroundColor: "#fde8e8", color: "#9b1c1c" },
    info: { backgroundColor: "#e7f1fe", color: "#0c5cc6" },
  };

  const style = variants[variant] || variants.warning;

  const formatDescription = (desc) => {
    if (typeof desc !== "string") return desc;
    const parts = desc.split(".");
    return parts.map((part, index) => {
      if (index === parts.length - 1) return part;
      return (
        <React.Fragment key={index}>
          {part}.
          <br />
        </React.Fragment>
      );
    });
  };

  return (
    <div
      className="d-flex align-items-center position-relative"
      style={{
        backgroundColor: style.backgroundColor,
        color: style.color,
        borderRadius: "8px",
        padding: "8px 16px",
        gap: "12px",
      }}
    >
      <ExclamationTriangleIcon
        className="flex-shrink-0"
        style={{ width: "16px", height: "16px" }}
      />
      <div
        className="flex-grow-1 font-inter"
        style={{
          fontSize: "13px",
          lineHeight: "1.4",
        }}
      >
        {message && <span className="fw-semibold">{message}</span>}
        {description && <span>{formatDescription(description)}</span>}
      </div>
      {dismissible && (
        <button
          onClick={() => setVisible(false)}
          className="btn-close flex-shrink-0"
          style={{
            fontSize: "10px",
            opacity: 0.6,
            filter: "none",
            padding: "4px",
          }}
          aria-label="Cerrar"
        ></button>
      )}
    </div>
  );
}
