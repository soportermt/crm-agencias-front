"use client";

import React, { useState } from "react";

export default function EmailPanel({
  contact,
  clientInfo,
  emails,
  loadingEmails,
  onComposeEmail,
  onClose,
  onSyncEmails,
  syncingEmails,
}) {
  const [expandedEmailId, setExpandedEmailId] = useState(null);

  if (!contact) {
    return (
      <div
        className="d-flex flex-column align-items-center justify-content-center h-100 bg-white"
        style={{ borderRadius: "12px" }}
      >
        <div
          className="rounded-circle d-flex align-items-center justify-content-center mb-3"
          style={{ width: "64px", height: "64px", backgroundColor: "#f1f5f9" }}
        >
          <i className="bi bi-envelope text-secondary" style={{ fontSize: "28px", color: "#94a3b8" }}></i>
        </div>
        <p className="fw-semibold mb-1" style={{ color: "#0f1901", fontSize: "15px" }}>
          Selecciona un contacto
        </p>
        <p className="small mb-0 text-secondary" style={{ color: "var(--grey-text)" }}>
          Elige un cliente para ver sus correos electrónicos
        </p>
      </div>
    );
  }

  const name = clientInfo?.nombreCompleto || clientInfo?.nombre || contact.name || "Cliente";
  const email = clientInfo?.correo || clientInfo?.email || contact.email || "";

  const toggleExpand = (id) => {
    setExpandedEmailId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="d-flex flex-column h-100 bg-white" style={{ borderRadius: "12px", overflow: "hidden" }}>
      {/* Header */}
      <div
        className="d-flex align-items-center gap-2 px-3 py-2 border-bottom"
        style={{ borderColor: "#f0f0f0", minHeight: "64px" }}
      >
        <div
          className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 fw-bold"
          style={{ width: "38px", height: "38px", backgroundColor: "#e7f1fe", color: "#0c5cc6", fontSize: "13px" }}
        >
          {name.substring(0, 2).toUpperCase()}
        </div>

        <div className="flex-grow-1 overflow-hidden">
          <span className="fw-semibold text-truncate d-block" style={{ color: "#0f1901", fontSize: "14px" }}>
            {name}
          </span>
          <span className="text-truncate d-block small" style={{ color: "var(--grey-text)", fontSize: "12px" }}>
            <i className="bi bi-envelope me-1" style={{ color: "#0c5cc6" }}></i>
            {email || "Sin correo"}
          </span>
        </div>

        {/* Botón Sincronizar Correos */}
        <button
          type="button"
          onClick={onSyncEmails}
          disabled={syncingEmails}
          className="btn btn-bg-style d-flex align-items-center gap-1 flex-shrink-0 fw-medium"
          style={{ fontSize: "12px", padding: "6px 12px", borderRadius: "8px" }}
          title="Forzar sincronización de correos con el servidor IMAP"
        >
          <i
            className={`bi bi-arrow-clockwise ${syncingEmails ? "spinner-border spinner-border-sm border-0" : ""}`}
            style={{ fontSize: "13px" }}
          ></i>
          <span>{syncingEmails ? "Sincronizando..." : "Sincronizar"}</span>
        </button>

        {/* Botón Redactar */}
        <button
          type="button"
          onClick={() => onComposeEmail()}
          className="btn btn-primary-custom d-flex align-items-center gap-1 flex-shrink-0 fw-medium"
          style={{ fontSize: "12px", padding: "6px 12px", borderRadius: "8px" }}
          disabled={!email}
          title="Redactar nuevo correo"
        >
          <i className="bi bi-envelope-plus" style={{ fontSize: "13px" }}></i>
          Redactar
        </button>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="btn btn-bg-style d-flex align-items-center justify-content-center flex-shrink-0"
            style={{ width: "32px", height: "32px", padding: 0, borderRadius: "8px", color: "var(--grey-text)" }}
            title="Cerrar panel de correos"
          >
            <i className="bi bi-x-lg" style={{ fontSize: "13px" }}></i>
          </button>
        )}
      </div>

      {/* Lista de correos */}
      <div className="flex-grow-1 overflow-y-auto p-3" style={{ backgroundColor: "#f8fafc" }}>
        {loadingEmails ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status" style={{ width: "24px", height: "24px" }}></div>
            <p className="small mt-2 text-muted">Cargando correos...</p>
          </div>
        ) : emails.length === 0 ? (
          <div className="text-center py-5">
            <div
              className="rounded-circle d-inline-flex align-items-center justify-content-center mb-2"
              style={{ width: "48px", height: "48px", backgroundColor: "#ffffff", border: "1px solid #e2e8f0" }}
            >
              <i className="bi bi-envelope-paper text-secondary" style={{ fontSize: "22px" }}></i>
            </div>
            <p className="small mt-2 mb-1 fw-medium" style={{ color: "#334155" }}>
              Sin correos registrados con este cliente
            </p>
            <p className="small text-muted mb-3" style={{ fontSize: "12px" }}>
              Puedes sincronizar para revisar mensajes nuevos o redactar uno ahora
            </p>
            <button
              type="button"
              onClick={() => onComposeEmail()}
              className="btn btn-sm btn-primary-custom"
              style={{ fontSize: "12px", padding: "6px 14px", borderRadius: "8px" }}
            >
              <i className="bi bi-send me-1"></i> Redactar primer correo
            </button>
          </div>
        ) : (
          <div className="d-flex flex-column gap-2">
            {emails.map((emailItem) => {
              const isOutbound = emailItem.sender === "Agente" || emailItem.direction === "outbound";
              const isExpanded = expandedEmailId === emailItem.id;
              const hasHtml = Boolean(emailItem.body && /<[a-z][\s\S]*>/i.test(emailItem.body));

              return (
                <div
                  key={emailItem.id}
                  className="rounded-3 shadow-sm transition-smooth"
                  style={{
                    backgroundColor: "#ffffff",
                    border: isExpanded ? "1px solid #93c5fd" : "1px solid #e2e8f0",
                    overflow: "hidden",
                  }}
                >
                  {/* Fila cabecera clickeable */}
                  <div
                    className="p-3 d-flex align-items-start gap-2 cursor-pointer"
                    style={{ cursor: "pointer" }}
                    onClick={() => toggleExpand(emailItem.id)}
                  >
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center text-white flex-shrink-0 fw-bold"
                      style={{
                        width: "32px",
                        height: "32px",
                        backgroundColor: emailItem.avatarBg || (isOutbound ? "#0c5cc6" : "#059669"),
                        fontSize: "11px",
                      }}
                    >
                      {emailItem.initials || (isOutbound ? "AG" : "CL")}
                    </div>

                    <div className="flex-grow-1 overflow-hidden">
                      <div className="d-flex align-items-center justify-content-between gap-2">
                        <div className="d-flex align-items-center gap-2 overflow-hidden">
                          <span
                            className={`text-truncate ${emailItem.unread ? "fw-bold text-primary" : "fw-semibold"}`}
                            style={{ fontSize: "13.5px", color: "#0f172a" }}
                          >
                            {emailItem.subject || "Sin asunto"}
                          </span>
                          <span
                            className="badge rounded-pill fw-medium"
                            style={{
                              fontSize: "10px",
                              backgroundColor: isOutbound ? "#eff6ff" : "#ecfdf5",
                              color: isOutbound ? "#1d4ed8" : "#047857",
                              border: `1px solid ${isOutbound ? "#bfdbfe" : "#a7f3d0"}`,
                            }}
                          >
                            <i className={`bi ${isOutbound ? "bi-arrow-up-right" : "bi-arrow-down-left"} me-1`}></i>
                            {isOutbound ? "Enviado" : "Recibido"}
                          </span>
                        </div>

                        <span className="flex-shrink-0 text-muted small" style={{ fontSize: "11px" }}>
                          {emailItem.date || emailItem.created_at}
                        </span>
                      </div>

                      <div className="d-flex align-items-center justify-content-between gap-2 mt-1">
                        <span className="text-truncate text-muted small" style={{ fontSize: "12px", maxWidth: "90%" }}>
                          {emailItem.preview || (emailItem.body || "").replace(/<[^>]*>/g, "").substring(0, 110)}
                        </span>
                        <i
                          className={`bi bi-chevron-${isExpanded ? "up" : "down"} text-muted`}
                          style={{ fontSize: "12px" }}
                        ></i>
                      </div>
                    </div>
                  </div>

                  {/* Cuerpo expandido */}
                  {isExpanded && (
                    <div className="border-top px-3 py-3" style={{ borderColor: "#f1f5f9", backgroundColor: "#ffffff" }}>
                      <div className="d-flex flex-column gap-1 mb-3 pb-2 border-bottom text-muted small" style={{ fontSize: "12px" }}>
                        <div>
                          <strong className="text-secondary">De:</strong> {emailItem.from || (isOutbound ? "Nosotros" : email)}
                        </div>
                        <div>
                          <strong className="text-secondary">Para:</strong> {emailItem.to || (isOutbound ? email : "Nosotros")}
                        </div>
                        <div>
                          <strong className="text-secondary">Fecha:</strong> {emailItem.date || emailItem.created_at}
                        </div>
                      </div>

                      {/* Contenido del correo */}
                      <div
                        className="email-body-content py-2 px-1"
                        style={{
                          fontSize: "13.5px",
                          lineHeight: "1.6",
                          color: "#1e293b",
                          maxHeight: "500px",
                          overflowY: "auto",
                        }}
                      >
                        {hasHtml ? (
                          <div
                            dangerouslySetInnerHTML={{ __html: emailItem.body }}
                            style={{ wordBreak: "break-word" }}
                          />
                        ) : (
                          <div style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                            {emailItem.body || emailItem.preview || "Sin contenido"}
                          </div>
                        )}
                      </div>

                      {/* Botón Responder */}
                      <div className="d-flex justify-content-end pt-3 mt-2 border-top" style={{ borderColor: "#f1f5f9" }}>
                        <button
                          type="button"
                          onClick={() => onComposeEmail(emailItem.subject ? `Re: ${emailItem.subject.replace(/^Re:\s*/i, "")}` : "")}
                          className="btn btn-sm btn-light border d-flex align-items-center gap-1"
                          style={{ fontSize: "12px", borderRadius: "8px", padding: "6px 14px" }}
                        >
                          <i className="bi bi-reply-fill" style={{ fontSize: "14px", color: "#0c5cc6" }}></i>
                          <span>Responder</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
