"use client";

import React from "react";

export default function ConectividadTab() {
  return (
    <div className="d-flex flex-column h-100 font-inter">
      <div className="mb-4">
        <h5 className="mb-0 fw-medium text-dark" style={{ fontSize: "18px", letterSpacing: "-0.126px" }}>
          Conectividad y APIs
        </h5>
      </div>
      
      <div className="d-flex flex-column gap-5 w-100">
        
        {/* WhatsApp API Section */}
        <div className="d-flex flex-column gap-3">
          <h6 className="fw-medium text-dark mb-2" style={{ fontSize: "16px" }}>Configuración de WhatsApp</h6>
          
          <div className="row g-4">
            <div className="col-12 col-md-6">
              <label className="form-label text-dark font-poppins" style={{ fontSize: "14px" }}>WABA ID</label>
              <input type="text" className="form-control font-poppins" style={{ borderRadius: "12px", padding: "11px 14px", color: "#404040", fontSize: "14px", borderColor: "#e1e1e1" }} placeholder="WhatsApp Business Account ID" />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label text-dark font-poppins" style={{ fontSize: "14px" }}>Token</label>
              <input type="password" className="form-control font-poppins" style={{ borderRadius: "12px", padding: "11px 14px", color: "#404040", fontSize: "14px", borderColor: "#e1e1e1" }} placeholder="Permanent Access Token" />
            </div>
          </div>
          
          <div className="row g-4">
            <div className="col-12 col-md-6">
              <label className="form-label text-dark font-poppins" style={{ fontSize: "14px" }}>Phone Number ID</label>
              <input type="text" className="form-control font-poppins" style={{ borderRadius: "12px", padding: "11px 14px", color: "#404040", fontSize: "14px", borderColor: "#e1e1e1" }} placeholder="ID del número de teléfono" />
            </div>
          </div>
        </div>

        <hr className="my-1 border-secondary opacity-25" />

        {/* Email Server Section */}
        <div className="d-flex flex-column gap-3">
          <h6 className="fw-medium text-dark mb-2" style={{ fontSize: "16px" }}>Servidor de Correo (IMAP / SMTP)</h6>
          
          <div className="row g-4">
            <div className="col-12 col-md-8">
              <label className="form-label text-dark font-poppins" style={{ fontSize: "14px" }}>Servidor IMAP</label>
              <input type="text" className="form-control font-poppins" style={{ borderRadius: "12px", padding: "11px 14px", color: "#404040", fontSize: "14px", borderColor: "#e1e1e1" }} placeholder="Ej: imap.midominio.com" />
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label text-dark font-poppins" style={{ fontSize: "14px" }}>Puerto IMAP</label>
              <input type="text" className="form-control font-poppins" style={{ borderRadius: "12px", padding: "11px 14px", color: "#404040", fontSize: "14px", borderColor: "#e1e1e1" }} placeholder="Ej: 993" />
            </div>
          </div>

          <div className="row g-4">
            <div className="col-12 col-md-8">
              <label className="form-label text-dark font-poppins" style={{ fontSize: "14px" }}>Servidor SMTP</label>
              <input type="text" className="form-control font-poppins" style={{ borderRadius: "12px", padding: "11px 14px", color: "#404040", fontSize: "14px", borderColor: "#e1e1e1" }} placeholder="Ej: smtp.midominio.com" />
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label text-dark font-poppins" style={{ fontSize: "14px" }}>Puerto SMTP</label>
              <input type="text" className="form-control font-poppins" style={{ borderRadius: "12px", padding: "11px 14px", color: "#404040", fontSize: "14px", borderColor: "#e1e1e1" }} placeholder="Ej: 465" />
            </div>
          </div>

          <div className="row g-4">
            <div className="col-12 col-md-6">
              <label className="form-label text-dark font-poppins" style={{ fontSize: "14px" }}>Correo electrónico</label>
              <input type="email" className="form-control font-poppins" style={{ borderRadius: "12px", padding: "11px 14px", color: "#404040", fontSize: "14px", borderColor: "#e1e1e1" }} placeholder="correo@midominio.com" />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label text-dark font-poppins" style={{ fontSize: "14px" }}>Contraseña / App Password</label>
              <input type="password" className="form-control font-poppins" style={{ borderRadius: "12px", padding: "11px 14px", color: "#404040", fontSize: "14px", borderColor: "#e1e1e1" }} placeholder="•••••••••••••••" />
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-end">
          <button className="btn btn-primary-custom shadow-premium px-4" style={{ borderRadius: "8px", fontSize: "14px", fontWeight: "500", padding: "10px 16px" }}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
