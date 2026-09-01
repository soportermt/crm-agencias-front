"use client";

import React, { useState, useEffect } from "react";

export default function EmailComposerModal({ show, onClose, clientInfo, onSend, sending }) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    if (show) {
      setSubject("");
      setBody("");
    }
  }, [show]);

  if (!show) return null;

  const canSend = subject.trim() && body.trim() && !sending;

  const handleSend = () => {
    if (!canSend) return;
    onSend({ subject: subject.trim(), body: body.trim() });
  };

  return (
    <>
      <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true" style={{ zIndex: 1050 }}>
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content" style={{ borderRadius: "12px", border: "none", boxShadow: "0 8px 16px 0 rgba(12,12,13,0.1)" }}>
            <div className="modal-header border-0 pb-0">
              <h5 className="modal-title font-poppins fw-semibold" style={{ color: "#0f1901", fontSize: "16px" }}>
                Redactar correo
              </h5>
              <button type="button" className="btn-close" onClick={onClose} aria-label="Cerrar"></button>
            </div>
            <div className="modal-body pt-3">
              <div className="mb-3">
                <label className="form-label text-secondary small font-poppins mb-1" htmlFor="email-to">Para</label>
                <input
                  id="email-to"
                  type="text"
                  className="form-control input-custom"
                  value={clientInfo?.correo || ""}
                  readOnly
                />
              </div>
              <div className="mb-3">
                <label className="form-label text-secondary small font-poppins mb-1" htmlFor="email-subject">Asunto</label>
                <input
                  id="email-subject"
                  type="text"
                  className="form-control input-custom"
                  placeholder="Asunto del correo"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              <div className="mb-1">
                <label className="form-label text-secondary small font-poppins mb-1" htmlFor="email-body">Mensaje</label>
                <textarea
                  id="email-body"
                  className="form-control"
                  placeholder="Escribe el contenido del correo..."
                  rows={8}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  style={{ border: "1px solid var(--border-color)", borderRadius: "12px", padding: "12px 16px", fontSize: "14px", resize: "none" }}
                ></textarea>
              </div>
            </div>
            <div className="modal-footer border-0 justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-light"
                style={{ borderRadius: "12px", fontSize: "13px", padding: "10px 20px" }}
                onClick={onClose}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-primary-custom d-flex align-items-center gap-2"
                style={{ fontSize: "13px", padding: "10px 20px" }}
                onClick={handleSend}
                disabled={!canSend}
              >
                {sending ? (
                  <span className="spinner-border spinner-border-sm" role="status"></span>
                ) : (
                  <i className="bi bi-send" style={{ fontSize: "14px" }}></i>
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
