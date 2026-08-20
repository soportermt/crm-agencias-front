"use client";

import React, { useState, useEffect } from "react";
import { configService } from "@/services/config.service";

export default function CuentasModal({ show, onClose, onAccountSaved, cuentaToEdit = null }) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    cuenta: "",
    descripcion: "",
    estatus: 1,
  });

  useEffect(() => {
    if (cuentaToEdit) {
      setFormData({
        id_cuenta: cuentaToEdit.id_cuenta,
        cuenta: cuentaToEdit.cuenta || "",
        descripcion: cuentaToEdit.descripcion || "",
        estatus: cuentaToEdit.estatus !== undefined ? Number(cuentaToEdit.estatus) : 1,
      });
    } else {
      resetForm();
    }
  }, [cuentaToEdit, show]);

  if (!show) return null;

  function resetForm() {
    setFormData({
      cuenta: "",
      descripcion: "",
      estatus: 1,
    });
    setError(null);
  }

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    if (!formData.cuenta || !formData.descripcion) {
      setError("Completa los campos obligatorios (*).");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      let savedAccount;
      if (cuentaToEdit) {
        savedAccount = await configService.updateCuenta(formData);
      } else {
        savedAccount = await configService.createCuenta(formData);
      }

      if (onAccountSaved) {
        onAccountSaved(savedAccount, !!cuentaToEdit);
      }

      resetForm();
      onClose();
    } catch (err) {
      console.error("Error al guardar cuenta:", err);
      setError("Error al guardar la cuenta en el servidor. Intenta nuevamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const isEditing = Boolean(cuentaToEdit);

  return (
    <>
      <div
        className="modal-backdrop fade show"
        style={{ zIndex: 1040 }}
        onClick={handleClose}
      />

      <div
        className="modal d-block"
        tabIndex="-1"
        style={{ zIndex: 1050, backgroundColor: "rgba(0, 0, 0, 0.1)" }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content p-4" style={{ borderRadius: "16px" }}>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="font-inter h4 mb-0 fw-medium" style={{ color: "var(--dark-green)" }}>
                {isEditing ? "Editar registro" : "Nuevo registro"}
              </h2>
              <button
                type="button"
                className="btn p-0 border-0 bg-transparent"
                onClick={handleClose}
                aria-label="Cerrar"
                style={{ fontSize: "1.5rem", color: "var(--dark-green)", lineHeight: 1 }}
              >
                <i className="bi bi-x"></i>
              </button>
            </div>

            <div>
              <h3 className="font-inter h6 fw-medium mb-2" style={{ color: "var(--dark-green)" }}>
                Datos bancarios
              </h3>
              <div className="row">
                <div className="col-12 mb-2">
                  <label className="form-label text-secondary small font-poppins mb-1">
                    Número de Cuenta *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. 1234567890"
                    className="form-control input-custom"
                    value={formData.cuenta}
                    onChange={(e) =>
                      setFormData({ ...formData, cuenta: e.target.value })
                    }
                  />
                </div>
                <div className="col-12 mb-2">
                  <label className="form-label text-secondary small font-poppins mb-1">
                    Descripción *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Banco Principal - MXN"
                    className="form-control input-custom"
                    value={formData.descripcion}
                    onChange={(e) =>
                      setFormData({ ...formData, descripcion: e.target.value })
                    }
                  />
                </div>
                {isEditing && (
                  <div className="col-12 mb-2">
                    <label className="form-label text-secondary small font-poppins mb-1">
                      Estatus
                    </label>
                    <select
                      className="form-select input-custom"
                      value={formData.estatus}
                      onChange={(e) =>
                        setFormData({ ...formData, estatus: Number(e.target.value) })
                      }
                    >
                      <option value={1}>Activo</option>
                      <option value={0}>Inactivo</option>
                    </select>
                  </div>
                )}
              </div>

              {error && (
                <div className="text-danger mb-3 font-poppins small">
                  {error}
                </div>
              )}

              {/* Footer */}
              <div className="d-flex justify-content-end mt-2">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="btn btn-primary transition-smooth fw-medium d-flex align-items-center justify-content-center"
                >
                  {submitting ? (
                    <span>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Guardando...
                    </span>
                  ) : (
                    isEditing ? "Guardar cambios" : "Confirmar"
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}