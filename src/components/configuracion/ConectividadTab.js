"use client";

import React, { useState, useEffect } from "react";
import { conectividadService } from "../../services/conectividad.service";

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
    } catch (error) {
      console.error("Error saving WhatsApp settings", error);
      setMessage({ type: "danger", text: "Error al guardar la configuración de WhatsApp." });
    } finally {
      setSavingWhatsapp(false);
      setTimeout(() => setMessage(null), 3000);
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
    </div>
  );
}
