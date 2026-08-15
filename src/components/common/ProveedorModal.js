"use client";

import { catalogosService } from "@/services/catalogos.service";
import React, { useState } from "react";

export default function ProveedorModal({ show, onClose, onProveedorCreated }) {
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const id_agencia = 1;

    const [formData, setFormData] = useState({
        id_proveedor: 0,
        id_agencia: id_agencia,
        nombre_comercial: "",
        correo: "",
        direccion: "",
        cuidad: "",
        estado: "",
        detalles: "",
        comision: "",
        estatus: "A"
    });

    if (!show) return null;

    const resetForm = () => {
        setFormData({
            id_proveedor: 0,
            id_agencia: id_agencia,
            nombre_comercial: "",
            correo: "",
            direccion: "",
            cuidad: "",
            estado: "",
            detalles: "",
            comision: "",
            estatus: "A"
        });
    };

    const handleSubmit = async () => {

        if (!formData.nombre_comercial || !formData.correo || !formData.direccion || !formData.comision) {
            setError("Completa los campos obligatorios (*).");
            return;
        }

        try {
            setSubmitting(true);
            setError(null);
            
            const newProveedor = await catalogosService.createProveedor(formData);
            if (onProveedorCreated) {
                onProveedorCreated(newProveedor);
            }

            resetForm();
            onClose();
        } catch (err) {
            console.error("Error al registrar proveedor:", err);
            setError("Error al guardar proveedor en el backend. Intenta nuevamente.");
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
                        style={{ color: "var(--dark-green)" }}
                    >
                        Registro de nuevo proveedor
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

                <div>
                    <div className="mb-4">
                        <div className="row">
                            <div className="col-12 mb-3">
                                <label className="form-label text-secondary small font-poppins mb-1" style={{ fontWeight: 400 }}>
                                    Nombre comercial *
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="form-control input-custom"
                                    value={formData.nombre_comercial}
                                    onChange={(e) =>
                                        setFormData({ ...formData, nombre_comercial: e.target.value })
                                    }
                                />
                            </div>

                            <div className="col-12 mb-3">
                                <label className="form-label text-secondary small font-poppins mb-1" style={{ fontWeight: 400 }}>
                                    Correo electrónico *
                                </label>
                                <input
                                    type="email"
                                    placeholder="@"
                                    className="form-control input-custom"
                                    value={formData.correo}
                                    onChange={(e) =>
                                        setFormData({ ...formData, correo: e.target.value })
                                    }
                                    required
                                />
                            </div>

                            <div className="col-12 mb-3">
                                <label className="form-label text-secondary small font-poppins mb-1" style={{ fontWeight: 400 }}>
                                    Direccion *
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="form-control input-custom"
                                    value={formData.direccion}
                                    onChange={(e) =>
                                        setFormData({ ...formData, direccion: e.target.value })
                                    }
                                />
                            </div>

                            <div className="col-6 mb-3">
                                <label className="form-label text-secondary small font-poppins mb-1" style={{ fontWeight: 400 }}>
                                    Ciudad
                                </label>
                                <input
                                    type="text"
                                    className="form-control input-custom"
                                    value={formData.cuidad}
                                    onChange={(e) =>
                                        setFormData({ ...formData, cuidad: e.target.value })
                                    }
                                />
                            </div>

                            <div className="col-6 mb-3">
                                <label className="form-label text-secondary small font-poppins mb-1" style={{ fontWeight: 400 }}>
                                    Estado
                                </label>
                                <input
                                    type="text"
                                    className="form-control input-custom"
                                    value={formData.estado}
                                    onChange={(e) =>
                                        setFormData({ ...formData, estado: e.target.value })
                                    }
                                />
                            </div>

                            <div className="col-12 mb-3">
                                <label className="form-label text-secondary small font-poppins mb-1" style={{ fontWeight: 400 }}>
                                    Detalles
                                </label>
                                <input
                                    type="text"
                                    className="form-control input-custom"
                                    value={formData.detalles}
                                    onChange={(e) =>
                                        setFormData({ ...formData, detalles: e.target.value })
                                    }
                                />
                            </div>

                            <div className="col-12 mb-3">
                                <label className="form-label text-secondary small font-poppins mb-1" style={{ fontWeight: 400 }}>
                                    Comision *
                                </label>
                                <input
                                    type="number"
                                    required
                                    className="form-control input-custom"
                                    value={formData.comision}
                                    onChange={(e) =>
                                        setFormData({ ...formData, comision: e.target.value })
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    {error && <div className="text-danger mb-3 font-poppins small">{error}</div>}
                    <div className="d-flex justify-content-end mt-4">
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="btn btn-primary-custom transition-smooth fw-medium d-flex align-items-center justify-content-center"
                            style={{
                                backgroundColor: "var(--primary-color)",
                                borderColor: "var(--primary-color)",
                                width: "215px",
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

                </div>
            </div>
        </div>
    );
}
