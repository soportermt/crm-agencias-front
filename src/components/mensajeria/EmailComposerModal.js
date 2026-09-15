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
  defaultIsQuote = false,
}) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [isQuote, setIsQuote] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [fechaInicial, setFechaInicial] = useState("");
  const [fechaFinal, setFechaFinal] = useState("");
  const [cargoServicios, setCargoServicios] = useState("");

  useEffect(() => {
    if (show) {
      setSubject(initialSubject || "");
      setBody("");
      setIsQuote(defaultIsQuote);
      setPdfFile(null);
      const today = new Date().toISOString().slice(0, 10);
      setFechaInicial(today);
      setFechaFinal(today);
      setCargoServicios("");
    }
  }, [show, initialSubject]);

  if (!show) return null;

  const hasBodyContent = () => {
    if (!body) return false;
    const stripped = body.replace(/<[^>]*>/g, "").trim();
    return stripped.length > 0;
  };

  const canSend =
    subject.trim().length > 0 &&
    !sending &&
    (isQuote ? pdfFile !== null : hasBodyContent());

  const handleSend = () => {
    if (!canSend) return;
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = body;
    const plainText = tempDiv.textContent || tempDiv.innerText || "";

    onSend({
      subject: subject.trim(),
      body: plainText.trim() || body.trim() || (isQuote ? "Adjuntamos la cotización solicitada." : ""),
      html: body.trim() || (isQuote ? "<p>Adjuntamos la cotización solicitada.</p>" : ""),
      isQuote,
      pdfFile,
      fechaInicial,
      fechaFinal,
      cargoServicios,
    });
  };

  return (
    <>
      <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true" style={{ zIndex: 1050 }}>
        <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "1300px", width: "75%" }}>
          <div
            className="modal-content shadow-lg"
            style={{ borderRadius: "16px", border: "none", maxHeight: "92vh", display: "flex", flexDirection: "column", maxWidth: "100%" }}
          >
            <div className="modal-header border-bottom px-4 py-3" style={{ borderColor: "#f1f5f9" }}>
              <div className="d-flex align-items-center gap-2">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: "36px", height: "36px", backgroundColor: isQuote ? "#fee2e2" : "#e7f1fe", color: isQuote ? "#dc2626" : "#0c5cc6" }}
                >
                  <i className={isQuote ? "bi bi-file-earmark-pdf" : "bi bi-envelope"} style={{ fontSize: "17px" }}></i>
                </div>
                <div>
                  <h5 className="modal-title font-poppins fw-semibold m-0" style={{ color: "#0f1901", fontSize: "16px" }}>
                    {isQuote ? "Redactar y enviar cotización" : "Redactar correo"}
                  </h5>
                  <p className="text-secondary mb-0" style={{ fontSize: "12px" }}>
                    {isQuote ? "Envía la cotización por correo electrónico con registro automático en el perfil del cliente" : "Envía un mensaje por correo al cliente"}
                  </p>
                </div>
              </div>
              <button type="button" className="btn-close" onClick={onClose} aria-label="Cerrar"></button>
            </div>

            <div className="modal-body px-4 py-3" style={{ overflowY: "auto", maxHeight: "calc(92vh - 140px)" }}>
              <div className="row g-3 mb-3">
                <div className="col-12 col-md-5">
                  <label className="form-label text-secondary small font-poppins mb-1" htmlFor="email-to">
                    Destinatario
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

                <div className="col-12 col-md-7">
                  <label className="form-label text-secondary small font-poppins mb-1" htmlFor="email-subject">
                    Asunto <span className="text-danger">*</span>
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
              </div>

              <div className="mb-3 p-3 rounded-3" style={{ backgroundColor: isQuote ? "#f0f7ff" : "#f8fafc", border: isQuote ? "1px solid #93c5fd" : "1px solid #e2e8f0" }}>
                <div className="form-check form-switch d-flex align-items-center gap-2 m-0">
                  <input
                    className="form-check-input ms-0"
                    type="checkbox"
                    role="switch"
                    id="quote-mode-switch"
                    checked={isQuote}
                    onChange={(e) => setIsQuote(e.target.checked)}
                    style={{ cursor: "pointer", width: "40px", height: "22px" }}
                  />
                  <label className="form-check-label font-poppins fw-semibold text-dark small m-0" htmlFor="quote-mode-switch" style={{ cursor: "pointer" }}>
                    <i className="bi bi-file-earmark-pdf text-danger me-1"></i>
                    Registrar y enviar como Cotización (Adjuntar PDF)
                  </label>
                </div>

                {isQuote && (
                  <div className="mt-3 pt-3 border-top" style={{ borderColor: "#bfdbfe" }}>
                    <div className="row g-3 align-items-center">
                      <div className="col-12 col-lg-5">
                        <label className="form-label text-secondary small font-poppins mb-1">
                          Archivo PDF de la cotización <span className="text-danger">*</span>
                        </label>
                        <div className="input-group" style={{ height: "43px" }}>
                          <span className="input-group-text bg-white border-end-0 text-danger d-flex align-items-center" style={{ borderRadius: "10px 0 0 10px", height: "43px" }}>
                            <i className="bi bi-file-earmark-pdf-fill" style={{ fontSize: "16px" }}></i>
                          </span>
                          <input
                            type="file"
                            className="form-control input-custom border-start-0"
                            accept="application/pdf,.pdf"
                            onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                            style={{ borderRadius: "0 10px 10px 0", height: "43px", padding: "8px 16px", lineHeight: "1.5" }}
                          />
                        </div>
                        {pdfFile && (
                          <div className="small text-success mt-1 d-flex align-items-center gap-1 font-poppins">
                            <i className="bi bi-check-circle-fill"></i>
                            <span>{pdfFile.name} ({(pdfFile.size / 1024).toFixed(1)} KB)</span>
                          </div>
                        )}
                      </div>

                      <div className="col-12 col-lg-7">
                        <div className="row g-2">
                          <div className="col-4">
                            <label className="form-label text-secondary small font-poppins mb-1">
                              Fecha inicio
                            </label>
                            <input
                              type="date"
                              className="form-control input-custom"
                              value={fechaInicial}
                              onChange={(e) => setFechaInicial(e.target.value)}
                              style={{ borderRadius: "10px" }}
                            />
                          </div>
                          <div className="col-4">
                            <label className="form-label text-secondary small font-poppins mb-1">
                              Fecha fin
                            </label>
                            <input
                              type="date"
                              className="form-control input-custom"
                              value={fechaFinal}
                              onChange={(e) => setFechaFinal(e.target.value)}
                              style={{ borderRadius: "10px" }}
                            />
                          </div>
                          <div className="col-4">
                            <label className="form-label text-secondary small font-poppins mb-1">
                              Monto ($)
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              className="form-control input-custom"
                              value={cargoServicios}
                              onChange={(e) => setCargoServicios(e.target.value)}
                              style={{ borderRadius: "10px" }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-2">
                <label className="form-label text-secondary small font-poppins mb-1">
                  Mensaje / Contenido del correo
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
                style={{ fontSize: "13px", padding: "8px 20px", borderRadius: "10px" }}
                onClick={handleSend}
                disabled={!canSend}
              >
                {sending ? (
                  <span className="spinner-border spinner-border-sm" role="status"></span>
                ) : (
                  <i className={isQuote ? "bi bi-file-earmark-check" : "bi bi-send"} style={{ fontSize: "13px" }}></i>
                )}
                {isQuote ? "Enviar cotización" : "Enviar correo"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" style={{ zIndex: 1040 }}></div>
    </>
  );
}
