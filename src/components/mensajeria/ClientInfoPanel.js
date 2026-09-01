"use client";

import React from "react";
import Link from "next/link";
import { formatPhone } from "./utils";

export default function ClientInfoPanel({ clientInfo, emails, emailsLoading, onRefreshEmails, showEmails = true }) {
  if (!clientInfo) {
    return (
      <div className="bg-white p-3" style={{ borderRadius: "12px" }}>
        <p className="small text-center mb-0 py-4" style={{ color: "var(--grey-text)" }}>
          Selecciona una conversación para ver los datos del cliente
        </p>
      </div>
    );
  }

  const name = clientInfo.nombreCompleto || clientInfo.name || "Cliente";

  return (
    <div className="d-flex flex-column gap-3">
      {/* Datos del cliente */}
      <div className="bg-white p-3" style={{ borderRadius: "12px" }}>
        <div className="d-flex align-items-center gap-2 mb-3">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 fw-bold"
            style={{ width: "40px", height: "40px", backgroundColor: "#e7f1fe", color: "#0c5cc6", fontSize: "14px" }}
          >
            {(name || "CL").substring(0, 2).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="fw-semibold text-truncate mb-0" style={{ color: "#0f1901", fontSize: "14px" }}>
              {name}
            </p>
            <p className="small text-truncate mb-0" style={{ color: "var(--grey-text)", fontSize: "12px" }}>
              Cliente
            </p>
          </div>
        </div>

        <div className="d-flex flex-column gap-2 font-inter" style={{ fontSize: "12px" }}>
          {clientInfo.correo && (
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-envelope flex-shrink-0" style={{ color: "#0c5cc6" }}></i>
              <span className="text-truncate" style={{ color: "#404040" }}>{clientInfo.correo}</span>
            </div>
          )}
          {clientInfo.celular && (
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-telephone flex-shrink-0" style={{ color: "#0c5cc6" }}></i>
              <span style={{ color: "#404040" }}>{formatPhone(clientInfo.celular)}</span>
            </div>
          )}
          {clientInfo.ciudad && (
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-geo-alt flex-shrink-0" style={{ color: "#0c5cc6" }}></i>
              <span className="text-truncate" style={{ color: "#404040" }}>{clientInfo.ciudad}</span>
            </div>
          )}
        </div>

        {clientInfo.id && (
          <Link
            href={`/clientes/${clientInfo.id}`}
            className="btn btn-bg-style w-100 d-flex align-items-center justify-content-center gap-1 mt-3 fw-medium"
            style={{ fontSize: "12px", padding: "8px 12px", borderRadius: "8px" }}
          >
            <i className="bi bi-person-lines-fill" style={{ fontSize: "12px" }}></i>
            Ver perfil
          </Link>
        )}
      </div>

      {/* Correos recientes */}
      {showEmails && (
        <div className="bg-white p-3" style={{ borderRadius: "12px" }}>
          <div className="d-flex align-items-center justify-content-between mb-2">
            <p className="fw-semibold mb-0 font-poppins" style={{ color: "#0f1901", fontSize: "13px" }}>
              Correos recientes
            </p>
            <button
              onClick={onRefreshEmails}
              className="btn btn-link p-0 border-0 text-decoration-none"
              style={{ color: "#0c5cc6", fontSize: "12px" }}
              title="Actualizar correos"
            >
              <i className="bi bi-arrow-clockwise"></i>
            </button>
          </div>

          {emailsLoading ? (
            <div className="text-center py-3">
              <div className="spinner-border text-primary" role="status" style={{ width: "16px", height: "16px" }}></div>
            </div>
          ) : emails.length === 0 ? (
            <p className="small text-center mb-0 py-3" style={{ color: "var(--grey-text)" }}>
              Sin correos registrados
            </p>
          ) : (
            <div className="d-flex flex-column">
              {emails.slice(0, 5).map((email) => (
                <div
                  key={email.id}
                  className="py-2 border-bottom"
                  style={{ borderColor: "#f0f0f0", fontSize: "12px" }}
                >
                  <p className="fw-medium text-truncate mb-0" style={{ color: "#0f1901" }}>
                    {email.subject || "Sin asunto"}
                  </p>
                  <span className="small text-truncate d-block" style={{ color: "var(--grey-text)" }}>
                    {email.date || email.created_at}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
