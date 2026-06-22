import React from "react";

export default function ClientProfileTabs({ activeTab, setActiveTab }) {
  const tabs = [
    "Conversaciones",
    "Historial de correos",
    "Cotizaciones",
    "Historial de compras",
    "Documentos",
  ];

  return (
    <div className="d-flex align-items-center gap-2 mb-4 overflow-auto pb-2" style={{ whiteSpace: "nowrap" }}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`btn border-0 fw-medium transition-smooth`}
            style={{
              padding: "8px 16px",
              borderRadius: "20px",
              fontSize: "13px",
              backgroundColor: isActive ? "#e7f1fe" : "transparent",
              color: isActive ? "#0c5cc6" : "var(--grey-text)",
            }}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}
