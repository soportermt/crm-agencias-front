"use client";

import HotelSelect from "@/components/common/HotelSelect";
import { useBookingForm } from "../booking-form/BookingFormContext";

export default function HospedajeForm() {
  const { draft, updateDraftField } = useBookingForm();
  const { data, errors } = draft;

  const addPasajero = () =>
    updateDraftField("pasajeros", [
      ...data.pasajeros,
      { pasajeros: "", cama: "", habitacion: "", plan: "", limite_pago: "", limite_cliente: "", total_publico: "", total_neto: "", fee: "" },
    ]);

  const updatePasajero = (i, field, value) => {
    const pasajeros = [...data.pasajeros];
    pasajeros[i] = { ...pasajeros[i], [field]: value };
    updateDraftField("pasajeros", pasajeros);
  };

  const removePasajero = (i) =>
    updateDraftField("pasajeros", data.pasajeros.filter((_, idx) => idx !== i));

  return (
    <div className="form-booking">
      <div className="row g-2 mb-2 justify-content-end">
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
          <HotelSelect
            value={data.hotel}
            error={errors.hotel}
            onChange={(hotel) => {
              updateDraftField("hotel", hotel.label);
              updateDraftField("destino", hotel.destino ?? data.destino);
            }}
          />
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label">Destino *</label>

          <input
            type="text"
            className="form-control"
            value={data.destino}
            onChange={(e) => setField("destino", e.target.value)}
            placeholder="Destino"
          />

          {errors.destino && (
            <div className="text-danger small">
              {errors.destino}
            </div>
          )}
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
          <label className="form-label">Fecha de servicio *</label>
          <input
            type="date"
            className="form-control"
            value={data.checkOut}
            onChange={(e) => setField("checkOut", e.target.value)}
          />
          {errors.checkOut && <div className="text-danger small">{errors.checkOut}</div>}
        </div>
        <div className="col-12 col-md-6 my-3">
          <button type="button" className="btn btn-sm btn-primary w-100" onClick={addPasajero} style={{ backgroundColor: "#398AF3" }}>
            + Habitación
          </button>
        </div>
      </div>

      {data.pasajeros.map((p, i) => (
        <div key={i} className="row g-2 mb-2 justify-content-end align-items-center">
          <div className="col-12 col-md-6">
            <label className="form-label">Pasajeros</label>
            <input
              type="number"
              className="form-control"
              value={p.pasajeros}
              onChange={(e) => updatePasajero(i, "pasajeros", e.target.value)}
            />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label">Tipo de cama</label>
            <input
              type="text"
              className="form-control"
              value={p.cama}
              onChange={(e) => updatePasajero(i, "cama", e.target.value)}
            />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label">Tipo habitación</label>
            <input
              type="text"
              className="form-control"
              value={p.habitacion}
              onChange={(e) => updatePasajero(i, "habitacion", e.target.value)}
            />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label">Plan</label>
            <input
              type="text"
              className="form-control"
              value={p.plan}
              onChange={(e) => updatePasajero(i, "plan", e.target.value)}
            />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label">Límite pago *</label>
            <input
              type="date"
              className="form-control"
              value={p.limite_pago}
              onChange={(e) => updatePasajero(i, "limite_pago", e.target.value)}
            />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label">Límite cliente</label>
            <input
              type="date"
              className="form-control"
              value={p.limite_cliente}
              onChange={(e) => updatePasajero(i, "limite_cliente", e.target.value)}
            />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label">Total público</label>
            <input
              type="text"
              className="form-control"
              value={p.total_publico}
              onChange={(e) => updatePasajero(i, "total_publico", e.target.value)}
            />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label">Total neto</label>
            <input
              type="text"
              className="form-control"
              value={p.total_neto}
              onChange={(e) => updatePasajero(i, "total_neto", e.target.value)}
            />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label">Fee</label>
            <input
              type="text"
              className="form-control"
              value={p.fee}
              onChange={(e) => updatePasajero(i, "fee", e.target.value)}
            />
          </div>
          <div className="col-12 col-md-6 text-end">
            <button type="button" className="btn" onClick={() => removePasajero(i)} style={{ fontSize: 14, color: "var(--brand-blue)", fontWeight: 500 }}>
              Eliminar habitación
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};