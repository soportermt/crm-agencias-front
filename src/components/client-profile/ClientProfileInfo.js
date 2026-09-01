"use client";

import React from "react";
import { parsePhoneNumberFromString } from 'libphonenumber-js';

export default function ClientProfileInfo({ client }) {
  const formatPhone = (phone) => {
    if (!phone) return "-";
    const phoneNumber = parsePhoneNumberFromString(phone.startsWith('+') ? phone : `+${phone}`);
    return phoneNumber ? phoneNumber.formatInternational() : phone;
  };

  if (!client) return null;

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
              {client.correo || "-"}
            </div>
          </div>
          <div className="row g-0">
            <div className="col-5" style={{ color: "var(--grey-text)", fontSize: "13px" }}>
              Fecha de nacimiento
            </div>
            <div className="col-7" style={{ color: "var(--dark-green)", fontWeight: 500, fontSize: "13px" }}>
              {client.fechaNacimiento || "-"}
            </div>
          </div>
          <div className="row g-0">
            <div className="col-5" style={{ color: "var(--grey-text)", fontSize: "13px" }}>
              Teléfono
            </div>
            <div className="col-7" style={{ color: "var(--dark-green)", fontWeight: 500, fontSize: "13px" }}>
              {formatPhone(client.celular || client.telefono)}
            </div>
          </div>
          <div className="row g-0">
            <div className="col-5" style={{ color: "var(--grey-text)", fontSize: "13px" }}>
              RFC
            </div>
            <div className="col-7" style={{ color: "var(--dark-green)", fontWeight: 500, fontSize: "13px" }}>
              -
            </div>
          </div>
          <div className="row g-0">
            <div className="col-5" style={{ color: "var(--grey-text)", fontSize: "13px" }}>
              Sexo
            </div>
            <div className="col-7" style={{ color: "var(--dark-green)", fontWeight: 500, fontSize: "13px" }}>
              {client.sexo || "-"}
            </div>
          </div>
          <div className="row g-0">
            <div className="col-5" style={{ color: "var(--grey-text)", fontSize: "13px" }}>
              Estado civil
            </div>
            <div className="col-7" style={{ color: "var(--dark-green)", fontWeight: 500, fontSize: "13px" }}>
              {client.estadoCivil || "-"}
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
              {[client.ciudad || client.city, client.estado || client.state].filter(Boolean).join(", ") || "-"}<br />
              {client.codigoPostal && <span>{client.codigoPostal} <br/></span>}
              {client.pais || "-"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

