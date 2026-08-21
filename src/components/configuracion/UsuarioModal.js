"use client";

import React, { useState, useEffect, useRef } from "react";
import { usuariosService } from "@/services/usuarios.service";

export default function UsuarioModal({ show, onClose, user, isAdmin }) {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [rolesList, setRolesList] = useState([]);
  const [formData, setFormData] = useState({
    nombreCompleto: "",
    usuario: "",
    email: "",
    fechaNacimiento: "",
    contrasena: "",
    confirmarContrasena: "",
    rol: 1,
    estado: "Activo",
  });

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await usuariosService.getRoles();
        if (Array.isArray(data)) {
          setRolesList(data);
        }
      } catch (err) {
        console.error("Error fetching roles", err);
      }
    };
    fetchRoles();
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        nombreCompleto: user.idUsuario?.profiles?.fullname || user.nombre || "",
        usuario: user.idUsuario?.username || (user.email ? `@${user.email.split('@')[0]}` : ""),
        email: user.idUsuario?.email || user.email || "",
        fechaNacimiento: user.fecha_nacimiento || "",
        contrasena: "",
        confirmarContrasena: "",
        rol: user.id_rol || 1,
        estado: String(user.idUsuario?.status) === "1" ? "Activo" : "Inactivo",
      });
      setPreview(user.foto ? `${process.env.NEXT_PUBLIC_API_URL || ''}/images/usuarios/${user.foto}` : null);
    } else {
      setFormData({
        nombreCompleto: "",
        usuario: "",
        email: "",
        fechaNacimiento: "",
        contrasena: "",
        confirmarContrasena: "",
        rol: 1,
        estado: "Activo",
      });
      setPreview(null);
    }
    setSelectedFile(null);
  }, [user]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (formData.contrasena !== formData.confirmarContrasena) {
      alert("Las contraseñas no coinciden");
      return;
    }
    setLoading(true);
    try {
      const formPayload = new FormData();
      Object.keys(formData).forEach(key => {
        formPayload.append(key, formData[key]);
      });
      if (selectedFile) {
        formPayload.append("foto", selectedFile);
      }

      if (user && (user.id_usuario || user.id)) {
        await usuariosService.updateUsuario(user.id_usuario || user.id, formPayload);
      } else {
        await usuariosService.createUsuario(formPayload);
      }
      onClose();
    } catch (error) {
      console.error("Error al guardar usuario", error);
      alert("Error al guardar usuario");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      setLoading(true);
      try {
        await usuariosService.deleteUsuario(user.id_usuario || user.id);
        onClose();
      } catch (error) {
        console.error("Error al eliminar", error);
        alert("Error al eliminar usuario");
      } finally {
        setLoading(false);
      }
    }
  };

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
        className="bg-white shadow-premium font-inter transition-smooth d-flex flex-column p-3 p-md-4"
        style={{
          width: "100%",
          maxWidth: "500px",
          maxHeight: "90vh",
          overflowY: "auto",
          borderRadius: "20px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between mb-4 gap-2">
          <h2 className="font-inter h4 mb-0 fw-medium" style={{ color: "#0f1901", fontSize: "22px", letterSpacing: "-0.2px" }}>
            Registro de usuarios
          </h2>
          <div className="d-flex gap-2 align-items-center">
            {user && (user.id_usuario || user.id) && isAdmin && (
              <button 
                className="btn btn-link text-danger text-decoration-none d-flex align-items-center gap-2 p-0 me-3" 
                style={{ fontSize: "14px", fontWeight: "500" }}
                onClick={handleDelete}
                disabled={loading}
              >
                <i className="bi bi-trash-fill"></i> Eliminar
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

        <div className="d-flex flex-column flex-sm-row align-items-center align-items-sm-start gap-3 mb-4 text-center text-sm-start">
          <div
            className="rounded-circle overflow-hidden flex-shrink-0"
            style={{ width: "80px", height: "80px", backgroundColor: "#f5f5f5" }}
          >
            {preview ? (
              <img src={preview} alt="Avatar" className="w-100 h-100 object-fit-cover" />
            ) : (
              <div className="w-100 h-100 d-flex align-items-center justify-content-center text-secondary">
                <i className="bi bi-person-fill" style={{ fontSize: "40px" }}></i>
              </div>
            )}
          </div>
          <div className="d-flex flex-column gap-2 w-100 align-items-center align-items-sm-start">
            <span className="font-poppins text-dark" style={{ fontSize: "14px" }}>Selecciona la imagen</span>
            <div className="d-flex flex-column flex-sm-row align-items-center gap-2 border rounded-3 p-1 w-100" style={{ borderColor: "rgba(161, 161, 170, 0.35)" }}>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept="image/png, image/jpeg, image/jpg" disabled={!isAdmin} />
              <button 
                className="btn btn-sm flex-shrink-0" 
                style={{ backgroundColor: "#e7f1fe", color: "#0c5cc6", fontWeight: "500", borderRadius: "6px", fontSize: "12px", width: "100%", maxWidth: "150px" }}
                onClick={() => fileInputRef.current.click()}
                disabled={!isAdmin}
              >
                Seleccionar archivo
              </button>
              <span className="text-secondary font-poppins text-truncate pe-2 text-center text-sm-start" style={{ fontSize: "12px", maxWidth: "100%" }}>
                {selectedFile ? selectedFile.name : "Ningún archivo seleccionado"}
              </span>
            </div>
            <span className="text-muted font-poppins" style={{ fontSize: "11px" }}>Tipo de archivos permitidos: jpg, png, jpeg.</span>
          </div>
        </div>

        <div className="row g-3">
          <div className="col-12 col-md-6">
            <label className="form-label font-poppins mb-1" style={{ fontSize: "13px", color: "#0f1901" }}>Nombre completo *</label>
            <input type="text" className="form-control" style={{ borderRadius: "10px", fontSize: "13px" }} value={formData.nombreCompleto} onChange={(e) => setFormData({...formData, nombreCompleto: e.target.value})} disabled={!isAdmin} />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label font-poppins mb-1" style={{ fontSize: "13px", color: "#0f1901" }}>Usuario</label>
            <input type="text" className="form-control" style={{ borderRadius: "10px", fontSize: "13px" }} value={formData.usuario} onChange={(e) => setFormData({...formData, usuario: e.target.value})} disabled={!isAdmin} />
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label font-poppins mb-1" style={{ fontSize: "13px", color: "#0f1901" }}>Email *</label>
            <input type="email" className="form-control" style={{ borderRadius: "10px", fontSize: "13px" }} value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} disabled={!isAdmin} />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label font-poppins mb-1" style={{ fontSize: "13px", color: "#0f1901" }}>Fecha de nacimiento</label>
            <input type="date" className="form-control" style={{ borderRadius: "10px", fontSize: "13px" }} value={formData.fechaNacimiento} onChange={(e) => setFormData({...formData, fechaNacimiento: e.target.value})} disabled={!isAdmin} />
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label font-poppins mb-1" style={{ fontSize: "13px", color: "#0f1901" }}>Contraseña *</label>
            <input type="password" className="form-control" style={{ borderRadius: "10px", fontSize: "13px" }} value={formData.contrasena} onChange={(e) => setFormData({...formData, contrasena: e.target.value})} disabled={!isAdmin} />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label font-poppins mb-1" style={{ fontSize: "13px", color: "#0f1901" }}>Confirmar contraseña *</label>
            <input type="password" className="form-control" style={{ borderRadius: "10px", fontSize: "13px" }} value={formData.confirmarContrasena} onChange={(e) => setFormData({...formData, confirmarContrasena: e.target.value})} disabled={!isAdmin} />
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label font-poppins mb-1" style={{ fontSize: "13px", color: "#0f1901" }}>Rol</label>
            <select className="form-select" style={{ borderRadius: "10px", fontSize: "13px" }} value={formData.rol} onChange={(e) => setFormData({...formData, rol: e.target.value})} disabled={!isAdmin}>
              {rolesList.map(r => (
                <option key={r.id} value={r.id}>{r.nombre}</option>
              ))}
            </select>
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label font-poppins mb-1" style={{ fontSize: "13px", color: "#0f1901" }}>Estado</label>
            <select className="form-select" style={{ borderRadius: "10px", fontSize: "13px" }} value={formData.estado} onChange={(e) => setFormData({...formData, estado: e.target.value})} disabled={!isAdmin}>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>
        </div>

        <div className="d-flex justify-content-end mt-4 pt-2">
          {isAdmin && (
            <button
              type="button"
              className="btn btn-primary-custom d-flex align-items-center justify-content-center shadow-premium"
              style={{ width: "200px", padding: "10px 16px", fontSize: "14px", borderRadius: "8px" }}
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
