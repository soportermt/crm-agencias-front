"use client";

import { configService } from "@/services/config.service";
import React, { useEffect, useRef, useState } from "react";

export default function GeneralTab() {
  const [agencia, setAgencia] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    async function loadAgencia() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await configService.config();
        setAgencia(data);
      } catch (err) {
        console.error("Error al cargar datos de agencia:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }

    loadAgencia();
  }, []);

  function handleChange(field, value) {
    setAgencia((prev) => ({ ...prev, [field]: value }));
  }

  function handleFileChange(e) {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);

      const file = e.target.files[0];
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  }

  async function handleSave() {
    if (!agencia?.id_agencia) {
      console.error("No hay id_agencia disponible para actualizar.");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await configService.editarAgencia(agencia, logoFile);
    } catch (err) {
      console.error("Error al guardar datos de agencia:", err);
      setError(err);
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) return <div className="d-flex justify-content-center py-5">Cargando...</div>;
  if (error || !agencia) return <div className="text-danger">No se pudo cargar la información.</div>;

  return (
    <div className="d-flex flex-column h-100">
      <div className="mb-4">
        <h5 className="mb-0 fw-medium text-dark" style={{ fontSize: "18px", letterSpacing: "-0.126px" }}>
          Actualiza los datos de la agencia
        </h5>
      </div>

      <div className="d-flex flex-column gap-4 w-100 form-booking">
        <div className="row g-3">
          <div className="col-12 col-md-6 mt-1">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              className="form-control"
              value={agencia.nombre_comercial ?? ""}
              onChange={(e) => handleChange("nombre_comercial", e.target.value)}
            />
          </div>
          <div className="col-12 col-md-6 mt-1">
            <label className="form-label">Correo electrónico</label>
            <input
              type="email"
              className="form-control"
              value={agencia.correo ?? ""}
              onChange={(e) => handleChange("correo", e.target.value)}
            />
          </div>
        </div>

        <div className="row g-3">
          <div className="col-12 col-md-6 mt-1">
            <label className="form-label">Teléfono</label>
            <input
              type="text"
              className="form-control"
              value={agencia.telefono ?? ""}
              onChange={(e) => handleChange("telefono", e.target.value)}
            />
          </div>
          <div className="col-12 col-md-6 mt-1">
            <label className="form-label">Dirección</label>
            <input
              type="text"
              className="form-control"
              value={agencia.direccion ?? ""}
              onChange={(e) => handleChange("direccion", e.target.value)}
            />
          </div>
        </div>

        <div className="row g-3">
          <div className="col-12 col-md-6 mt-1">
            <label className="form-label">Código postal</label>
            <input
              type="text"
              className="form-control"
              value={agencia.codigo_postal ?? ""}
              onChange={(e) => handleChange("codigo_postal", e.target.value)}
            />
          </div>
          <div className="col-12 col-md-6 mt-1">
            <label className="form-label">Ciudad</label>
            <input
              type="text"
              className="form-control"
              value={agencia.ciudad ?? ""}
              onChange={(e) => handleChange("ciudad", e.target.value)}
            />
          </div>
        </div>

        <div className="row g-3">
          <div className="col-12 col-md-6 mt-1">
            <label className="form-label">Estado</label>
            <input
              type="text"
              className="form-control"
              value={agencia.estado ?? ""}
              onChange={(e) => handleChange("estado", e.target.value)}
            />
          </div>
          <div className="col-12 col-md-6 mt-1">
            <label className="form-label">Sitio web</label>
            <input
              type="text"
              className="form-control"
              value={agencia.sitio_web ?? ""}
              onChange={(e) => handleChange("sitio_web", e.target.value)}
            />
          </div>

          <div className="col-12 col-md-6 mt-1">
            <label className="form-label">Logotipo</label>
            <div className="d-flex flex-column flex-sm-row align-items-center gap-2 border rounded-3 p-1 w-100" style={{ borderColor: "rgba(161, 161, 170, 0.35)" }}>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept="image/png, image/jpeg, image/jpg" />
              <button
                className="btn btn-sm flex-shrink-0"
                style={{ backgroundColor: "#e7f1fe", color: "#0c5cc6", fontWeight: "500", borderRadius: "6px", fontSize: "12px", width: "100%", maxWidth: "150px" }}
                onClick={() => fileInputRef.current.click()}
              >
                Seleccionar archivo
              </button>
              <span className="text-secondary font-poppins text-truncate pe-2 text-center text-sm-start" style={{ fontSize: "12px", maxWidth: "100%" }}>
                {selectedFile ? selectedFile.name : "Ningún archivo seleccionado"}
              </span>
            </div>
            {preview ? (
              <img src={preview} alt="Preview logotipo" style={{ maxHeight: 60, marginTop: 8, borderRadius: 6 }} />
            ) : agencia.logotipo ? (
              <img
                src={`https://crm.2businesstravel.com/admin/images/agencia/${agencia.logotipo}`}
                alt="Logotipo actual"
                style={{ maxHeight: 60, marginTop: 8, borderRadius: 6 }}
              />
            ) : null}
            <span className="text-muted font-poppins" style={{ fontSize: "11px" }}>Tipo de archivos permitidos: jpg, png, jpeg.</span>
          </div>
        </div>

        <div className="mt-2 text-end">
          <button
            onClick={handleSave}
            className='btn btn-primary w-50 mt-3'
            style={{ backgroundColor: "var(--brand-blue)" }}
            disabled={isSaving}
          >
            {isSaving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}