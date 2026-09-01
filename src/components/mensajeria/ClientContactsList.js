"use client";

import React from "react";
import { getInitials, formatTime } from "./utils";

export default function ClientContactsList({
  contacts,
  selectedClientId,
  onSelect,
  searchQuery,
  onSearchChange,
  loading,
}) {
  return (
    <div className="d-flex flex-column h-100 bg-white" style={{ borderRadius: "12px", overflow: "hidden" }}>
      {/* Buscador */}
      <div className="p-3 border-bottom" style={{ borderColor: "#f0f0f0" }}>
        <div className="position-relative">
          <i
            className="bi bi-search position-absolute text-secondary"
            style={{ left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "13px" }}
          ></i>
          <input
            type="text"
            className="form-control input-custom ps-5"
            placeholder="Buscar contacto..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{ height: "40px", fontSize: "13px" }}
          />
        </div>
      </div>

      {/* Lista de contactos */}
      <div className="flex-grow-1 overflow-y-auto">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status" style={{ width: "22px", height: "22px" }}></div>
          </div>
        ) : contacts.length === 0 ? (
          <div className="text-center py-5 px-3">
            <i className="bi bi-person-lines-fill text-secondary" style={{ fontSize: "28px", color: "#cbd5e1" }}></i>
            <p className="small text-secondary mt-2 mb-0" style={{ color: "var(--grey-text)" }}>
              No hay contactos con correos registrados
            </p>
          </div>
        ) : (
          contacts.map((contact) => {
            const isSelected = selectedClientId === contact.clientId;
            const lastEmail = contact.emails?.[0];
            return (
              <button
                key={contact.clientId}
                onClick={() => onSelect(contact)}
                className={`w-100 text-start border-0 bg-transparent d-flex align-items-center gap-2 px-3 py-2 mensajeria-conversation-item ${isSelected ? "active" : ""}`}
                style={{ fontSize: "13px" }}
              >
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 fw-bold"
                  style={{
                    width: "40px",
                    height: "40px",
                    backgroundColor: isSelected ? "#dbeafe" : "#e7f1fe",
                    color: "#0c5cc6",
                    fontSize: "13px",
                  }}
                >
                  {getInitials(contact.name)}
                </div>

                <div className="flex-grow-1 overflow-hidden">
                  <div className="d-flex align-items-center justify-content-between gap-2">
                    <span className="fw-semibold text-truncate" style={{ color: "#0f1901" }}>
                      {contact.name}
                    </span>
                    {lastEmail && (
                      <span className="flex-shrink-0 small" style={{ color: "#9ca3af", fontSize: "11px" }}>
                        {formatTime(lastEmail.date || lastEmail.created_at)}
                      </span>
                    )}
                  </div>
                  <div className="d-flex align-items-center justify-content-between gap-2">
                    <span className="text-truncate text-secondary" style={{ color: "var(--grey-text)", fontSize: "12px" }}>
                      {lastEmail ? lastEmail.subject || "Sin asunto" : contact.email || "Sin correos"}
                    </span>
                    <i className="bi bi-envelope flex-shrink-0" style={{ color: "#0c5cc6", fontSize: "13px" }}></i>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
