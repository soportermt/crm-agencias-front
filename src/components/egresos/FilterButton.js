import React from "react";

export default function FilterButton({ children, onClick, active, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`btn d-flex align-items-center gap-2 border bg-white rounded-3 px-3 ${className}`}
      style={{
        height: "38px",
        borderColor: "#d0d5dd",
        fontSize: "13px",
        color: "#0f1901",
        fontWeight: active ? 500 : 400,
      }}
    >
      {children}
    </button>
  );
}
