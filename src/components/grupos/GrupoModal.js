"use client";

import { grupoService } from "@/services/grupo.service";
import React, { useEffect, useState } from "react";
import HotelSelect from "../common/HotelSelect";


export default function GrupoModal({ show, onClose, onGrupoCreated, grupoAEditar }) {
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const initialForm = {
        id_grupo: 0,
        titulo_evento: "",
        hotel: "",
        tipo_habitacion: "",
        num_habitaciones: "",
        condiciones: "",
        estatus: "",
    };
    const [formData, setFormData] = useState(initialForm);

    useEffect(() => {
        if (show) {
            setFormData(
                grupoAEditar
                    ? { ...initialForm, ...grupoAEditar, id_grupo: Number(grupoAEditar.id_grupo ?? grupoAEditar.id) }
                    : initialForm
            );
            setError(null);
        }
    }, [show, grupoAEditar]);

    const handleChange = (field) => (e) =>
        setFormData((prev) => ({ ...prev, [field]: e.target.value }));

    if (!show) return null;

    const handleSubmit = async () => {
        setSubmitting(true);
        setError(null);
        try {
            const payload = {
                id_grupo: formData.id_grupo,
                titulo_evento: formData.titulo_evento,
                hotel: formData.hotel,
                tipo_habitacion: formData.tipo_habitacion,
                num_habitaciones: formData.num_habitaciones,
                condiciones: formData.condiciones,
                estatus: formData.estatus,
            };
            await grupoService.update(payload);
            onGrupoCreated?.();
        } catch (err) {
            console.error(err);
            setError(err.message || "No se pudo guardar el grupo");
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
                        Editar grupo
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

                <div className="mb-4">
                    <div className="row">
                        <div className="col-12 mb-2">
                            <label className="form-label text-secondary small font-poppins mb-1" style={{ fontWeight: 400 }}>
                                Título
                            </label>
                            <input type="text" className="form-control input-custom"
                                value={formData.titulo_evento || ""} onChange={handleChange("titulo_evento")} />
                        </div>
                        <div className="col-12 mb-2">
                            <HotelSelect
                                value={formData.hotel}
                                onChange={(opt) =>
                                    setFormData((prev) => ({ ...prev, hotel: opt ? opt.label : "" }))
                                }
                                labelSimple
                            />
                        </div>
                        <div className="col-12 mb-2">
                            <label className="form-label text-secondary small font-poppins mb-1" style={{ fontWeight: 400 }}>
                                Tipo de habitación
                            </label>
                            <input type="text" className="form-control input-custom"
                                value={formData.tipo_habitacion || ""} onChange={handleChange("tipo_habitacion")} />
                        </div>
                        <div className="col-12 mb-2">
                            <label className="form-label text-secondary small font-poppins mb-1" style={{ fontWeight: 400 }}>
                                Habitaciones
                            </label>
                            <input type="text" className="form-control input-custom"
                                value={formData.num_habitaciones || ""} onChange={handleChange("num_habitaciones")} />
                        </div>
                        <div className="col-12 mb-2">
                            <label className="form-label text-secondary small font-poppins mb-1" style={{ fontWeight: 400 }}>
                                Condiciones
                            </label>
                            <textarea
                                className="form-control"
                                value={formData.condiciones || ""}
                                onChange={handleChange("condiciones")}
                            />
                        </div>
                        <div className="col-12 mb-3">
                            <label className="form-label text-secondary small font-poppins mb-1" style={{ fontWeight: 400 }}>
                                Estatus
                            </label>
                            <select
                                name="estatus"
                                className="form-select input-custom"
                                value={formData.estatus}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        estatus: e.target.value,
                                    })
                                }
                            >
                                <option value="Activo">Activo</option>
                                <option value="Desactivado">Inactivo</option>
                            </select>
                        </div>
                    </div>
                </div>

                {error && <div className="alert alert-danger">{error}</div>}

                <div className="d-flex justify-content-end mt-4 gap-2">
                    <button type="button" className="btn btn-outline-secondary w-25" onClick={onClose} disabled={submitting}
                    >
                        Cancelar
                    </button>
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
                            borderRadius: "8px",
                        }}
                    >
                        {submitting ? (
                            <span style={{color: "#fff"}}>
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
    )
}
