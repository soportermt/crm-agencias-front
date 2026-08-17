"use client";

import { vendedoresService } from "@/services/vendedores.service";
import React, { useRef, useState } from "react";

export default function VendedoresModal({ show, onClose }) {
  const [submitting, setSubmitting] = useState(false);
  const [documentos, setDocumentos] = useState([]);

  const fileInputRef = useRef(null);
  const [tipoSeleccionado, setTipoSeleccionado] = useState("");

  if (!show) return null;

  const handleFilePick = (e) => {
    const file = e.target.files[0];
    if (!file || !tipoSeleccionado) return;
    setDocumentos((prev) => [...prev, { file, tipo: tipoSeleccionado }]);
    e.target.value = ""; // permite volver a elegir el mismo archivo si se borra
  };

  const removeDoc = (idx) => {
    setDocumentos((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const form = e.target;
    const fd = new FormData();
    fd.append("nombre", form.nombre.value);
    fd.append("correo", form.correo.value);
    fd.append("telefono", form.telefono.value);
    fd.append("direccion", form.direccion.value);

    documentos.forEach((doc, i) => {
      fd.append(`documentos[${i}][archivo]`, doc.file);
      fd.append(`documentos[${i}][tipo]`, doc.tipo);
    });

    try {
      const result = await vendedoresService.create(fd);

      if (!result.success) {
        throw new Error(
          result.message || "Error al guardar"
        );
      }


      onClose();
    } catch (err) {
      console.error(err);

    } finally {
      setSubmitting(false);
    }
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
          maxWidth: "500px",
          height: "100vh",
          overflowY: "auto",
          borderRadius: "0",
          padding: "24px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h2
            className="font-inter h4 mb-0 fw-medium"
            style={{ color: "#0f1901" }}
          >
            Registro de empleado
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

        <form onSubmit={handleSubmit} className="form-booking">
          {/* General */}
          <div className="mb-2">
            <div className="row">
              <div className="col-12 col-md-12 mb-2">
                <label className="form-label">Nombre completo *</label>
                <input type="text" name="nombre" required className="form-control" />
              </div>
              <div className="col-12 col-md-6 mb-2">
                <label className="form-label">Correo electrónico *</label>
                <input type="email" name="correo" required className="form-control" />
              </div>
              <div className="col-12 col-md-6 mb-2">
                <label className="form-label">Teléfono</label>
                <input type="tel" name="telefono" required className="form-control" />
              </div>
              <div className="col-12 col-md-12 mb-2">
                <label className="form-label">Dirección</label>
                <input type="text" name="direccion" required className="form-control" />
              </div>
              {/* <div className="col-12 col-md-6 mb-2">
                <label className="form-label">Estatus</label>
                <select name="estatus" className="form-select">
                  <option value="1">Activo</option>
                  <option value="0">Desactivado</option>
                </select>
              </div> */}
            </div>
          </div>

          <div className="mb-3">
            <h3 className="font-inter h6 fw-medium mb-2" style={{ color: "#0f1901" }}>
              Documentación
            </h3>
            <div className="row">
              <div className="col-6 mb-3">
                <label className="form-label">Tipo de documento</label>
                <select
                  className="form-select"
                  value={tipoSeleccionado}
                  onChange={(e) => setTipoSeleccionado(e.target.value)}
                >
                  <option value="">Seleccionar</option>
                  <option value="comprobante_domicilio">Comprobante de Domicilio</option>
                  <option value="identificacion_oficial">Identificación Oficial</option>
                </select>
              </div>
              <div>
                <div className="d-flex align-items-center justify-content-center w-100"
                  style={{ backgroundColor: tipoSeleccionado ? "#e7f1fe" : "#eee", border: tipoSeleccionado ? "1px solid #0c5cc6" : "rgba(0, 0, 0, 0.8)", borderRadius: "8px", height: "70px", cursor: "pointer" }}>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFilePick}
                    hidden
                  />
                  <div
                    onClick={() => tipoSeleccionado && fileInputRef.current.click()}
                    style={{ cursor: tipoSeleccionado ? "pointer" : "not-allowed", opacity: tipoSeleccionado ? 1 : 0.5, color: tipoSeleccionado ? "#0c5cc6" : "rgba(64, 64, 64, .8)" }}
                  >
                    <i className="bi bi-plus-lg me-2"></i>
                    Agregar documento
                  </div>
                </div>
              </div>

              <div className="col-12">
                {documentos.map((doc, i) => (
                  <div key={i} className="d-flex justify-content-between p-2">
                    <span>{doc.file.name} ({Math.round(doc.file.size / 1024)} kb)</span>
                    <span>{doc.tipo}</span>
                    <button type="button" onClick={() => removeDoc(i)}>Eliminar</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-end mt-2">
            <button type="submit"
              disabled={submitting}
              className="btn btn-primary transition-smooth fw-medium d-flex align-items-center justify-content-center"
              style={{
                width: "220px",
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
