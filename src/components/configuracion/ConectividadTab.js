"use client";

import React, { useState, useEffect } from "react";
import { conectividadService } from "../../services/conectividad.service";
import { templatesService } from "../../services/templates.service";

export default function ConectividadTab() {
  const [whatsappSettings, setWhatsappSettings] = useState({
    wabaId: "",
    token: "",
    phoneNumberId: ""
  });

  const [emailSettings, setEmailSettings] = useState({
    imapServer: "",
    imapPort: "",
    smtpServer: "",
    smtpPort: "",
    emailAddress: "",
    emailPassword: ""
  });

  const [loading, setLoading] = useState(true);
  const [savingWhatsapp, setSavingWhatsapp] = useState(false);
  const [savingEmail, setSavingEmail] = useState(false);
  const [message, setMessage] = useState(null);

  // Template Modal State
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [creatingTemplates, setCreatingTemplates] = useState(false);
  const [templateStatus, setTemplateStatus] = useState(null);
  const [aperturaBody, setAperturaBody] = useState("Hola {{1}}, tenemos información para ti, ¿quieres saber más?");
  const [btn1Text, setBtn1Text] = useState("Sí, me interesa");
  const [btn2Text, setBtn2Text] = useState("No, gracias");
  const [reservaBody, setReservaBody] = useState("Hola {{1}}, adjunto encontrarás los detalles de tu reservación.");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const [whatsapp, email] = await Promise.all([
        conectividadService.getWhatsappSettings(),
        conectividadService.getEmailSettings()
      ]);

      if (whatsapp) {
        setWhatsappSettings({
          wabaId: whatsapp.waba_id || "",
          token: whatsapp.token || "",
          phoneNumberId: whatsapp.phone_number_id || ""
        });
      }

      if (email) {
        setEmailSettings({
          imapServer: email.imap_server || "",
          imapPort: email.imap_port || "",
          smtpServer: email.smtp_server || "",
          smtpPort: email.smtp_port || "",
          emailAddress: email.email_address || "",
          emailPassword: email.email_password || ""
        });
      }
    } catch (error) {
      console.error("Error fetching settings", error);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsappChange = (e) => {
    const { name, value } = e.target;
    setWhatsappSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleEmailChange = (e) => {
    const { name, value } = e.target;
    setEmailSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveWhatsapp = async () => {
    try {
      setSavingWhatsapp(true);
      setMessage(null);
      await conectividadService.saveWhatsappSettings(whatsappSettings);
      setMessage({ type: "success", text: "Configuración de WhatsApp guardada correctamente." });

      // Sincronizar plantillas con Meta (limpia BD y trae las de la nueva cuenta)
      try {
        await templatesService.syncMeta();
      } catch (syncErr) {
        console.warn("No se pudo sincronizar automáticamente con Meta tras guardar credenciales:", syncErr);
      }

      // Verificar plantillas
      try {
        const templates = await templatesService.getTemplates();
        const templatesList = templates.data || templates; // depending on interceptor
        const hasApertura = Array.isArray(templatesList) && templatesList.some(t => t.name === 'crm_apertura_default');
        const hasReserva = Array.isArray(templatesList) && templatesList.some(t => t.name === 'crm_reserva_default');
        
        if (!hasApertura || !hasReserva) {
          setShowTemplateModal(true);
        }
      } catch (e) {
        console.error("Error validando plantillas:", e);
      }
    } catch (error) {
      console.error("Error saving WhatsApp settings", error);
      setMessage({ type: "danger", text: "Error al guardar la configuración de WhatsApp." });
    } finally {
      setSavingWhatsapp(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleCreateDefaults = async () => {
    try {
      setCreatingTemplates(true);
      setTemplateStatus("Enviando plantillas a Meta y procesando documento...");
      await templatesService.createDefaultsInMeta({
        aperturaBody,
        aperturaButtons: [
          { type: "QUICK_REPLY", text: btn1Text || "Sí, me interesa" },
          { type: "QUICK_REPLY", text: btn2Text || "No, gracias" }
        ],
        reservaBody,
      });
      setTemplateStatus("Plantillas base creadas y registradas exitosamente.");
      setTimeout(() => {
        setShowTemplateModal(false);
        setTemplateStatus(null);
      }, 2000);
    } catch (e) {
      console.error(e);
      setTemplateStatus("Error al crear plantillas. Verifica credenciales en Meta.");
    } finally {
      setCreatingTemplates(false);
    }
  };

  const handleSaveEmail = async () => {
    try {
      setSavingEmail(true);
      setMessage(null);
      await conectividadService.saveEmailSettings(emailSettings);
      setMessage({ type: "success", text: "Configuración de Correo guardada correctamente." });
    } catch (error) {
      console.error("Error saving email settings", error);
      setMessage({ type: "danger", text: "Error al guardar la configuración de Correo." });
    } finally {
      setSavingEmail(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Cargando configuraciones...</div>;
  }

  return (
    <div className="d-flex flex-column h-100 font-inter">
      <div className="mb-4">
        <h5 className="mb-0 fw-medium text-dark" style={{ fontSize: "18px", letterSpacing: "-0.126px" }}>
          Conectividad y APIs
        </h5>
      </div>
      
      {message && (
        <div className={`alert alert-${message.type} py-2 px-3`} style={{ borderRadius: "8px", fontSize: "14px" }}>
          {message.text}
        </div>
      )}

      <div className="d-flex flex-column gap-5 w-100">
        
        {/* WhatsApp API Section */}
        <div className="d-flex flex-column gap-3">
          <h6 className="fw-medium text-dark mb-2" style={{ fontSize: "16px" }}>Configuración de WhatsApp</h6>
          
          <div className="row g-4">
            <div className="col-12 col-md-6">
              <label className="form-label text-dark font-poppins" style={{ fontSize: "14px" }}>WABA ID</label>
              <input 
                type="text" 
                name="wabaId"
                value={whatsappSettings.wabaId}
                onChange={handleWhatsappChange}
                className="form-control font-poppins" 
                style={{ borderRadius: "12px", padding: "11px 14px", color: "#404040", fontSize: "14px", borderColor: "#e1e1e1" }} 
                placeholder="WhatsApp Business Account ID" 
              />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label text-dark font-poppins" style={{ fontSize: "14px" }}>Token</label>
              <input 
                type="password" 
                name="token"
                value={whatsappSettings.token}
                onChange={handleWhatsappChange}
                className="form-control font-poppins" 
                style={{ borderRadius: "12px", padding: "11px 14px", color: "#404040", fontSize: "14px", borderColor: "#e1e1e1" }} 
                placeholder="Permanent Access Token" 
              />
            </div>
          </div>
          
          <div className="row g-4">
            <div className="col-12 col-md-6">
              <label className="form-label text-dark font-poppins" style={{ fontSize: "14px" }}>Phone Number ID</label>
              <input 
                type="text" 
                name="phoneNumberId"
                value={whatsappSettings.phoneNumberId}
                onChange={handleWhatsappChange}
                className="form-control font-poppins" 
                style={{ borderRadius: "12px", padding: "11px 14px", color: "#404040", fontSize: "14px", borderColor: "#e1e1e1" }} 
                placeholder="ID del número de teléfono" 
              />
            </div>
          </div>
          
          <div className="mt-3 text-end">
            <button 
              className="btn btn-primary-custom shadow-premium px-4" 
              style={{ borderRadius: "8px", fontSize: "14px", fontWeight: "500", padding: "10px 16px" }}
              onClick={handleSaveWhatsapp}
              disabled={savingWhatsapp}
            >
              {savingWhatsapp ? 'Guardando...' : 'Guardar WhatsApp'}
            </button>
          </div>
        </div>

        <hr className="my-1 border-secondary opacity-25" />

        {/* Email Server Section */}
        <div className="d-flex flex-column gap-3">
          <h6 className="fw-medium text-dark mb-2" style={{ fontSize: "16px" }}>Servidor de Correo (IMAP / SMTP)</h6>
          
          <div className="row g-4">
            <div className="col-12 col-md-8">
              <label className="form-label text-dark font-poppins" style={{ fontSize: "14px" }}>Servidor IMAP</label>
              <input 
                type="text" 
                name="imapServer"
                value={emailSettings.imapServer}
                onChange={handleEmailChange}
                className="form-control font-poppins" 
                style={{ borderRadius: "12px", padding: "11px 14px", color: "#404040", fontSize: "14px", borderColor: "#e1e1e1" }} 
                placeholder="Ej: imap.midominio.com" 
              />
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label text-dark font-poppins" style={{ fontSize: "14px" }}>Puerto IMAP</label>
              <input 
                type="text" 
                name="imapPort"
                value={emailSettings.imapPort}
                onChange={handleEmailChange}
                className="form-control font-poppins" 
                style={{ borderRadius: "12px", padding: "11px 14px", color: "#404040", fontSize: "14px", borderColor: "#e1e1e1" }} 
                placeholder="Ej: 993" 
              />
            </div>
          </div>

          <div className="row g-4">
            <div className="col-12 col-md-8">
              <label className="form-label text-dark font-poppins" style={{ fontSize: "14px" }}>Servidor SMTP</label>
              <input 
                type="text" 
                name="smtpServer"
                value={emailSettings.smtpServer}
                onChange={handleEmailChange}
                className="form-control font-poppins" 
                style={{ borderRadius: "12px", padding: "11px 14px", color: "#404040", fontSize: "14px", borderColor: "#e1e1e1" }} 
                placeholder="Ej: smtp.midominio.com" 
              />
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label text-dark font-poppins" style={{ fontSize: "14px" }}>Puerto SMTP</label>
              <input 
                type="text" 
                name="smtpPort"
                value={emailSettings.smtpPort}
                onChange={handleEmailChange}
                className="form-control font-poppins" 
                style={{ borderRadius: "12px", padding: "11px 14px", color: "#404040", fontSize: "14px", borderColor: "#e1e1e1" }} 
                placeholder="Ej: 465" 
              />
            </div>
          </div>

          <div className="row g-4">
            <div className="col-12 col-md-6">
              <label className="form-label text-dark font-poppins" style={{ fontSize: "14px" }}>Correo electrónico</label>
              <input 
                type="email" 
                name="emailAddress"
                value={emailSettings.emailAddress}
                onChange={handleEmailChange}
                className="form-control font-poppins" 
                style={{ borderRadius: "12px", padding: "11px 14px", color: "#404040", fontSize: "14px", borderColor: "#e1e1e1" }} 
                placeholder="correo@midominio.com" 
              />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label text-dark font-poppins" style={{ fontSize: "14px" }}>Contraseña / App Password</label>
              <input 
                type="password" 
                name="emailPassword"
                value={emailSettings.emailPassword}
                onChange={handleEmailChange}
                className="form-control font-poppins" 
                style={{ borderRadius: "12px", padding: "11px 14px", color: "#404040", fontSize: "14px", borderColor: "#e1e1e1" }} 
                placeholder="•••••••••••••••" 
              />
            </div>
          </div>
          
          <div className="mt-3 text-end">
            <button 
              className="btn btn-primary-custom shadow-premium px-4" 
              style={{ borderRadius: "8px", fontSize: "14px", fontWeight: "500", padding: "10px 16px" }}
              onClick={handleSaveEmail}
              disabled={savingEmail}
            >
              {savingEmail ? 'Guardando...' : 'Guardar Correo'}
            </button>
          </div>
        </div>
      </div>

      {showTemplateModal && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" style={{ zIndex: 1050, backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered modal-xl" style={{ maxWidth: "1100px", width: "95%" }}>
              <div className="modal-content shadow-lg" style={{ borderRadius: "16px", border: "none", backgroundColor: "#ffffff" }}>
                <div className="modal-header border-0 pb-0 pt-4 px-4">
                  <div>
                    <h5 className="modal-title font-poppins fw-semibold" style={{ color: "#0f1901", fontSize: "18px" }}>
                      Creación Asistida de Plantillas de WhatsApp
                    </h5>
                    <p className="small text-muted mb-0 mt-1" style={{ fontSize: "13px" }}>
                      Tus credenciales se han guardado con éxito. Para operar con WhatsApp Business, la agencia requiere las 2 plantillas base. Puedes personalizar sus textos a continuación antes de enviarlas a Meta:
                    </p>
                  </div>
                  <button type="button" className="btn-close" onClick={() => setShowTemplateModal(false)} aria-label="Close"></button>
                </div>

                <div className="modal-body p-4 pt-3">
                  <div className="row g-4">
                    {/* Plantilla 1: Apertura */}
                    <div className="col-12 col-lg-6">
                      <div className="border rounded p-3 p-md-4 h-100 d-flex flex-column" style={{ backgroundColor: "#f8fafc", borderRadius: "12px", borderColor: "#e2e8f0" }}>
                        <div className="d-flex align-items-center justify-content-between mb-3">
                          <div className="d-flex align-items-center gap-2">
                            <span className="badge bg-primary text-white rounded-pill px-2 py-1" style={{ fontSize: "11px" }}>
                              1
                            </span>
                            <span className="fw-semibold text-dark font-poppins" style={{ fontSize: "15px" }}>
                              Apertura de Conversación
                            </span>
                          </div>
                          <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1" style={{ fontSize: "11px", fontWeight: "600" }}>
                            MARKETING
                          </span>
                        </div>

                        <p className="small text-muted mb-2" style={{ fontSize: "12px" }}>
                          Plantilla utilizada al abrir una nueva conversación con un cliente en la Bandeja.
                        </p>

                        <div className="mb-3">
                          <label className="form-label small fw-medium text-dark mb-1" style={{ fontSize: "12px" }}>
                            Texto del mensaje:
                          </label>
                          <textarea
                            rows="4"
                            className="form-control"
                            style={{ fontSize: "13px", borderRadius: "8px", borderColor: "#cbd5e1" }}
                            value={aperturaBody}
                            onChange={(e) => setAperturaBody(e.target.value)}
                            placeholder="Texto de apertura..."
                          />
                          <span className="text-muted" style={{ fontSize: "11px" }}>
                            La variable <code>{'{{1}}'}</code> se sustituirá por el nombre del cliente.
                          </span>
                        </div>

                        <div className="mt-auto">
                          <label className="form-label small fw-medium text-dark mb-1" style={{ fontSize: "12px" }}>
                            Botones de Respuesta Rápida (Quick Reply):
                          </label>
                          <div className="row g-2">
                            <div className="col-6">
                              <div className="input-group input-group-sm">
                                <span className="input-group-text bg-light text-muted" style={{ fontSize: "11px" }}>1</span>
                                <input
                                  type="text"
                                  className="form-control"
                                  style={{ fontSize: "12px" }}
                                  value={btn1Text}
                                  onChange={(e) => setBtn1Text(e.target.value)}
                                  placeholder="Botón Sí"
                                />
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="input-group input-group-sm">
                                <span className="input-group-text bg-light text-muted" style={{ fontSize: "11px" }}>2</span>
                                <input
                                  type="text"
                                  className="form-control"
                                  style={{ fontSize: "12px" }}
                                  value={btn2Text}
                                  onChange={(e) => setBtn2Text(e.target.value)}
                                  placeholder="Botón No"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Plantilla 2: Reserva */}
                    <div className="col-12 col-lg-6">
                      <div className="border rounded p-3 p-md-4 h-100 d-flex flex-column" style={{ backgroundColor: "#f8fafc", borderRadius: "12px", borderColor: "#e2e8f0" }}>
                        <div className="d-flex align-items-center justify-content-between mb-3">
                          <div className="d-flex align-items-center gap-2">
                            <span className="badge bg-success text-white rounded-pill px-2 py-1" style={{ fontSize: "11px" }}>
                              2
                            </span>
                            <span className="fw-semibold text-dark font-poppins" style={{ fontSize: "15px" }}>
                              Envío de Reservación (PDF)
                            </span>
                          </div>
                          <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1" style={{ fontSize: "11px", fontWeight: "600" }}>
                            UTILITY
                          </span>
                        </div>

                        <div className="p-2 mb-3 border rounded bg-white d-flex align-items-center gap-2" style={{ fontSize: "12px", borderRadius: "8px" }}>
                          <i className="bi bi-file-earmark-pdf-fill text-danger" style={{ fontSize: "20px" }}></i>
                          <div>
                            <strong className="d-block text-dark" style={{ fontSize: "12px" }}>Encabezado: Documento PDF</strong>
                            <span className="text-muted" style={{ fontSize: "11px" }}>Validado automáticamente en Meta mediante Resumable Upload (demo-reserva.pdf)</span>
                          </div>
                        </div>

                        <div className="mb-3">
                          <label className="form-label small fw-medium text-dark mb-1" style={{ fontSize: "12px" }}>
                            Texto del mensaje:
                          </label>
                          <textarea
                            rows="4"
                            className="form-control"
                            style={{ fontSize: "13px", borderRadius: "8px", borderColor: "#cbd5e1" }}
                            value={reservaBody}
                            onChange={(e) => setReservaBody(e.target.value)}
                            placeholder="Texto de reserva..."
                          />
                          <span className="text-muted" style={{ fontSize: "11px" }}>
                            La variable <code>{'{{1}}'}</code> se sustituirá por el nombre del cliente y el PDF irá adjunto en el encabezado.
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {templateStatus && (
                    <div className="alert alert-info py-2 mt-3 mb-0 d-flex align-items-center gap-2" style={{ fontSize: "13px", borderRadius: "8px" }}>
                      <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                      <span>{templateStatus}</span>
                    </div>
                  )}
                </div>

                <div className="modal-footer border-0 pb-4 px-4 pt-0 gap-2">
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => setShowTemplateModal(false)}
                    disabled={creatingTemplates}
                    style={{ fontSize: "13px", borderRadius: "8px", padding: "10px 20px" }}
                  >
                    Omitir por ahora
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary-custom d-flex align-items-center gap-2"
                    onClick={handleCreateDefaults}
                    disabled={creatingTemplates}
                    style={{ fontSize: "13px", borderRadius: "8px", padding: "10px 24px" }}
                  >
                    <i className="bi bi-check2-circle"></i>
                    {creatingTemplates ? "Procesando en Meta..." : "Crear Plantillas en WhatsApp"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
