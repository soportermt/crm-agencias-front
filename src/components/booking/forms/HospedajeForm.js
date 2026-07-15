"use client";

import React, { forwardRef, useImperativeHandle, useState } from "react";

const HospedajeForm = forwardRef(function HospedajeForm({ initialData }, ref) {
  const [data, setData] = useState(initialData || { hotel: "", destino: "", checkIn: "", checkOut: "", pasajeros: [] });
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

  const setField = (name, value) => setData((d) => ({ ...d, [name]: value }));

  const addPasajero = () =>
    setData((d) => ({ ...d, pasajeros: [...d.pasajeros, { nombre: "", esTitular: false }] }));

  const updatePasajero = (i, field, value) =>
    setData((d) => {
      const pasajeros = [...d.pasajeros];
      pasajeros[i] = { ...pasajeros[i], [field]: value };
      return { ...d, pasajeros };
    });

  const removePasajero = (i) =>
    setData((d) => ({ ...d, pasajeros: d.pasajeros.filter((_, idx) => idx !== i) }));

  return (
    <div>
      <div className="row g-3 mb-3">
        <div className="col-12 col-md-4">
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
        <div className="col-12 col-md-4">
          <label className="form-label">Destino *</label>
          <select
            className="form-select"
            value={data.destino}
            onChange={(e) => setField("destino", e.target.value)}
          >
            <option value="">Selecciona...</option>
            <option value="Cancun">Cancun</option>
          </select>
          {errors.hotel && <div className="text-danger small">{errors.hotel}</div>}
        </div>
        <div className="col-12 col-md-4">
          <label className="form-label">Check-in *</label>
          <input
            type="date"
            className="form-control"
            value={data.checkIn}
            onChange={(e) => setField("checkIn", e.target.value)}
          />
          {errors.checkIn && <div className="text-danger small">{errors.checkIn}</div>}
        </div>
        <div className="col-12 col-md-4">
          <label className="form-label">Check-out *</label>
          <input
            type="date"
            className="form-control"
            value={data.checkOut}
            onChange={(e) => setField("checkOut", e.target.value)}
          />
          {errors.checkOut && <div className="text-danger small">{errors.checkOut}</div>}
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-2">
        <label className="form-label mb-0">Pasajeros</label>
        <button type="button" className="btn btn-sm btn-outline-primary" onClick={addPasajero}>
          + Agregar pasajero
        </button>
      </div>
      {errors.pasajeros && <div className="text-danger small mb-2">{errors.pasajeros}</div>}

      {data.pasajeros.map((p, i) => (
        <div key={i} className="d-flex gap-2 align-items-center mb-2">
          <input
            className="form-control"
            placeholder="Nombre del pasajero"
            value={p.nombre}
            onChange={(e) => updatePasajero(i, "nombre", e.target.value)}
          />
          <div className="form-check text-nowrap">
            <input
              type="checkbox"
              className="form-check-input"
              checked={p.esTitular}
              onChange={(e) => updatePasajero(i, "esTitular", e.target.checked)}
            />
            <label className="form-check-label small">Titular</label>
          </div>
          <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removePasajero(i)}>
            ×
          </button>
        </div>
      ))}
    </div>
  );
});

export default HospedajeForm;