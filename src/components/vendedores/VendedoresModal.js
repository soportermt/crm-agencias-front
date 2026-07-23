"use client";

import React, { useState } from "react";

export default function VendedoresModal({ show, onClose }) {
  const [submitting, setSubmitting] = useState(false);

  if (!show) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    // TODO: implement API call
    setTimeout(() => {
      setSubmitting(false);
      onClose();
    }, 1000);
  };

  return (
    <div
      className="modal-backdrop-custom d-flex align-items-stretch justify-content-end"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        zIndex: 1050,
      }}
      onClick={onClose}
    >
      <div
        className="bg-white shadow-premium font-inter w-100 transition-smooth"
        style={{
          maxWidth: "816px",
          height: "100vh",
          overflowY: "auto",
          borderRadius: "0",
          padding: "48px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h2
            className="font-inter h4 mb-0 fw-medium"
            style={{ color: "#0f1901" }}
          >
            Registro de nuevo empleado
          </h2>
          <button
            type="button"
            className="btn p-0 border-0 bg-transparent"
            onClick={onClose}
            aria-label="Cerrar"
            style={{ fontSize: "1.5rem", color: "#0f1901", lineHeight: 1 }}
          >
            <i className="bi bi-x"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* General */}
          <div className="mb-4">
            <h3 className="font-inter h6 fw-medium mb-3" style={{ color: "#0f1901" }}>
              General
            </h3>
            <div className="row">
              <div className="col-12 col-md-6 mb-3">
                <label className="form-label text-black small font-poppins mb-1">Usuario *</label>
                <input type="text" required className="form-control input-custom" />
              </div>
              <div className="col-12 col-md-6 mb-3">
                <label className="form-label text-black small font-poppins mb-1">Contraseña *</label>
                <input type="password" required className="form-control input-custom" />
              </div>
              <div className="col-12 col-md-6 mb-3">
                <label className="form-label text-black small font-poppins mb-1">Sucursal *</label>
                <select required className="form-select input-custom">
                  <option value="">Seleccionar</option>
                  <option value="1">Sucursal 1</option>
                </select>
              </div>
              <div className="col-12 col-md-6 mb-3">
                <label className="form-label text-black small font-poppins mb-1">Foto de perfil</label>
                <input type="file" className="form-control input-custom" />
              </div>
            </div>
          </div>

          {/* Datos personales */}
          <div className="mb-4">
            <h3 className="font-inter h6 fw-medium mb-3" style={{ color: "#0f1901" }}>
              Datos personales
            </h3>
            <div className="row">
              <div className="col-12 col-md-6 mb-3">
                <label className="form-label text-black small font-poppins mb-1">Nombre completo *</label>
                <input type="text" required placeholder="Elías Salazar" className="form-control input-custom" />
              </div>
              <div className="col-12 col-md-6 mb-3">
                <label className="form-label text-black small font-poppins mb-1">Correo electrónico</label>
                <input type="email" placeholder="@" className="form-control input-custom" />
              </div>
              <div className="col-12 col-md-6 mb-3">
                <label className="form-label text-black small font-poppins mb-1">Fecha de nacimiento *</label>
                <input type="text" required placeholder="dd/mm/aaaa" className="form-control input-custom" />
              </div>
              <div className="col-12 col-md-6 mb-3">
                <label className="form-label text-black small font-poppins mb-1">Celular *</label>
                <input type="tel" required placeholder="+52" className="form-control input-custom" />
              </div>
              <div className="col-12 col-md-6 mb-3">
                <label className="form-label text-black small font-poppins mb-1">RFC</label>
                <input type="text" className="form-control input-custom" />
              </div>
              <div className="col-12 col-md-6 mb-3">
                <label className="form-label text-black small font-poppins mb-1">Sexo</label>
                <select className="form-select input-custom">
                  <option value="">Seleccionar</option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                </select>
              </div>
              <div className="col-12 col-md-6 mb-3">
                <label className="form-label text-black small font-poppins mb-1">Estado civil</label>
                <select className="form-select input-custom">
                  <option value="">Seleccionar</option>
                  <option value="S">Soltero</option>
                  <option value="C">Casado</option>
                </select>
              </div>
            </div>
          </div>

          {/* Datos de domicilio */}
          <div className="mb-4">
            <h3 className="font-inter h6 fw-medium mb-3" style={{ color: "#0f1901" }}>
              Datos de domicilio
            </h3>
            <div className="row">
              <div className="col-12 col-md-6 mb-3">
                <label className="form-label text-black small font-poppins mb-1">Calle *</label>
                <input type="text" required className="form-control input-custom" />
              </div>
              <div className="col-12 col-md-6 mb-3">
                <label className="form-label text-black small font-poppins mb-1">Número Ext.</label>
                <input type="text" className="form-control input-custom" />
              </div>
              <div className="col-12 col-md-6 mb-3">
                <label className="form-label text-black small font-poppins mb-1">Número Int.</label>
                <input type="text" className="form-control input-custom" />
              </div>
              <div className="col-12 col-md-6 mb-3">
                <label className="form-label text-black small font-poppins mb-1">Colonia *</label>
                <input type="text" required className="form-control input-custom" />
              </div>
              <div className="col-12 col-md-6 mb-3">
                <label className="form-label text-black small font-poppins mb-1">Código postal</label>
                <input type="text" className="form-control input-custom" />
              </div>
              <div className="col-12 col-md-6 mb-3">
                <label className="form-label text-black small font-poppins mb-1">Ciudad *</label>
                <select required className="form-select input-custom">
                  <option value="">Seleccionar</option>
                </select>
              </div>
              <div className="col-12 col-md-6 mb-3">
                <label className="form-label text-black small font-poppins mb-1">Estado *</label>
                <select required className="form-select input-custom">
                  <option value="">Seleccionar</option>
                </select>
              </div>
              <div className="col-12 col-md-6 mb-3">
                <label className="form-label text-black small font-poppins mb-1">País *</label>
                <select required className="form-select input-custom">
                  <option value="">Seleccionar</option>
                </select>
              </div>
            </div>
          </div>

          {/* Datos laborales */}
          <div className="mb-4">
            <h3 className="font-inter h6 fw-medium mb-3" style={{ color: "#0f1901" }}>
              Datos laborales
            </h3>
            <div className="row">
              <div className="col-12 col-md-6 mb-3">
                <label className="form-label text-black small font-poppins mb-1">Fecha de Ingreso *</label>
                <input type="text" required placeholder="dd/mm/aaaa" className="form-control input-custom" />
              </div>
              <div className="col-12 col-md-6 mb-3">
                <label className="form-label text-black small font-poppins mb-1">Sueldo Base *</label>
                <input type="text" required className="form-control input-custom" />
              </div>
              <div className="col-12 col-md-6 mb-3">
                <label className="form-label text-black small font-poppins mb-1">Porcentaje de Comisión</label>
                <input type="text" className="form-control input-custom" />
              </div>
              <div className="col-12 col-md-6 mb-3">
                <label className="form-label text-black small font-poppins mb-1">CURP</label>
                <input type="text" className="form-control input-custom" />
              </div>
              <div className="col-12 col-md-6 mb-3">
                <label className="form-label text-black small font-poppins mb-1">NSS (Número de seguro social)</label>
                <input type="text" className="form-control input-custom" />
              </div>
              <div className="col-12 col-md-6 mb-3">
                <label className="form-label text-black small font-poppins mb-1">Rol de acceso *</label>
                <select required className="form-select input-custom">
                  <option value="">Seleccionar</option>
                </select>
              </div>
              <div className="col-12 col-md-6 mb-3">
                <label className="form-label text-black small font-poppins mb-1">Departamento *</label>
                <select required className="form-select input-custom">
                  <option value="">Seleccionar</option>
                </select>
              </div>
              <div className="col-12 col-md-6 mb-3">
                <label className="form-label text-black small font-poppins mb-1">Horario de entrada *</label>
                <input type="text" required placeholder="--:-- ----" className="form-control input-custom" />
              </div>
              <div className="col-12 col-md-6 mb-3">
                <label className="form-label text-black small font-poppins mb-1">Horario de salida *</label>
                <input type="text" required placeholder="--:-- ----" className="form-control input-custom" />
              </div>
            </div>
          </div>

          {/* Documentación */}
          <div className="mb-4">
            <h3 className="font-inter h6 fw-medium mb-3" style={{ color: "#0f1901" }}>
              Documentación
            </h3>
            <div className="row">
              <div className="col-12 mb-3">
                <label className="form-label text-black small font-poppins mb-1">Tipo de documento</label>
                <select className="form-select input-custom w-50">
                  <option value="">Seleccionar</option>
                  <option value="comprobante">Comprobante de Domicilio</option>
                  <option value="ine">Identificación Oficial</option>
                </select>
              </div>
              <div className="col-12 mb-3">
                <div 
                  className="d-flex align-items-center justify-content-center w-100" 
                  style={{ backgroundColor: "#e7f1fe", border: "1px solid #0c5cc6", borderRadius: "8px", height: "100px", cursor: "pointer" }}
                >
                  <div className="text-center" style={{ color: "#0c5cc6" }}>
                    <i className="bi bi-plus-lg me-2"></i>
                    <span className="font-inter fw-medium" style={{ fontSize: "13px" }}>Comprobante de Domicilio</span>
                  </div>
                </div>
              </div>
              
              <div className="col-12">
                {/* Mock Uploaded Files */}
                <div className="d-flex align-items-center justify-content-between p-3 mb-2 rounded" style={{ backgroundColor: "#f5f5f5" }}>
                  <div className="d-flex align-items-center gap-3">
                    <div className="bg-danger text-white rounded p-2 d-flex align-items-center justify-content-center" style={{ width: "32px", height: "32px" }}>
                      <span style={{ fontSize: "10px", fontWeight: "bold" }}>PDF</span>
                    </div>
                    <div>
                      <div className="font-inter fw-medium text-dark" style={{ fontSize: "12px" }}>Documento.pdf</div>
                      <div className="text-muted" style={{ fontSize: "11px" }}>290 kb</div>
                    </div>
                  </div>
                  <div className="font-inter text-dark" style={{ fontSize: "14px" }}>Comprobante de Domicilio</div>
                  <button type="button" className="btn btn-link text-decoration-none p-0" style={{ color: "#0c5cc6", fontSize: "14px", fontWeight: "600" }}>Eliminar</button>
                </div>

                <div className="d-flex align-items-center justify-content-between p-3 mb-2 rounded" style={{ backgroundColor: "#f5f5f5" }}>
                  <div className="d-flex align-items-center gap-3">
                    <div className="bg-danger text-white rounded p-2 d-flex align-items-center justify-content-center" style={{ width: "32px", height: "32px" }}>
                      <span style={{ fontSize: "10px", fontWeight: "bold" }}>PDF</span>
                    </div>
                    <div>
                      <div className="font-inter fw-medium text-dark" style={{ fontSize: "12px" }}>Documento02.pdf</div>
                      <div className="text-muted" style={{ fontSize: "11px" }}>290 kb</div>
                    </div>
                  </div>
                  <div className="font-inter text-dark" style={{ fontSize: "14px" }}>Identificación oficial</div>
                  <button type="button" className="btn btn-link text-decoration-none p-0" style={{ color: "#0c5cc6", fontSize: "14px", fontWeight: "600" }}>Eliminar</button>
                </div>

                <div className="d-flex align-items-center justify-content-between p-3 rounded" style={{ backgroundColor: "#f5f5f5" }}>
                  <div className="d-flex align-items-center gap-3">
                    <div className="bg-danger text-white rounded p-2 d-flex align-items-center justify-content-center" style={{ width: "32px", height: "32px" }}>
                      <span style={{ fontSize: "10px", fontWeight: "bold" }}>PDF</span>
                    </div>
                    <div>
                      <div className="font-inter fw-medium text-dark" style={{ fontSize: "12px" }}>Documento03.pdf</div>
                      <div className="text-muted" style={{ fontSize: "11px" }}>290 kb</div>
                    </div>
                  </div>
                  <div className="font-inter text-dark" style={{ fontSize: "14px" }}>Carta de recomendación</div>
                  <button type="button" className="btn btn-link text-decoration-none p-0" style={{ color: "#0c5cc6", fontSize: "14px", fontWeight: "600" }}>Eliminar</button>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-end mt-4">
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary-custom transition-smooth fw-medium d-flex align-items-center justify-content-center"
              style={{
                backgroundColor: "#227cf2",
                borderColor: "#227cf2",
                width: "359px",
                height: "43px",
                borderRadius: "12px",
              }}
            >
              {submitting ? "Guardando..." : "Confirmar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
