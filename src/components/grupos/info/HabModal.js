"use client";

import { grupoService } from "@/services/grupo.service";
import { cleanDecimalInput } from "@/utils/inputFormatters";
import { calcularTotalNeto } from "@/utils/pricing";
import { TrashIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const emptyGuest = () => ({
    id_huesped: 0,
    id_habitacion: 0,
    nombres: "",
    apellidos: "",
    edad: "",
    correo: "",
    telefono: "",
});

const toYMD = (d) => {
    if (!d) return "";
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
};

const parseYMD = (s) => {
    if (!s) return null;
    const [y, m, d] = String(s).slice(0, 10).split("-").map(Number);
    return y && m && d ? new Date(y, m - 1, d) : null;
};

const diffNights = (start, end) => {
    if (!start || !end) return 0;
    return Math.round((end - start) / (1000 * 60 * 60 * 24));
};

export default function HabModal({ show, onClose, onHabCreated, habAEditar, id_grupo, comision }) {
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const [tipoHabitacion, setTipoHabitacion] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [totalPublico, setTotalPublico] = useState("");
    const [guests, setGuests] = useState([emptyGuest()]);

    useEffect(() => {
        if (!show) return;
        setError(null);
    
        if (habAEditar) {
            setTipoHabitacion(habAEditar.tipo_habitacion === "Sin dato" ? "" : habAEditar.tipo_habitacion ?? "");
            setStartDate(parseYMD(habAEditar.fecha_entrada_raw));
            setEndDate(parseYMD(habAEditar.fecha_salida_raw));
            setTotalPublico(habAEditar.total_publico ?? "");
            setGuests(
                habAEditar.habitacionesHuespedes?.length
                    ? habAEditar.habitacionesHuespedes.map((g) => ({
                        id_huesped: g.id_huesped ?? 0,
                        id_habitacion: g.id_habitacion ?? 0,
                        nombres: g.nombres ?? "",
                        apellidos: g.apellidos ?? "",
                        edad: g.edad ?? "",
                        correo: g.correo ?? "",
                        telefono: g.telefono ?? "",
                    }))
                    : [emptyGuest()]
            );
        } else {
            setTipoHabitacion("");
            setStartDate(null);
            setEndDate(null);
            setTotalPublico("");
            setGuests([emptyGuest()]);
        }
    }, [show, habAEditar]);

    const totalNeto = calcularTotalNeto(totalPublico, Number(comision) || 0).toFixed(2);

    if (!show) return null;

    const updateGuest = (index, field, value) => {
        setGuests((prev) => prev.map((g, i) => (i === index ? { ...g, [field]: value } : g)));
    };

    const addGuest = () => setGuests((prev) => [...prev, emptyGuest()]);

    const removeGuest = (index) =>
        setGuests((prev) => (prev.length === 1 ? prev : prev.filter((_, i) => i !== index)));

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!tipoHabitacion.trim() || !startDate || !endDate) {
            setError("Completa tipo de habitación y fechas de estancia.");
            return;
        }
        if (guests.some((g) => !g.nombres.trim() || !g.apellidos.trim())) {
            setError("Cada huésped debe tener nombre y apellidos.");
            return;
        }

        const hab = {
            id_habitacion: habAEditar?.id_habitacion ?? 0,
            id_grupo,
            tipo_habitacion: tipoHabitacion.trim(),
            noches: diffNights(startDate, endDate),
            fecha_entrada: toYMD(startDate),
            fecha_salida: toYMD(endDate),
            total_neto: totalNeto,
            total_publico: totalPublico || 0,
        };

        try {
            setSubmitting(true);
            setError(null);

            const res = await grupoService.createHab(hab, guests);

            if (!res?.hab) {
                const firstError = res && Object.values(res)[0];
                setError(Array.isArray(firstError) ? firstError[0] : "No se pudo guardar la habitación.");
                return;
            }

            onHabCreated();
        } catch (err) {
            console.error("Error al registrar la habitación:", err);
            setError("Error al guardar la habitación en el backend. Intenta nuevamente.");
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
                style={{ maxWidth: "800px", height: "100vh", overflowY: "auto", borderRadius: "0", padding: "24px" }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="d-flex align-items-center justify-content-between mb-4">
                    <h5 className="font-inter mb-0 fw-medium" style={{ color: "var(--dark-green)" }}>
                        {habAEditar ? "Actualización de habitación" : "Nueva habitación"}
                    </h5>
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
                    <div className="row g-2">
                        <div className="col-12 col-md-6 mb-1">
                            <label className="form-label text-secondary small font-poppins mb-1" style={{ fontWeight: 400 }}>
                                Tipo habitación
                            </label>
                            <input
                                type="text"
                                required
                                className="form-control input-custom"
                                value={tipoHabitacion}
                                onChange={(e) => setTipoHabitacion(e.target.value)}
                            />
                        </div>
                        <div className="col-12 col-md-6 mb-1">
                            <label className="form-label text-secondary small font-poppins mb-1" style={{ fontWeight: 400 }}>
                                Estancia {startDate && endDate && `(${diffNights(startDate, endDate)} noches)`}
                            </label>
                            <DatePicker
                                selectsRange
                                startDate={startDate}
                                endDate={endDate}
                                onChange={([start, end]) => {
                                    setStartDate(start);
                                    setEndDate(end);
                                }}
                                locale="es"
                                dateFormat="dd/MM/yyyy"
                                minDate={new Date()}
                                monthsShown={2}
                                shouldCloseOnSelect={false}
                                isClearable
                                className="form-control form-datepicker input-custom"
                                placeholderText="Selecciona una fecha"
                                autoComplete="off"
                            />
                        </div>
                        <div className="col-12 col-md-6">
                            <label className="form-label text-secondary small font-poppins mb-1" style={{ fontWeight: 400 }}>Total público</label>
                            <div className="input-group mb-1">
                                <span className="input-group-text">$</span>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={totalPublico}
                                    onChange={(e) => setTotalPublico(cleanDecimalInput(e.target.value))}
                                    style={{ borderLeft: "1px solid var(--primary-color)" }}
                                />
                            </div>
                        </div>
                        <div className="col-12 col-md-6">
                            <label className="form-label text-secondary small font-poppins mb-1" style={{ fontWeight: 400 }}>Total neto</label>
                            <div className="input-group mb-1">
                                <span className="input-group-text">$</span>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={totalNeto}
                                    readOnly
                                    disabled
                                    style={{ borderLeft: "1px solid var(--primary-color)", color: "rgba(64, 64, 64, .8)" }}
                                />
                            </div>
                        </div>
                        <div className="col-12 d-flex justify-content-end">
                            <span style={{ fontSize: 14, color: "rgb(12, 92, 198)" }}>Comisión: {comision}%</span>
                        </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-2 mt-4">
                        <span className="fw-medium small">Huéspedes ({guests.length})</span>
                        <button
                            type="button"
                            onClick={addGuest}
                            className="btn btn-sm btn-primary waves-effect waves-float waves-light"
                            style={{ backgroundColor: "rgb(117, 191, 6)", borderColor: "rgb(117, 191, 6)" }}
                        >
                            <i className="bi bi-plus-lg me-2"></i>
                            <span>Huésped</span>
                        </button>
                    </div>

                    {guests.map((guest, i) => (
                        <div key={i} className="row g-2 d-flex align-items-end mb-3 pb-2 border-bottom">
                            <div className="col-12 col-md-5 mb-1">
                                <label className="form-label text-secondary small font-poppins mb-1" style={{ fontWeight: 400 }}>
                                    Nombre(s)
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="form-control input-custom"
                                    value={guest.nombres}
                                    onChange={(e) => updateGuest(i, "nombres", e.target.value)}
                                />
                            </div>
                            <div className="col-12 col-md-4 mb-1">
                                <label className="form-label text-secondary small font-poppins mb-1" style={{ fontWeight: 400 }}>
                                    Apellidos
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="form-control input-custom"
                                    value={guest.apellidos  ?? ""}
                                    onChange={(e) => updateGuest(i, "apellidos", e.target.value)}
                                />
                            </div>
                            <div className="col-12 col-md-2 mb-1">
                                <label className="form-label text-secondary small font-poppins mb-1" style={{ fontWeight: 400 }}>
                                    Edad
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    className="form-control input-custom"
                                    value={guest.edad ?? ""}
                                    onChange={(e) => updateGuest(i, "edad", e.target.value)}
                                />
                            </div>
                            <div className="col-12 col-md-1 mb-2">
                                <button
                                    type="button"
                                    className="btn btn-sm btn-danger"
                                    onClick={() => removeGuest(i)}
                                    disabled={guests.length === 1}
                                >
                                    <TrashIcon width={16} />
                                </button>
                            </div>
                            <div className="col-12 col-md-6 mb-1">
                                <label className="form-label text-secondary small font-poppins mb-1" style={{ fontWeight: 400 }}>
                                    Correo electrónico
                                </label>
                                <input
                                    type="email"
                                    className="form-control input-custom"
                                    value={guest.correo  ?? ""}
                                    onChange={(e) => updateGuest(i, "correo", e.target.value)}
                                />
                            </div>
                            <div className="col-12 col-md-6 mb-1">
                                <label className="form-label text-secondary small font-poppins mb-1" style={{ fontWeight: 400 }}>
                                    Teléfono
                                </label>
                                <input
                                    type="text"
                                    className="form-control input-custom"
                                    value={guest.telefono  ?? ""}
                                    onChange={(e) => updateGuest(i, "telefono", e.target.value)}
                                />
                            </div>
                        </div>
                    ))}

                    {error && <div className="text-danger mb-3 font-poppins small">{error}</div>}

                    <div className="d-flex justify-content-end mt-4">
                        <button
                            type="submit"
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
                                <span style={{ color: "#fff" }}>
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
