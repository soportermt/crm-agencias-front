"use client";

import React from "react";

const tabs = [
  { id: "general", label: "General" },
  { id: "usuarios", label: "Usuarios" },
  { id: "bancos", label: "Cuentas de banco" },
  { id: "terminos", label: "Términos y condiciones" },
  { id: "conectividad", label: "Conectividad" },
];

export default function ConfigSidebar({ activeTab, setActiveTab }) {
  return (
    <div 
      className="d-flex flex-row flex-md-column flex-wrap justify-content-between flex-shrink-0 pe-md-3 mb-3 mb-md-0" 
      style={{ width: "100%", maxWidth: "100%" }}
    >
      <style jsx>{`
        @media (min-width: 768px) {
          div { width: 240px !important; min-width: 240px !important; max-width: 240px !important; }
        }
        @media (max-width: 767px) {
          div { padding-bottom: 16px; gap: 10px; }
        }
      `}</style>
      <div className="d-flex flex-row flex-md-column flex-wrap gap-2 w-100">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="btn text-start border-0 w-100 p-2 font-inter"
              style={{
                borderRadius: "6px",
                backgroundColor: isActive ? "#e7f1fe" : "transparent",
                color: isActive ? "#09489a" : "#6e6d7a",
                fontWeight: isActive ? "500" : "400",
                fontSize: "14px",
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <div>
        <button
          className="btn text-start border-0 w-100 p-2 font-inter"
          style={{
            color: "#f55",
            fontSize: "15px",
            fontWeight: "400",
          }}
          onClick={() => console.log("Eliminar cuenta")}
        >
          Eliminar cuenta
        </button>
      </div>
    </div>
  );
}
