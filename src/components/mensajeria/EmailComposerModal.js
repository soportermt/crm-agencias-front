"use client";

import React, { useState, useEffect } from "react";
import RichTextEditor from "./RichTextEditor";

export default function EmailComposerModal({
  show,
  onClose,
  clientInfo,
  onSend,
  sending,
  initialSubject = "",
}) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    if (show) {
      setSubject(initialSubject || "");
      setBody("");
    }
  }, [show, initialSubject]);

  if (!show) return null;

  // Verificar si hay contenido (texto sin etiquetas vacías)
  const hasBodyContent = () => {
    if (!body) return false;
    const stripped = body.replace(/<[^>]*>/g, "").trim();
    return stripped.length > 0;
  };

  const canSend = subject.trim().length > 0 && hasBodyContent() && !sending;

  const handleSend = () => {
    if (!canSend) return;
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = body;
    const plainText = tempDiv.textContent || tempDiv.innerText || "";

    onSend({
      subject: subject.trim(),
      body: plainText.trim() || body.trim(),
      html: body.trim(),
    });
  };

  return (
    <>
      <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true" style={{ zIndex: 1050 }}>
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div
            className="modal-content shadow-lg"
            style={{ borderRadius: "14px", border: "none" }}
          >
            <div className="modal-header border-bottom px-4 py-3" style={{ borderColor: "#f1f5f9" }}>
              <div className="d-flex align-items-center gap-2">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: "32px", height: "32px", backgroundColor: "#e7f1fe", color: "#0c5cc6" }}
                >
                  <i className="bi bi-envelope" style={{ fontSize: "15px" }}></i>
                </div>
                <h5 className="modal-title font-poppins fw-semibold m-0" style={{ color: "#0f1901", fontSize: "16px" }}>
                  Redactar correo
                </h5>
              </div>
              <button type="button" className="btn-close" onClick={onClose} aria-label="Cerrar"></button>
            </div>

            <div className="modal-body px-4 py-3">
              <div className="mb-3">
                <label className="form-label text-secondary small font-poppins mb-1" htmlFor="email-to">
                  Para
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 text-muted" style={{ borderRadius: "10px 0 0 10px" }}>
                    <i className="bi bi-person" style={{ fontSize: "14px" }}></i>
                  </span>
                  <input
                    id="email-to"
                    type="text"
                    className="form-control input-custom border-start-0"
                    style={{ borderRadius: "0 10px 10px 0" }}
                    value={clientInfo?.correo || clientInfo?.email || ""}
                    readOnly
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label text-secondary small font-poppins mb-1" htmlFor="email-subject">
                  Asunto
                </label>
                <input
                  id="email-subject"
                  type="text"
                  className="form-control input-custom"
                  style={{ borderRadius: "10px" }}
                  placeholder="Asunto del correo..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div className="mb-2">
                <label className="form-label text-secondary small font-poppins mb-1">
                  Mensaje
                </label>
                <RichTextEditor
                  value={body}
                  onChange={setBody}
                  placeholder="Escribe el contenido del correo con formato enriquecido..."
                />
              </div>
            </div>

            <div className="modal-footer border-top px-4 py-3 justify-content-end gap-2" style={{ borderColor: "#f1f5f9" }}>
              <button
                type="button"
                className="btn btn-light"
                style={{ borderRadius: "10px", fontSize: "13px", padding: "8px 18px" }}
                onClick={onClose}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-primary-custom d-flex align-items-center gap-2"
                style={{ fontSize: "13px", padding: "8px 18px", borderRadius: "10px" }}
                onClick={handleSend}
                disabled={!canSend}
              >
                {sending ? (
                  <span className="spinner-border spinner-border-sm" role="status"></span>
                ) : (
                  <i className="bi bi-send" style={{ fontSize: "13px" }}></i>
                )}
                Enviar correo
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" style={{ zIndex: 1040 }}></div>
    </>
  );
}
