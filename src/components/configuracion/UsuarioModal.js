"use client";

import React, { useState, useEffect } from "react";

export default function UsuarioModal({ show, onClose, user }) {
  const [formData, setFormData] = useState({
    nombreCompleto: "",
    usuario: "",
    email: "",
    fechaNacimiento: "",
    contrasena: "",
    confirmarContrasena: "",
    rol: "Administrador",
    estado: "Activo",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        nombreCompleto: user.nombre || "",
        usuario: user.email ? `@${user.email.split('@')[0]}` : "",
        email: user.email || "",
        fechaNacimiento: "20/06/2001", // Mocked
        contrasena: "•••••••••••••••",
        confirmarContrasena: "•••••••••••••••",
        rol: user.rol || "Administrador",
        estado: user.estatus || "Activo",
      });
    } else {
      setFormData({
        nombreCompleto: "",
        usuario: "",
        email: "",
        fechaNacimiento: "",
        contrasena: "",
        confirmarContrasena: "",
        rol: "Administrador",
        estado: "Activo",
      });
    }
  }, [user]);

  if (!show) return null;

  return (
    <div
      className="modal-backdrop-custom d-flex align-items-center justify-content-center"
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
        className="bg-white shadow-premium font-inter transition-smooth d-flex flex-column"
        style={{
          width: "100%",
          maxWidth: "500px",
          maxHeight: "90vh",
          overflowY: "auto",
          borderRadius: "20px",
          padding: "32px 24px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h2 className="font-inter h4 mb-0 fw-medium" style={{ color: "#0f1901", fontSize: "22px", letterSpacing: "-0.2px" }}>
            Registro de usuarios
          </h2>
          <div className="d-flex gap-2 align-items-center">
            {user && (
              <button className="btn btn-link text-decoration-none d-flex align-items-center gap-2 p-0" style={{ color: "#0c5cc6", fontSize: "14px", fontWeight: "500" }}>
                <i className="bi bi-pencil-fill"></i> Editar datos
              </button>
            )}
            <button
              type="button"
              className="btn p-0 border-0 bg-transparent ms-2"
              onClick={onClose}
              aria-label="Cerrar"
              style={{ fontSize: "1.2rem", color: "#6e6d7a", lineHeight: 1 }}
            >
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
        </div>

        <div className="d-flex align-items-center gap-3 mb-4">
          <div
            className="rounded-circle overflow-hidden flex-shrink-0"
            style={{ width: "80px", height: "80px", backgroundColor: "#f5f5f5" }}
          >
            {user && user.avatar ? (
              <img src={user.avatar} alt="Avatar" className="w-100 h-100 object-fit-cover" />
            ) : (
              <div className="w-100 h-100 d-flex align-items-center justify-content-center text-secondary">
                <i className="bi bi-person-fill" style={{ fontSize: "40px" }}></i>
              </div>
            )}
          </div>
          <div className="d-flex flex-column gap-2">
            <span className="font-poppins text-dark" style={{ fontSize: "14px" }}>Selecciona la imagen</span>
            <div className="d-flex align-items-center gap-2 border rounded-3 p-1" style={{ borderColor: "rgba(161, 161, 170, 0.35)" }}>
              <button className="btn btn-sm flex-shrink-0" style={{ backgroundColor: "#e7f1fe", color: "#0c5cc6", fontWeight: "500", borderRadius: "6px", fontSize: "12px" }}>
                Seleccionar archivo
              </button>
              <span className="text-secondary font-poppins text-truncate pe-2" style={{ fontSize: "12px", maxWidth: "150px" }}>
                {user && user.avatar ? "imagen01.png" : "Ningún archivo seleccionado"}
              </span>
            </div>
            <span className="text-muted font-poppins" style={{ fontSize: "11px" }}>Tipo de archivos permitidos: jpg, png, jpeg.</span>
          </div>
        </div>

        <div className="row g-3">
          <div className="col-12 col-md-6">
            <label className="form-label font-poppins mb-1" style={{ fontSize: "13px", color: "#0f1901" }}>Nombre completo *</label>
            <input type="text" className="form-control" style={{ borderRadius: "10px", fontSize: "13px" }} value={formData.nombreCompleto} onChange={(e) => setFormData({...formData, nombreCompleto: e.target.value})} />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label font-poppins mb-1" style={{ fontSize: "13px", color: "#0f1901" }}>Usuario</label>
            <input type="text" className="form-control" style={{ borderRadius: "10px", fontSize: "13px" }} value={formData.usuario} onChange={(e) => setFormData({...formData, usuario: e.target.value})} />
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label font-poppins mb-1" style={{ fontSize: "13px", color: "#0f1901" }}>Email *</label>
            <input type="email" className="form-control" style={{ borderRadius: "10px", fontSize: "13px" }} value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label font-poppins mb-1" style={{ fontSize: "13px", color: "#0f1901" }}>Fecha de nacimiento</label>
            <input type="text" className="form-control" style={{ borderRadius: "10px", fontSize: "13px" }} value={formData.fechaNacimiento} onChange={(e) => setFormData({...formData, fechaNacimiento: e.target.value})} />
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label font-poppins mb-1" style={{ fontSize: "13px", color: "#0f1901" }}>Contraseña *</label>
            <input type="password" className="form-control" style={{ borderRadius: "10px", fontSize: "13px" }} value={formData.contrasena} onChange={(e) => setFormData({...formData, contrasena: e.target.value})} />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label font-poppins mb-1" style={{ fontSize: "13px", color: "#0f1901" }}>Confirmar contraseña *</label>
            <input type="password" className="form-control" style={{ borderRadius: "10px", fontSize: "13px" }} value={formData.confirmarContrasena} onChange={(e) => setFormData({...formData, confirmarContrasena: e.target.value})} />
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label font-poppins mb-1" style={{ fontSize: "13px", color: "#0f1901" }}>Rol</label>
            <select className="form-select" style={{ borderRadius: "10px", fontSize: "13px" }} value={formData.rol} onChange={(e) => setFormData({...formData, rol: e.target.value})}>
              <option value="Administrador">Administrador</option>
              <option value="Gerente">Gerente</option>
              <option value="Analista">Analista</option>
              <option value="Coordinadora">Coordinadora</option>
            </select>
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label font-poppins mb-1" style={{ fontSize: "13px", color: "#0f1901" }}>Estado</label>
            <select className="form-select" style={{ borderRadius: "10px", fontSize: "13px" }} value={formData.estado} onChange={(e) => setFormData({...formData, estado: e.target.value})}>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>
        </div>

        <div className="d-flex justify-content-end mt-4 pt-2">
          <button
            type="button"
            className="btn btn-primary-custom d-flex align-items-center justify-content-center shadow-premium"
            style={{ width: "200px", padding: "10px 16px", fontSize: "14px", borderRadius: "8px" }}
            onClick={onClose}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
