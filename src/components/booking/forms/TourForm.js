"use client";

import React, { forwardRef, useImperativeHandle, useState } from "react";

const TourForm = forwardRef(function TourForm({ initialData }, ref) {
    const defaultData = {
        proveedor: "",
        code: "",
        servico: "",
        checkIn: "",
        checkOut: "",
        pasajeros: [],
        descripcion: "",
        limite_pago: "",
        limite_cliente: "",
        total_publico: "",
        total_neto: "",
        fee: "",
    };

    const [data, setData] = useState({
        ...defaultData,
        ...initialData,
    });
    const [errors, setErrors] = useState({});

    useImperativeHandle(ref, () => ({
        submit: () => {
            const newErrors = {};
            if (!data.servico) newErrors.servico = "Selecciona un servico";
            if (!data.checkIn) newErrors.checkIn = "Requerido";
            if (!data.checkOut) newErrors.checkOut = "Requerido";

            setErrors(newErrors);
            if (Object.keys(newErrors).length > 0) return { valid: false };
            return { valid: true, data };
        },
    }));

    const setField = (name, value) => setData((d) => ({ ...d, [name]: value }));

    const addPasajero = () =>
        setData((d) => ({
            ...d,
            pasajeros: [
                ...d.pasajeros,
                {
                    pasajeros: "",
                    cama: "",
                    habitacion: "",
                    plan: "",
                    limite_pago: "",
                    limite_cliente: "",
                    total_publico: "",
                    total_neto: "",
                    fee: "",
                },
            ],
        }));

    const updatePasajero = (i, field, value) =>
        setData((d) => {
            const pasajeros = [...d.pasajeros];
            pasajeros[i] = { ...pasajeros[i], [field]: value };
            return { ...d, pasajeros };
        });

    const removePasajero = (i) =>
        setData((d) => ({ ...d, pasajeros: d.pasajeros.filter((_, idx) => idx !== i) }));

    return (
        <div className="form-booking">
            <div className="row g-2 mb-2">
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
                    <label className="form-label">Servicio *</label>
                    <select
                        className="form-select"
                        value={data.servicio}
                        onChange={(e) => setField("servicio", e.target.value)}
                    >
                        <option value="">Selecciona...</option>
                        <option value="Tour de Cascadas">Tour de Cascadas</option>
                    </select>
                    {errors.servicio && <div className="text-danger small">{errors.servicio}</div>}
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
                <div className="col-12 col-md-12">
                    <label className="form-label">Descripción</label>
                    <input
                        type="textarea"
                        className="form-control"
                        value={data.descripcion}
                        onChange={(e) => setField("descripcion", e.target.value)}
                    />
                    {errors.descripcion && <div className="text-danger small">{errors.descripcion}</div>}
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

export default TourForm;