"use client";

import React, { useState } from "react";

export default function ClientModal({ show, onClose }) {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // En una fase posterior se conectará a la API
    console.log("Datos de cliente registrados:", formData);
    onClose();
  };

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
        padding: "1rem",
      }}
      onClick={onClose}
    >
      <div
        className="bg-white p-4 border-radius-12 shadow-premium font-inter w-100 transition-smooth"
        style={{
          maxWidth: "1000px",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h2
            className="font-poppins h4 mb-0 fw-semibold"
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
          {/* Seccion 1: Datos personales */}
          <div className="mb-4">
            <h3
              className="font-poppins h6 fw-semibold mb-3"
              style={{ color: "var(--dark-green)" }}
            >
              Datos personales
            </h3>
            <div className="row">
              {/* Nombre completo */}
              <div className="col-12 col-md-6 col-lg-3 mb-3">
                <label className="form-label text-secondary small fw-medium mb-1">
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

              {/* Correo electrónico */}
              <div className="col-12 col-md-6 col-lg-3 mb-3">
                <label className="form-label text-secondary small fw-medium mb-1">
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

              {/* Fecha de nacimiento */}
              <div className="col-12 col-md-6 col-lg-3 mb-3">
                <label className="form-label text-secondary small fw-medium mb-1">
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

              {/* Celular */}
              <div className="col-12 col-md-6 col-lg-3 mb-3">
                <label className="form-label text-secondary small fw-medium mb-1">
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

              {/* Sexo */}
              <div className="col-12 col-md-6 col-lg-3 mb-3">
                <label className="form-label text-secondary small fw-medium mb-1">
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

              {/* Estado civil */}
              <div className="col-12 col-md-6 col-lg-3 mb-3">
                <label className="form-label text-secondary small fw-medium mb-1">
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

          {/* Seccion 2: Dirección */}
          <div className="mb-4">
            <h3
              className="font-poppins h6 fw-semibold mb-3"
              style={{ color: "var(--dark-green)" }}
            >
              Dirección
            </h3>
            <div className="row">
              {/* Código postal */}
              <div className="col-12 col-md-6 col-lg-3 mb-3">
                <label className="form-label text-secondary small fw-medium mb-1">
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

              {/* Ciudad */}
              <div className="col-12 col-md-6 col-lg-3 mb-3">
                <label className="form-label text-secondary small fw-medium mb-1">
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

              {/* Estado */}
              <div className="col-12 col-md-6 col-lg-3 mb-3">
                <label className="form-label text-secondary small fw-medium mb-1">
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

              {/* País */}
              <div className="col-12 col-md-6 col-lg-3 mb-3">
                <label className="form-label text-secondary small fw-medium mb-1">
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

          {/* Footer del Formulario */}
          <div className="d-flex justify-content-end mt-4">
            <button
              type="submit"
              className="btn btn-primary-custom px-5 py-2 transition-smooth fw-medium"
              style={{
                backgroundColor: "var(--primary-color)",
                borderColor: "var(--primary-color)",
                minWidth: "200px",
              }}
            >
              Confirmar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
