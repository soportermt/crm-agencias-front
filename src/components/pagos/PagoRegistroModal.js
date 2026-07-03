"use client";

import React, { useState } from "react";

export default function PagoRegistroModal({ show, onClose, servicios }) {
  const [formData, setFormData] = useState({
    fechaPago: "28/05/2026",
    formaPago: "TRANSFERENCIA",
    cuentaPago: "",
    observaciones: "",
    quienRecibe: "José Martínez Quintero",
    quienPaga: "",
    saldarTodos: "no",
    montos: {},
  });

  if (!show) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleMontoChange = (index, value) => {
    setFormData((prev) => ({
      ...prev,
      montos: { ...prev.montos, [index]: value },
    }));
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 1050,
        display: "flex",
        justifyContent: "flex-end",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white h-100 overflow-auto"
        style={{
          width: "740px",
          maxWidth: "100%",
          boxShadow: "-4px 0 24px rgba(0,0,0,0.15)",
        }}
      >
        <div className="p-4 d-flex flex-column gap-4">
          <div className="d-flex justify-content-between align-items-center">
            <h2
              className="font-inter fw-medium mb-0"
              style={{ fontSize: "22px", color: "#0f1901" }}
            >
              Registro de pago
            </h2>
            <button
              onClick={onClose}
              className="btn-close"
              style={{ fontSize: "12px" }}
              aria-label="Cerrar"
            ></button>
          </div>

          <div className="row g-3">
            <div className="col-4">
              <label className="form-label font-poppins" style={{ fontSize: "14px" }}>
                Fecha de pago *
              </label>
              <input
                type="text"
                className="form-control"
                value={formData.fechaPago}
                onChange={(e) => handleChange("fechaPago", e.target.value)}
                style={{ borderRadius: "12px", borderColor: "#e1e1e1", fontSize: "14px" }}
              />
            </div>
            <div className="col-4">
              <label className="form-label font-poppins" style={{ fontSize: "14px" }}>
                Forma de pago *
              </label>
              <select
                className="form-select"
                value={formData.formaPago}
                onChange={(e) => handleChange("formaPago", e.target.value)}
                style={{ borderRadius: "12px", borderColor: "#e1e1e1", fontSize: "14px" }}
              >
                <option value="TRANSFERENCIA">TRANSFERENCIA</option>
                <option value="EFECTIVO">EFECTIVO</option>
                <option value="TARJETA">TARJETA</option>
                <option value="RETIRO">RETIRO</option>
              </select>
            </div>
            <div className="col-4">
              <label className="form-label font-poppins" style={{ fontSize: "14px" }}>
                Cuenta pago *
              </label>
              <select
                className="form-select"
                value={formData.cuentaPago}
                onChange={(e) => handleChange("cuentaPago", e.target.value)}
                style={{ borderRadius: "12px", borderColor: "#e1e1e1", fontSize: "14px" }}
              >
                <option value="">Selecciona</option>
                <option value="cuenta1">BBVA - ****1234</option>
                <option value="cuenta2">Banorte - ****5678</option>
              </select>
            </div>
          </div>

          <div>
            <label className="form-label font-poppins" style={{ fontSize: "14px" }}>
              Observaciones
            </label>
            <textarea
              className="form-control"
              rows={3}
              value={formData.observaciones}
              onChange={(e) => handleChange("observaciones", e.target.value)}
              style={{ borderRadius: "12px", borderColor: "#e1e1e1", fontSize: "14px" }}
            />
          </div>

          <div className="row g-3">
            <div className="col-6">
              <label className="form-label font-poppins" style={{ fontSize: "14px" }}>
                ¿Quién recibe? *
              </label>
              <input
                type="text"
                className="form-control"
                value={formData.quienRecibe}
                readOnly
                style={{
                  borderRadius: "12px",
                  borderColor: "#e1e1e1",
                  fontSize: "14px",
                  backgroundColor: "rgba(161,161,170,0.35)",
                  color: "#999",
                }}
              />
            </div>
            <div className="col-6">
              <label className="form-label font-poppins" style={{ fontSize: "14px" }}>
                ¿Quién paga/abona? *
              </label>
              <input
                type="text"
                className="form-control"
                value={formData.quienPaga}
                onChange={(e) => handleChange("quienPaga", e.target.value)}
                style={{ borderRadius: "12px", borderColor: "#e1e1e1", fontSize: "14px" }}
              />
            </div>
          </div>

          <div>
            <h3
              className="font-inter fw-medium mb-2"
              style={{ fontSize: "18px", color: "#1e293b" }}
            >
              Servicio(s)
            </h3>

            <div className="mb-3">
              <p className="font-poppins mb-2" style={{ fontSize: "14px" }}>
                ¿Quieres saldar todos los servicios?
              </p>
              <div className="d-flex gap-3">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="saldarTodos"
                    id="saldarNo"
                    value="no"
                    checked={formData.saldarTodos === "no"}
                    onChange={(e) => handleChange("saldarTodos", e.target.value)}
                  />
                  <label className="form-check-label font-inter" htmlFor="saldarNo" style={{ fontSize: "12px" }}>
                    No
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="saldarTodos"
                    id="saldarSi"
                    value="si"
                    checked={formData.saldarTodos === "si"}
                    onChange={(e) => handleChange("saldarTodos", e.target.value)}
                  />
                  <label className="form-check-label font-inter" htmlFor="saldarSi" style={{ fontSize: "12px" }}>
                    Si
                  </label>
                </div>
              </div>
            </div>

            {servicios.map((serv, index) => (
              <div
                key={index}
                className="border p-3 mb-2"
                style={{ borderRadius: "12px", borderColor: "rgba(161,161,170,0.35)" }}
              >
                <div className="row g-3 mb-2">
                  <div className="col-4">
                    <span className="font-poppins fw-medium" style={{ fontSize: "14px" }}>Servicio</span>
                    <p className="font-inter mb-0" style={{ fontSize: "14px", color: "#272727" }}>{serv.servicio}</p>
                  </div>
                  <div className="col-4">
                    <span className="font-poppins fw-medium" style={{ fontSize: "14px" }}>Proveedor</span>
                    <p className="font-inter mb-0" style={{ fontSize: "14px", color: "#272727" }}>{serv.proveedor}</p>
                  </div>
                  <div className="col-4">
                    <span className="font-poppins fw-medium" style={{ fontSize: "14px" }}>Descripción</span>
                    <p className="font-inter mb-0" style={{ fontSize: "14px", color: "#272727" }}>{serv.descripcion}</p>
                  </div>
                </div>
                <div className="row g-3 align-items-end">
                  <div className="col-8">
                    <label className="form-label font-poppins" style={{ fontSize: "14px" }}>Monto</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.montos[index] || ""}
                      onChange={(e) => handleMontoChange(index, e.target.value)}
                      style={{ borderRadius: "12px", borderColor: "#e1e1e1", fontSize: "14px" }}
                    />
                  </div>
                  <div className="col-4">
                    <span className="font-poppins fw-medium" style={{ fontSize: "14px" }}>Saldo</span>
                    <p
                      className="font-inter fw-semibold mb-0"
                      style={{ fontSize: "18px", color: "#0c5cc6" }}
                    >
                      {serv.saldo}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div>
            <h3
              className="font-inter fw-medium mb-2"
              style={{ fontSize: "16px", color: "#0f1901" }}
            >
              Comprobante de pago
            </h3>
            <div
              className="d-flex flex-column align-items-center justify-content-center py-5"
              style={{
                border: "1px solid #0c5cc6",
                borderRadius: "12px",
                backgroundColor: "#e7f1fe",
                cursor: "pointer",
              }}
            >
              <i className="bi bi-plus-lg mb-2" style={{ fontSize: "20px", color: "#0c5cc6" }}></i>
              <span
                className="font-inter fw-medium"
                style={{ fontSize: "16px", color: "#0c5cc6" }}
              >
                Agregar documentos
              </span>
            </div>
          </div>

          <button
            className="btn btn-primary d-flex align-items-center justify-content-center border-0"
            style={{
              backgroundColor: "#227cf2",
              borderRadius: "8px",
              padding: "10px 16px",
              fontSize: "14px",
              fontWeight: 500,
              width: "227px",
            }}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
