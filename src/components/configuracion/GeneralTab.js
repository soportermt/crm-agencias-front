"use client";

import { configService } from "@/services/config.service";
import React, { useEffect, useState } from "react";

export default function GeneralTab() {
  const [agencia, setAgencia] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

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