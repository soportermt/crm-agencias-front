"use client";

import HotelSelect from "@/components/common/HotelSelect";
import { useBookingForm } from "../booking-form/BookingFormContext";
import ProviderSelect from "@/components/common/ProviderSelect";
import DatePicker, { registerLocale } from "react-datepicker";
import { es } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import PassengersInput from "@/components/common/PassengersInput";

registerLocale("es", es);
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
      <div className="row g-3 mb-2 justify-content-end align-items-end">
        <div className="col-12 col-md-4">
          <ProviderSelect
            value={data.provider}
            onChange={(provider) => {
              updateDraftField("provider", provider.value);
              updateDraftField("providerName", provider.label);
            }}
          />
        </div>
        <div className="col-12 col-md-4">
          <label className="form-label">Código *</label>
          <input
            type="text"
            className="form-control"
            value={data.code}
            onChange={(e) => setField("code", e.target.value)}
          />
          {errors.code && <div className="text-danger small">{errors.code}</div>}
        </div>
        <div className="col-12 col-md-4">
          <HotelSelect
            value={data.hotel}
            error={errors.hotel}
            onChange={(hotel) => {
              updateDraftField("hotel", hotel.label);
              updateDraftField("destino", hotel.destino ?? data.destino);
            }}
          />
        </div>
        <div className="col-12 col-md-4">
          <label className="form-label">Destino *</label>

          <input
            type="text"
            className="form-control"
            value={data.destino}
            onChange={(e) => setField("destino", e.target.value)}
          />

          {errors.destino && (
            <div className="text-danger small">
              {errors.destino}
            </div>
          )}
        </div>
        <div className="col-12 col-md-4">
          <label className="form-label">Fecha de servicio *</label>
          <DatePicker
            selectsRange
            startDate={data.checkIn}
            endDate={data.checkOut}
            onChange={(dates) => {
              const [start, end] = dates;
              updateDraftField("checkIn", start);
              updateDraftField("checkOut", end);
            }}
            locale="es"
            dateFormat="dd/MM/yyyy"
            minDate={new Date()}
            monthsShown={2}
            shouldCloseOnSelect={false}
            isClearable
            className="form-control"
            placeholderText="Selecciona una fecha"
          />
        </div>
        <div className="col-12 col-md-4">
          <button type="button" className="btn btn-primary w-100" onClick={addPasajero} style={{ backgroundColor: "#619E05", borderColor: "#619E05" }}>
            + Habitación
          </button>
        </div>
      </div>

      {data.pasajeros.map((p, i) => (
        <div key={i} className="row g-3 mb-2 justify-content-end align-items-center">
          <div className="col-12 col-md-4">
            <PassengersInput/>
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label">Tipo de cama</label>
            <input
              type="text"
              className="form-control"
              value={p.cama}
              onChange={(e) => updatePasajero(i, "cama", e.target.value)}
            />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label">Tipo habitación</label>
            <input
              type="text"
              className="form-control"
              value={p.habitacion}
              onChange={(e) => updatePasajero(i, "habitacion", e.target.value)}
            />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label">Plan</label>
            <input
              type="text"
              className="form-control"
              value={p.plan}
              onChange={(e) => updatePasajero(i, "plan", e.target.value)}
            />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label">Límite pago *</label>
            <DatePicker
              id="fecha"
              selected={data.limite_pago}
              onChange={(date) => updateBooking("limite_pago", date)}
              locale="es"
              dateFormat="dd/MM/yyyy"
              className="form-control"
              placeholderText="Selecciona una fecha"
            />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label">Límite cliente</label>
            <DatePicker
              id="fecha"
              selected={data.limite_cliente}
              onChange={(date) => updateBooking("limite_cliente", date)}
              locale="es"
              dateFormat="dd/MM/yyyy"
              className="form-control"
              placeholderText="Selecciona una fecha"
            />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label">Total público</label>
            <input
              type="text"
              className="form-control"
              value={p.total_publico}
              onChange={(e) => updatePasajero(i, "total_publico", e.target.value)}
            />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label">Total neto</label>
            <input
              type="text"
              className="form-control"
              value={p.total_neto}
              onChange={(e) => updatePasajero(i, "total_neto", e.target.value)}
            />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label">Fee</label>
            <input
              type="text"
              className="form-control"
              value={p.fee}
              onChange={(e) => updatePasajero(i, "fee", e.target.value)}
            />
          </div>
          <div className="col-12 col-md-4 text-end">
            <button type="button" className="btn" onClick={() => removePasajero(i)} style={{ fontSize: 14, color: "var(--brand-blue)", fontWeight: 500 }}>
              Eliminar habitación
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};