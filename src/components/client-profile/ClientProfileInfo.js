"use client";

import React from "react";

export default function ClientProfileInfo() {
  return (
    <div className="d-flex flex-column flex-md-row gap-4 mb-4 mt-4">
      {/* Datos Personales */}
      <div className="flex-grow-1">
        <h4 className="font-poppins h6 fw-semibold mb-3" style={{ color: "var(--dark-green)" }}>
          Datos personales
        </h4>
        <div className="d-flex flex-column gap-2 font-inter small">
          <div className="row g-0">
            <div className="col-5" style={{ color: "var(--grey-text)", fontSize: "13px" }}>
              Correo electrónico
            </div>
            <div className="col-7" style={{ color: "var(--dark-green)", fontWeight: 500, fontSize: "13px" }}>
              m.garcia@email.com
            </div>
          </div>
          <div className="row g-0">
            <div className="col-5" style={{ color: "var(--grey-text)", fontSize: "13px" }}>
              Fecha de nacimiento
            </div>
            <div className="col-7" style={{ color: "var(--dark-green)", fontWeight: 500, fontSize: "13px" }}>
              21 de Marzo 1994
            </div>
          </div>
          <div className="row g-0">
            <div className="col-5" style={{ color: "var(--grey-text)", fontSize: "13px" }}>
              Teléfono
            </div>
            <div className="col-7" style={{ color: "var(--dark-green)", fontWeight: 500, fontSize: "13px" }}>
              +52 999 765 3452
            </div>
          </div>
          <div className="row g-0">
            <div className="col-5" style={{ color: "var(--grey-text)", fontSize: "13px" }}>
              RFC
            </div>
            <div className="col-7" style={{ color: "var(--dark-green)", fontWeight: 500, fontSize: "13px" }}>
              UEB284623N
            </div>
          </div>
          <div className="row g-0">
            <div className="col-5" style={{ color: "var(--grey-text)", fontSize: "13px" }}>
              Sexo
            </div>
            <div className="col-7" style={{ color: "var(--dark-green)", fontWeight: 500, fontSize: "13px" }}>
              Mujer
            </div>
          </div>
          <div className="row g-0">
            <div className="col-5" style={{ color: "var(--grey-text)", fontSize: "13px" }}>
              Estado civil
            </div>
            <div className="col-7" style={{ color: "var(--dark-green)", fontWeight: 500, fontSize: "13px" }}>
              Soltero
            </div>
          </div>
        </div>
      </div>

      {/* Dirección */}
      <div className="flex-grow-1">
        <h4 className="font-poppins h6 fw-semibold mb-3" style={{ color: "var(--dark-green)" }}>
          Dirección
        </h4>
        <div className="d-flex flex-column gap-2 font-inter small">
          <div className="row g-0">
            <div className="col-5 col-md-4" style={{ color: "var(--grey-text)", fontSize: "13px" }}>
              Ubicación
            </div>
            <div className="col-7 col-md-8" style={{ color: "var(--dark-green)", fontWeight: 500, fontSize: "13px", lineHeight: "1.4" }}>
              Calle 23 #89 × 142 y 9c,<br />
              Francisco de Montejo, Mérida, Yucatán<br />
              97300
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
