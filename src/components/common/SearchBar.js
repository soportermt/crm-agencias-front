"use client";

import React from "react";

export default function SearchBar({ value, onChange, placeholder = "Buscar", width = "300px" }) {
  return (
    <div className="position-relative" style={{ width }}>
      <i
        className="bi bi-search position-absolute text-muted"
        style={{ left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "14px" }}
      ></i>
      <input
        type="text"
        className="form-control font-inter"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{
          paddingLeft: "38px",
          borderColor: "#d0d5dd",
          borderRadius: "8px",
          fontSize: "13px",
          height: "38px",
          boxShadow: "0px 1px 1px rgba(16, 24, 40, 0.05)",
        }}
      />
    </div>
  );
}
