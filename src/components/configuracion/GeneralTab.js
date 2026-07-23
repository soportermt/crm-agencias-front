"use client";

import React from "react";

export default function GeneralTab() {
  return (
    <div className="d-flex flex-column h-100 font-inter">
      <div className="mb-4">
        <h5 className="mb-0 fw-medium text-dark" style={{ fontSize: "18px", letterSpacing: "-0.126px" }}>
          Actualiza los datos de la agencia
        </h5>
      </div>
      
      <div className="d-flex flex-column gap-4 w-100">
        <div className="row g-4">
          <div className="col-12 col-md-6">
            <label className="form-label text-dark font-poppins" style={{ fontSize: "14px" }}>Nombre</label>
            <input type="text" className="form-control font-poppins" style={{ borderRadius: "12px", padding: "11px 14px", color: "#404040", fontSize: "14px", borderColor: "#e1e1e1" }} defaultValue="Demo Travel" />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label text-dark font-poppins" style={{ fontSize: "14px" }}>Correo electrónico</label>
            <input type="email" className="form-control font-poppins" style={{ borderRadius: "12px", padding: "11px 14px", color: "#404040", fontSize: "14px", borderColor: "#e1e1e1" }} defaultValue="soporte@2businesstravel.com" />
          </div>
        </div>

        <div className="row g-4">
          <div className="col-12 col-md-6">
            <label className="form-label text-dark font-poppins" style={{ fontSize: "14px" }}>Teléfono</label>
            <input type="text" className="form-control font-poppins" style={{ borderRadius: "12px", padding: "11px 14px", color: "#404040", fontSize: "14px", borderColor: "#e1e1e1" }} defaultValue="(999)636-87-20" />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label text-dark font-poppins" style={{ fontSize: "14px" }}>Dirección</label>
            <input type="text" className="form-control font-poppins" style={{ borderRadius: "12px", padding: "11px 14px", color: "#404040", fontSize: "14px", borderColor: "#e1e1e1" }} defaultValue="Calle 3 # 236 depto. 1 entre 20 y 22 Col. García Ginerés." />
          </div>
        </div>

        <div className="row g-4">
          <div className="col-12 col-md-6">
            <label className="form-label text-dark font-poppins" style={{ fontSize: "14px" }}>Código postal</label>
            <input type="text" className="form-control font-poppins" style={{ borderRadius: "12px", padding: "11px 14px", color: "#404040", fontSize: "14px", borderColor: "#e1e1e1" }} defaultValue="97079" />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label text-dark font-poppins" style={{ fontSize: "14px" }}>Ciudad</label>
            <input type="text" className="form-control font-poppins" style={{ borderRadius: "12px", padding: "11px 14px", color: "#404040", fontSize: "14px", borderColor: "#e1e1e1" }} defaultValue="Mérida" />
          </div>
        </div>

        <div className="row g-4">
          <div className="col-12 col-md-6">
            <label className="form-label text-dark font-poppins" style={{ fontSize: "14px" }}>Estado</label>
            <input type="text" className="form-control font-poppins" style={{ borderRadius: "12px", padding: "11px 14px", color: "#404040", fontSize: "14px", borderColor: "#e1e1e1" }} defaultValue="Yucatán" />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label text-dark font-poppins" style={{ fontSize: "14px" }}>Sitio web</label>
            <input type="text" className="form-control font-poppins" style={{ borderRadius: "12px", padding: "11px 14px", color: "#404040", fontSize: "14px", borderColor: "#e1e1e1" }} defaultValue="2businesstravel.com" />
          </div>
        </div>
        
        <div className="mt-2 text-end">
          <button className="btn btn-primary-custom shadow-premium px-4" style={{ borderRadius: "8px", fontSize: "14px", fontWeight: "500", padding: "10px 16px" }}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
