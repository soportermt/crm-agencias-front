"use client";

import React from "react";

export default function TerminosTab() {
  return (
    <div className="d-flex flex-column h-100 font-inter w-100">
      <div className="mb-4 d-flex align-items-center justify-content-between">
        <h5 className="mb-0 fw-medium text-dark" style={{ fontSize: "18px", letterSpacing: "-0.126px" }}>
          Términos y Condiciones
        </h5>
      </div>
      
      <div className="d-flex flex-column gap-3 w-100" style={{ maxWidth: "100%" }}>
        <div className="d-flex flex-column gap-2">
          <label className="font-poppins" style={{ fontSize: "14px", color: "rgba(64, 64, 64, 0.8)" }}>
            General
          </label>
          <div 
            className="border rounded-3 w-100 d-flex flex-column overflow-hidden" 
            style={{ borderColor: "#e1e1e1", minHeight: "222px", borderRadius: "12px" }}
          >
            {/* Mockup Toolbar */}
            <div className="d-flex align-items-center gap-3 px-3 py-2 border-bottom" style={{ backgroundColor: "#fafafa", borderColor: "rgba(161, 161, 170, 0.35) !important" }}>
              <div className="d-flex gap-2 text-secondary">
                <i className="bi bi-type-bold cursor-pointer"></i>
                <i className="bi bi-type-italic cursor-pointer"></i>
                <i className="bi bi-type-underline cursor-pointer"></i>
                <i className="bi bi-type-strikethrough cursor-pointer"></i>
                <div className="border-start mx-1 h-100" style={{ borderColor: "rgba(161, 161, 170, 0.35)" }}></div>
                <i className="bi bi-list-ul cursor-pointer"></i>
                <i className="bi bi-list-ol cursor-pointer"></i>
                <div className="border-start mx-1 h-100" style={{ borderColor: "rgba(161, 161, 170, 0.35)" }}></div>
                <i className="bi bi-link-45deg cursor-pointer"></i>
                <i className="bi bi-image cursor-pointer"></i>
              </div>
            </div>
            {/* Text Area */}
            <textarea 
              className="form-control border-0 shadow-none flex-grow-1 p-3 font-poppins" 
              style={{ resize: "none", fontSize: "14px", color: "rgba(64, 64, 64, 0.8)", backgroundColor: "transparent", minHeight: "180px" }}
              defaultValue=""
            />
          </div>
        </div>

        <div className="d-flex justify-content-end mt-2">
          <button
            className="btn btn-primary-custom d-flex align-items-center justify-content-center shadow-premium"
            style={{ padding: "10px 24px", fontSize: "14px", borderRadius: "8px", width: "200px" }}
            onClick={() => console.log("Guardar Términos")}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
