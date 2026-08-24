"use client";

import { configService } from "@/services/config.service";
import React, { useEffect, useState } from "react";

export default function TerminosTab() {
  const [term, setTerm] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'success' | 'error' | null

  useEffect(() => {
    async function loadTerm() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await configService.term();
        if (data && data.success === false) {
          setError(data.message || "Error al cargar los términos.");
        } else {
          setTerm(data);
        }
      } catch (err) {
        console.error("Error al cargar datos de term:", err);
        setError(err.response?.data?.message || "Error de conexión o permisos insuficientes.");
      } finally {
        setIsLoading(false);
      }
    }

    loadTerm();
  }, []);

  const handleChange = (e) => {
    setTerm((prev) => ({ ...prev, terminos_general: e.target.value }));
    if (saveStatus) setSaveStatus(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus(null);

    try {
      const formData = new FormData();
      formData.append("terminos_general", term.terminos_general ?? "");

      const res = await configService.updateTerms(formData);
      if (res && res.success === false) {
        setSaveStatus("error");
        setError(res.message || "Error al guardar, intenta de nuevo.");
      } else {
        setSaveStatus("success");
      }
    } catch (err) {
      console.error("Error al guardar términos:", err);
      setSaveStatus("error");
      setError(err.response?.data?.message || "Error de conexión o permisos insuficientes.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="d-flex flex-column h-100 font-inter w-100 p-4">Cargando...</div>;
  }

  if (error && !term) {
    return <div className="d-flex flex-column h-100 font-inter w-100 p-4 text-danger">{typeof error === 'string' ? error : error.message || "Ocurrió un error."}</div>;
  }

  if (!term) {
    return <div className="d-flex flex-column h-100 font-inter w-100 p-4">No se encontraron términos.</div>;
  }

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
              value={term.terminos_general ?? ""}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="d-flex align-items-center justify-content-end gap-3 mt-2">
          {saveStatus === "success" && (
            <span className="text-success" style={{ fontSize: "13px" }}>Guardado correctamente</span>
          )}
          {saveStatus === "error" && (
            <span className="text-danger" style={{ fontSize: "13px" }}>{typeof error === 'string' ? error : "Error al guardar, intenta de nuevo"}</span>
          )}
          <button
            className="btn btn-primary d-flex align-items-center justify-content-center shadow-premium"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}