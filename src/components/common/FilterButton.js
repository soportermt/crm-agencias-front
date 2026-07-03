import React from "react";

export default function FilterButton({ children, onClick, active, className = "", style = {} }) {
  return (
    <button
      onClick={onClick}
      className={`btn d-flex align-items-center justify-content-center gap-2 border transition-smooth px-3 ${className}`}
      style={{
        height: "38px",
        borderRadius: "8px",
        borderColor: "#d0d5dd",
        backgroundColor: "#fff",
        fontSize: "13px",
        color: "#0f1901",
        fontWeight: active ? 500 : 400,
        ...style
      }}
    >
      {children}
    </button>
  );
}
