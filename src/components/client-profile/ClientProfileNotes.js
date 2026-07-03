"use client";

import React from "react";

export default function ClientProfileNotes() {
  return (
    <div className="bg-white p-4 d-flex flex-column" style={{ borderRadius: "12px", boxShadow: "0 8px 16px 0 rgba(12, 12, 13, 0.1)" }}>
      <h3 className="font-poppins h6 fw-semibold mb-4" style={{ color: "var(--dark-green)" }}>
        Notas
      </h3>

      <div className="d-flex flex-column gap-4 flex-grow-1 font-inter" style={{ fontSize: "13px", color: "var(--grey-text)" }}>
        <p className="mb-0 lh-base">
          Confirmar con el operador receptivo en Europa el cambio de horario para el tour del grupo &quot;Bloqueo Mayo&quot;.
        </p>
        <p className="mb-0 lh-base">
          Enviar por correo los pases de abordar y confirmaciones de hotel...
        </p>
      </div>

      <button
        className="btn w-100 transition-smooth fw-medium mt-4"
        style={{
          backgroundColor: "#dbe8f9",
          color: "#ffffff",
          borderRadius: "8px",
          padding: "10px 16px",
          fontSize: "13px",
        }}
      >
        Confirmar cambios
      </button>
    </div>
  );
}
