"use client";

import React from "react";

export default function ConfiguracionHeader({ activeTab }) {
  const titles = {
    general: "General",
    usuarios: "Usuarios",
    bancos: "Cuentas de banco",
    terminos: "Términos y condiciones",
    conectividad: "Conectividad",
  };
  const section = titles[activeTab] || "General";

  return (
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-2">
      <div>
        <div className="d-flex align-items-center gap-2">
          <h2 className="mb-0 font-inter d-flex align-items-center gap-2">
            <span style={{ 
              color: "#1E293B", 
              fontSize: "24px", 
              fontWeight: 600, 
              lineHeight: "22px", 
              letterSpacing: "-0.168px" 
            }}>
              Configuración
            </span>
            <span style={{ 
              color: "rgba(0, 0, 0, 0.40)", 
              fontSize: "18px", 
              fontWeight: 500, 
              lineHeight: "22px", 
              letterSpacing: "-0.126px" 
            }}>
              &gt; {section}
            </span>
          </h2>
        </div>
      </div>
    </div>
  );
}
