"use client";

import React, { forwardRef, useImperativeHandle, useState } from "react";

const TrasladoForm = forwardRef(function TrasladoForm({ initialData }, ref) {
    const [data, setData] = useState(
        initialData || {
            proveedor: "",
            code: "",
            origen: "",
            destino: "",
            hotel: "",
            checkIn: "",
            pasajeros: "",
            equipaje: [],
            llegada_origen: "",
            salida_origen: "",
            pickup: "",
            llegada_destino: "",
            salida_destino: "",
            limite_pago: "",
            limite_cliente: "",
            total_publico: "",
            total_neto: "",
            fee: "",
        }
    );
    const [errors, setErrors] = useState({});

    useImperativeHandle(ref, () => ({
        submit: () => {
            const newErrors = {};
            if (!data.hotel) newErrors.hotel = "Selecciona un hotel";
            if (!data.checkIn) newErrors.checkIn = "Requerido";
            if (!data.checkOut) newErrors.checkOut = "Requerido";
            if (data.pasajeros.length === 0) newErrors.pasajeros = "Agrega al menos un pasajero";

            setErrors(newErrors);
            if (Object.keys(newErrors).length > 0) return { valid: false };
            return { valid: true, data };
        },
    }));

    const toggleEquipaje = (tipo) => {
        setData((prev) => ({
            ...prev,
            equipaje: prev.equipaje.includes(tipo)
                ? prev.equipaje.filter((t) => t !== tipo)
                : [...prev.equipaje, tipo],
        }));
    };

    const setField = (name, value) => setData((d) => ({ ...d, [name]: value }));

    return (
        <div className="form-booking">
            <div className="row g-2 mb-3">
                <div className="col-12 col-md-6">
                    <label className="form-label">Proveedor *</label>
                    <input
                        type="text"
                        className="form-control"
                        value={data.proveedor}
                        onChange={(e) => setField("proveedor", e.target.value)}
                    />
                    {errors.proveedor && <div className="text-danger small">{errors.proveedor}</div>}
                </div>
                <div className="col-12 col-md-6">
                    <label className="form-label">Código *</label>
                    <input
                        type="text"
                        className="form-control"
                        value={data.code}
                        onChange={(e) => setField("code", e.target.value)}
                    />
                    {errors.code && <div className="text-danger small">{errors.code}</div>}
                </div>
                <div className="col-12 col-md-6">
                    <label className="form-label">Origen *</label>
                    <select
                        className="form-select"
                        value={data.origen}
                        onChange={(e) => setField("origen", e.target.value)}
                    >
                        <option value="">Selecciona...</option>
                        <option value="Hotel">Hotel</option>
                    </select>
                    {errors.hotel && <div className="text-danger small">{errors.hotel}</div>}
                </div>
                <div className="col-12 col-md-6">
                    <label className="form-label">Destino *</label>
                    <select
                        className="form-select"
                        value={data.destino}
                        onChange={(e) => setField("destino", e.target.value)}
                    >
                        <option value="">Selecciona...</option>
                        <option value="Aeropuerto">Aeropuerto</option>
                    </select>
                    {errors.hotel && <div className="text-danger small">{errors.hotel}</div>}
                </div>
                <div className="col-12 col-md-6">
                    <label className="form-label">Hotel *</label>
                    <select
                        className="form-select"
                        value={data.hotel}
                        onChange={(e) => setField("hotel", e.target.value)}
                    >
                        <option value="">Selecciona...</option>
                        <option value="Barcelo Maya Grand">Barcelo Maya Grand</option>
                    </select>
                    {errors.hotel && <div className="text-danger small">{errors.hotel}</div>}
                </div>
                <div className="col-12 col-md-6">
                    <label className="form-label">Fecha de servicio *</label>
                    <input
                        type="date"
                        className="form-control"
                        value={data.checkIn}
                        onChange={(e) => setField("checkIn", e.target.value)}
                    />
                    {errors.checkIn && <div className="text-danger small">{errors.checkIn}</div>}
                </div>
                <div className="col-12 col-md-6">
                    <label className="form-label">Pasajeros</label>
                    <div className="input-group">
                        <input type="number"
                            className="form-control px-2 custom-input"
                            aria-label="pasajeros"
                            aria-describedby="pasajeros"
                            style={{
                                borderRight: "1px solid var(--primary-color)",
                            }}
                            value={data.pasajeros}
                            onChange={(e) => setField("pasajeros", e.target.value)}
                        />
                        <span className="input-group-text" id="pasajeros"><i className="bi bi-pencil" /></span>
                    </div>
                </div>
                <div className="col-12 col-md-6">
                    <label className="form-label">Equipaje</label>
                    <div className="d-flex gap-1 flex-wrap">
                        <div className="form-check">
                            <input
                                type="checkbox"
                                id="mano"
                                checked={data.equipaje.includes("mano")}
                                onChange={() => toggleEquipaje("mano")}
                            />
                            <label className="form-check-label" htmlFor="mano">
                                Mano (10 kg)
                            </label>
                        </div>
                        <div className="form-check">
                            <input
                                type="checkbox"
                                id="documentado"
                                checked={data.equipaje.includes("documentado")}
                                onChange={() => toggleEquipaje("documentado")}
                            />
                            <label className="form-check-label" htmlFor="documentado">
                                Documentado (25 kg)
                            </label>
                        </div>
                        <div className="form-check">
                            <input
                                type="checkbox"
                                id="otro"
                                checked={data.equipaje.includes("otro")}
                                onChange={() => toggleEquipaje("otro")}
                            />
                            <label className="form-check-label" htmlFor="otro">
                                Otro
                            </label>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-4">
                    <label className="form-label">Llegada origen *</label>
                    <input
                        type="time"
                        className="form-control"
                        value={data.llegada_origen}
                        onChange={(e) => setField("llegada_origen", e.target.value)}
                    />
                    {errors.llegada_origen && <div className="text-danger small">{errors.llegada_origen}</div>}
                </div>
                <div className="col-12 col-md-4">
                    <label className="form-label">Salida origen *</label>
                    <input
                        type="time"
                        className="form-control"
                        value={data.salida_origen}
                        onChange={(e) => setField("salida_origen", e.target.value)}
                    />
                    {errors.salida_origen && <div className="text-danger small">{errors.salida_origen}</div>}
                </div>
                <div className="col-12 col-md-4">
                    <label className="form-label">Pickup de hotel *</label>
                    <input
                        type="time"
                        className="form-control"
                        value={data.pickup}
                        onChange={(e) => setField("pickup", e.target.value)}
                    />
                    {errors.pickup && <div className="text-danger small">{errors.pickup}</div>}
                </div>
                <div className="col-12 col-md-6">
                    <label className="form-label">Llegada destino *</label>
                    <input
                        type="time"
                        className="form-control"
                        value={data.llegada_destino}
                        onChange={(e) => setField("llegada_destino", e.target.value)}
                    />
                    {errors.llegada_destino && <div className="text-danger small">{errors.llegada_destino}</div>}
                </div>
                <div className="col-12 col-md-6">
                    <label className="form-label">Salida destino *</label>
                    <input
                        type="time"
                        className="form-control"
                        value={data.salida_destino}
                        onChange={(e) => setField("salida_destino", e.target.value)}
                    />
                    {errors.salida_destino && <div className="text-danger small">{errors.salida_destino}</div>}
                </div>
                <div className="col-12 col-md-6">
                    <label className="form-label">Límite pago *</label>
                    <input
                        type="date"
                        className="form-control"
                        value={data.limite_pago}
                        onChange={(e) => setField("limite_pago", e.target.value)}
                    />
                </div>
                <div className="col-12 col-md-6">
                    <label className="form-label">Límite cliente</label>
                    <input
                        type="date"
                        className="form-control"
                        value={data.limite_cliente}
                        onChange={(e) => setField("limite_cliente", e.target.value)}
                    />
                </div>
                <div className="col-12 col-md-6">
                    <label className="form-label">Total público</label>
                    <input
                        type="text"
                        className="form-control"
                        value={data.total_publico}
                        onChange={(e) => setField("total_publico", e.target.value)}
                    />
                </div>
                <div className="col-12 col-md-6">
                    <label className="form-label">Total neto</label>
                    <input
                        type="text"
                        className="form-control"
                        value={data.total_neto}
                        onChange={(e) => setField("total_neto", e.target.value)}
                    />
                </div>
                <div className="col-12 col-md-6">
                    <label className="form-label">Fee</label>
                    <input
                        type="text"
                        className="form-control"
                        value={data.fee}
                        onChange={(e) => setField("fee", e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
});

export default TrasladoForm;