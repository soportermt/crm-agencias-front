"use client";

import React, { useState } from "react";
import { clientsService } from "@/services/clients.service";

export default function ClientModal({ show, onClose, onClientCreated }) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    nombreCompleto: "",
    correo: "",
    fechaNacimiento: "",
    celular: "",
    sexo: "",
    estadoCivil: "",
    codigoPostal: "",
    ciudad: "",
    estado: "",
    pais: "",
  });

  if (!show) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);
      await clientsService.createClient(formData);
      if (onClientCreated) {
        await onClientCreated();
      }
      setFormData({
        nombreCompleto: "",
        correo: "",
        fechaNacimiento: "",
        celular: "",
        sexo: "",
        estadoCivil: "",
        codigoPostal: "",
        ciudad: "",
        estado: "",
        pais: "",
      });
      onClose();
    } catch (err) {
      console.error("Error al registrar cliente:", err);
      setError("Error al guardar cliente en el backend. Intenta nuevamente.");
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
            style={{ color: "var(--dark-green)" }}
          >
            Registro de nuevo cliente
          </h2>
          <button
            type="button"
            className="btn p-0 border-0 bg-transparent"
            onClick={onClose}
            aria-label="Cerrar"
            style={{ fontSize: "1.5rem", color: "var(--dark-green)", lineHeight: 1 }}
          >
            <i className="bi bi-x"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <h3
              className="font-inter h6 fw-medium mb-3"
              style={{ color: "var(--dark-green)" }}
            >
              Datos personales
            </h3>
            <div className="row">
              <div className="col-6 mb-3">
                <label className="form-label text-secondary small font-poppins mb-1" style={{ fontWeight: 400 }}>
                  Nombre completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Elías Salazar"
                  className="form-control input-custom"
                  value={formData.nombreCompleto}
                  onChange={(e) =>
                    setFormData({ ...formData, nombreCompleto: e.target.value })
                  }
                />
              </div>

              <div className="col-6 mb-3">
                <label className="form-label text-secondary small font-poppins mb-1" style={{ fontWeight: 400 }}>
                  Correo electrónico
                </label>
                <input
                  type="email"
                  placeholder="@"
                  className="form-control input-custom"
                  value={formData.correo}
                  onChange={(e) =>
                    setFormData({ ...formData, correo: e.target.value })
                  }
                />
              </div>

              <div className="col-6 mb-3">
                <label className="form-label text-secondary small font-poppins mb-1" style={{ fontWeight: 400 }}>
                  Fecha de nacimiento *
                </label>
                <input
                  type="text"
                  required
                  placeholder="dd/mm/aaaa"
                  className="form-control input-custom"
                  value={formData.fechaNacimiento}
                  onChange={(e) =>
                    setFormData({ ...formData, fechaNacimiento: e.target.value })
                  }
                />
              </div>

              <div className="col-6 mb-3">
                <label className="form-label text-secondary small font-poppins mb-1" style={{ fontWeight: 400 }}>
                  Celular *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+52"
                  className="form-control input-custom"
                  value={formData.celular}
                  onChange={(e) =>
                    setFormData({ ...formData, celular: e.target.value })
                  }
                />
              </div>

              <div className="col-6 mb-3">
                <label className="form-label text-secondary small font-poppins mb-1" style={{ fontWeight: 400 }}>
                  Sexo
                </label>
                <select
                  className="form-select input-custom"
                  value={formData.sexo}
                  onChange={(e) =>
                    setFormData({ ...formData, sexo: e.target.value })
                  }
                >
                  <option value="">Seleccionar</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              <div className="col-6 mb-3">
                <label className="form-label text-secondary small font-poppins mb-1" style={{ fontWeight: 400 }}>
                  Estado civil
                </label>
                <select
                  className="form-select input-custom"
                  value={formData.estadoCivil}
                  onChange={(e) =>
                    setFormData({ ...formData, estadoCivil: e.target.value })
                  }
                >
                  <option value="">Seleccionar</option>
                  <option value="Soltero">Soltero/a</option>
                  <option value="Casado">Casado/a</option>
                  <option value="Divorciado">Divorciado/a</option>
                  <option value="Viudo">Viudo/a</option>
                  <option value="UnionLibre">Unión Libre</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h3
              className="font-inter h6 fw-medium mb-3"
              style={{ color: "var(--dark-green)" }}
            >
              Dirección
            </h3>
            <div className="row">
              <div className="col-6 mb-3">
                <label className="form-label text-secondary small font-poppins mb-1" style={{ fontWeight: 400 }}>
                  Código postal
                </label>
                <input
                  type="text"
                  placeholder="Escribe el código"
                  className="form-control input-custom"
                  value={formData.codigoPostal}
                  onChange={(e) =>
                    setFormData({ ...formData, codigoPostal: e.target.value })
                  }
                />
              </div>

              <div className="col-6 mb-3">
                <label className="form-label text-secondary small font-poppins mb-1" style={{ fontWeight: 400 }}>
                  Ciudad *
                </label>
                <select
                  required
                  className="form-select input-custom"
                  value={formData.ciudad}
                  onChange={(e) =>
                    setFormData({ ...formData, ciudad: e.target.value })
                  }
                >
                  <option value="">Seleccionar</option>
                  <option value="Cancun">Cancún</option>
                  <option value="CDMX">CDMX</option>
                  <option value="Guadalajara">Guadalajara</option>
                  <option value="Monterrey">Monterrey</option>
                  <option value="Tulum">Tulum</option>
                </select>
              </div>

              <div className="col-6 mb-3">
                <label className="form-label text-secondary small font-poppins mb-1" style={{ fontWeight: 400 }}>
                  Estado *
                </label>
                <select
                  required
                  className="form-select input-custom"
                  value={formData.estado}
                  onChange={(e) =>
                    setFormData({ ...formData, estado: e.target.value })
                  }
                >
                  <option value="">Seleccionar</option>
                  <option value="QuintanaRoo">Quintana Roo</option>
                  <option value="Jalisco">Jalisco</option>
                  <option value="NuevoLeon">Nuevo León</option>
                  <option value="EstadoDeMexico">Estado de México</option>
                </select>
              </div>

              <div className="col-6 mb-3">
                <label className="form-label text-secondary small font-poppins mb-1" style={{ fontWeight: 400 }}>
                  País *
                </label>
                <select
                  required
                  className="form-select input-custom"
                  value={formData.pais}
                  onChange={(e) =>
                    setFormData({ ...formData, pais: e.target.value })
                  }
                >
                  <option value="">Seleccionar</option>
                  <option value="Mexico">México</option>
                  <option value="EEUU">EEUU</option>
                  <option value="Canada">Canadá</option>
                </select>
              </div>
            </div>
          </div>

          {error && <div className="text-danger mb-3 font-poppins small">{error}</div>}
          <div className="d-flex justify-content-end mt-4">
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary-custom transition-smooth fw-medium d-flex align-items-center justify-content-center"
              style={{
                backgroundColor: "var(--primary-color)",
                borderColor: "var(--primary-color)",
                width: "359px",
                height: "43px",
                borderRadius: "12px",
              }}
            >
              {submitting ? (
                <span>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Guardando...
                </span>
              ) : (
                "Confirmar"
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
