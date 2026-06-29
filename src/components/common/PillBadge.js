"use client";

import React from "react";

export default function PillBadge({ label, backgroundColor, color }) {
  return (
    <span
      className="d-inline-flex align-items-center justify-content-center px-2 py-0 rounded-pill"
      style={{
        backgroundColor,
        color,
        fontSize: "12px",
        fontWeight: 500,
        lineHeight: "18px",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}
