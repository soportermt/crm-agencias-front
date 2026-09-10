"use client";

import HotelSelect from "@/components/common/HotelSelect";
import { useBookingForm } from "../booking-form/BookingFormContext";
import ProviderSelect from "@/components/common/ProviderSelect";
import DatePicker, { registerLocale } from "react-datepicker";
import { es } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import PassengersInput from "@/components/common/PassengersInput";
import { calcularTotalNeto, formatMoney } from "@/utils/pricing";
import { cleanDecimalInput } from "@/utils/inputFormatters";
import { useState } from "react";

registerLocale("es", es);
export default function HospedajeForm() {
  const { draft, updateDraftField } = useBookingForm();
  const { data, errors } = draft;

  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const addPasajero = () =>
    updateDraftField("habitaciones", [
      ...data.habitaciones,
      {
        adultos: 2,
        menores: 0,

        tipo_cama: "",
        tipo_habitacion: "",
        plan: "",

        total_publico: "",
        total_neto: "",

        pasajeros: [
          {
            tipo: "adult",
            nombre: "",
            apellidos: "",
          },
          {
            tipo: "adult",
            nombre: "",
            apellidos: "",
          }
        ]
      }
    ]);

  const updateRoom = (roomIndex, field, value) => {
    const habitaciones = [...data.habitaciones];

    habitaciones[roomIndex] = {
      ...habitaciones[roomIndex],
      [field]: value,
    };

    updateDraftField("habitaciones", habitaciones);
  };

  const updatePassenger = (roomIndex, passengerIndex, field, value) => {
    const habitaciones = [...data.habitaciones];

    habitaciones[roomIndex].pasajeros[passengerIndex] = {
      ...habitaciones[roomIndex].pasajeros[passengerIndex],
      [field]: value,
    };

    updateDraftField("habitaciones", habitaciones);
  };

  const removePasajero = (i) =>
    updateDraftField("habitaciones", data.habitaciones.filter((_, idx) => idx !== i));

  return (
    <div className="form-booking">
      <div className="row g-3 mb-2 justify-content-start align-items-end">
        <div className="col-12 col-md-4">
          <ProviderSelect
            value={data.provider}
            onChange={(provider) => {
              updateDraftField("provider", provider.value);
              updateDraftField("providerData", provider);
            }}
          />
        </div>
        <div className="col-12 col-md-4">
          <label className="form-label">Código *</label>
          <input
            type="text"
            className="form-control"
            value={data.code}
            onChange={(e) => updateDraftField("code", e.target.value)}
            required
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
            required
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
            open={datePickerOpen}
            onInputClick={() => setDatePickerOpen(true)}
            onClickOutside={() => setDatePickerOpen(false)}
            onChange={(dates) => {
              const [start, end] = dates;
              updateDraftField("checkIn", start);
              updateDraftField("checkOut", end);

              if (start && end) {
                setDatePickerOpen(false);
              }
            }}
            locale="es"
            dateFormat="dd/MM/yyyy"
            minDate={new Date()}
            monthsShown={2}
            shouldCloseOnSelect={false}
            isClearable
            className="form-control form-datepicker"
            placeholderText="Selecciona una fecha"
            required
            autoComplete='off'
          />
        </div>
        {/* <div className="col-12 col-md-4">
          <button type="button" className="btn btn-primary w-100" onClick={addPasajero} style={{ backgroundColor: "#75BF06", borderColor: "#75BF06" }}>
            + Habitación
          </button>
        </div> */}
      </div>

      {data.habitaciones.map((p, i) => (
        <div className="mt-4" key={i}>
          <h6 style={{ color: "var(--brand-blue)", fontWeight: 700 }}>Habitacion {i + 1}</h6>
          <div className="row g-3 mb-2 justify-content-end align-items-center">
            <div className="col-12 col-md-4">
              <PassengersInput
                room={p}
                onChange={(adultos, menores) => {
                  const habitaciones = [...data.habitaciones];

                  habitaciones[i].adultos = adultos;
                  habitaciones[i].menores = menores;

                  habitaciones[i].pasajeros = [
                    ...Array.from({ length: adultos }, () => ({
                      tipo: "adult",
                      nombre: "",
                      apellidos: "",
                    })),
                    ...Array.from({ length: menores }, () => ({
                      tipo: "child",
                      nombre: "",
                      apellidos: "",
                      edad: "",
                    })),
                  ];

                  updateDraftField("habitaciones", habitaciones);
                }}
              />
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label">Tipo de cama</label>
              <select
                className="form-control"
                value={p.tipo_cama}
                onChange={(e) => updateRoom(i, "tipo_cama", e.target.value)}
              >
                <option value="" disabled>-- Seleccione --</option>
                <option value="Matrimonial(es)">Matrimonial(es)</option>
                <option value="King">King</option>
                <option value="Queen">Queen</option>
              </select>
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label">Tipo habitación</label>
              <input
                type="text"
                className="form-control"
                value={p.tipo_habitacion}
                onChange={(e) => updateRoom(i, "tipo_habitacion", e.target.value)}
              />
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label">Plan</label>
              <select
                className="form-control mb-3"
                value={p.plan}
                onChange={(e) => updateRoom(i, "plan", e.target.value)}
              >
                <option value="" disabled>-- Seleccione --</option>
                <option value="ai">Todo Incluido</option>
                <option value="db">Desayuno Buffet</option>
                <option value="dc">Desayuno Continental</option>
                <option value="sh">Solo Hospedaje</option>
              </select>
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label">Total público</label>
              <div className="input-group mb-3">
                <span className="input-group-text">$</span>
                <input
                  type="text"
                  className="form-control"
                  value={p.total_publico}
                  onChange={(e) => updateRoom(i, "total_publico", cleanDecimalInput(e.target.value))}
                  style={{ borderLeft: "1px solid var(--primary-color)" }}
                />
              </div>
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label">Total neto</label>
              <div className="input-group mb-3">
                <span className="input-group-text">$</span>
                <input
                  type="text"
                  className="form-control"
                  value={calcularTotalNeto(p.total_publico, data.providerData?.comision).toFixed(2)}
                  readOnly
                  disabled
                  style={{ borderLeft: "1px solid var(--primary-color)", color: "rgba(64, 64, 64, .8)" }}
                />
              </div>
            </div>

          </div>
          <p className="mb-1" style={{ fontSize: "18px", fontWeight: 600 }}>Datos de los pasajeros</p>
          <div className="row g-3 mt-1">
            <div className="col-md-4 mt-1 mb-0">
              <label className="form-label">Nombre (Adulto)</label>
            </div>
            <div className="col-md-4 mt-1 mb-0">
              <label className="form-label">Apellidos (Adulto)</label>
            </div>
          </div>

          {p.pasajeros.map((pasajero, index) => {
            if (pasajero.tipo !== "adult") return null;
            return (
              <div key={`adulto-${index}`} className="row g-3 mb-1 mt-0">
                <div className="col-md-4 mt-0 mb-0">
                  <input
                    className="form-control"
                    value={pasajero.nombre}
                    onChange={(e) => updatePassenger(i, index, "nombre", e.target.value)}
                  />
                </div>
                <div className="col-md-4 mt-0 mb-0">
                  <input
                    className="form-control"
                    value={pasajero.apellidos}
                    onChange={(e) => updatePassenger(i, index, "apellidos", e.target.value)}
                  />
                </div>
              </div>
            );
          })}

          {p.pasajeros.some((pasajero) => pasajero.tipo === "child") && (
            <div className="row g-3 mt-1 mb-1">
              <div className="col-md-4 mt-1 mb-0">
                <label className="form-label">Nombre (Menor)</label>
              </div>
              <div className="col-md-4 mt-1 mb-0">
                <label className="form-label">Apellidos (Menor)</label>
              </div>
              <div className="col-md-2 mt-1 mb-0">
                <label className="form-label">Edad</label>
              </div>
            </div>
          )}

          {p.pasajeros.map((pasajero, index) => {
            if (pasajero.tipo !== "child") return null;
            return (
              <div key={`menor-${index}`} className="row g-3 mt-0 mb-1">
                <div className="col-md-4 mt-0 mb-0">
                  <input
                    className="form-control"
                    value={pasajero.nombre}
                    onChange={(e) => updatePassenger(i, index, "nombre", e.target.value)}
                  />
                </div>
                <div className="col-md-4 mt-0 mb-0">
                  <input
                    className="form-control"
                    value={pasajero.apellidos}
                    onChange={(e) => updatePassenger(i, index, "apellidos", e.target.value)}
                  />
                </div>
                <div className="col-md-2 mt-0 mb-0">
                  <input
                    type="number"
                    className="form-control"
                    value={pasajero.edad}
                    onChange={(e) => updatePassenger(i, index, "edad", Number(e.target.value))}
                  />
                </div>
              </div>
            );
          })}

          <div className="row mb-2 justify-content-start align-items-center">
            <div className="col-12 col-md-4 text-start mt-2">
              <button type="button" className="btn btn-outline-danger w-100" onClick={() => removePasajero(i)} style={{ fontSize: 14, fontWeight: 500 }}>
                Eliminar habitación
              </button>
            </div>
          </div>
        </div>
      ))}
      {/*       
      {data.habitaciones.length > 0 && ( */}
      <div className="row mb-2 justify-content-end align-items-center">
        <div className="col-12 col-md-4">
          <button type="button" className="btn btn-primary w-100" onClick={addPasajero} style={{ backgroundColor: "#75BF06", borderColor: "#75BF06" }}>
            + Habitación
          </button>
        </div>
      </div>
      {/* )} */}

      <div className="row">
        <div className="col-12 col-md-4">
          <label className="form-label">Límite pago *</label>
          <DatePicker
            id="fecha"
            selected={data.limitePago}
            onChange={(date) => updateDraftField("limitePago", date)}
            locale="es"
            dateFormat="dd/MM/yyyy"
            className="form-control form-datepicker"
            placeholderText="Selecciona una fecha"
            required
            autoComplete='off'
          />
        </div>
        <div className="col-12 col-md-4">
          <label className="form-label">Límite cliente</label>
          <DatePicker
            id="fecha"
            selected={data.limiteCliente}
            onChange={(date) => updateDraftField("limiteCliente", date)}
            locale="es"
            dateFormat="dd/MM/yyyy"
            className="form-control form-datepicker"
            placeholderText="Selecciona una fecha"
            autoComplete='off'
          />
        </div>
        <div className="col-12 col-md-4">
          <label className="form-label">Fee</label>
          <div className="input-group mb-3">
            <span className="input-group-text">$</span>
            <input
              type="text"
              className="form-control"
              value={data.fee}
              onChange={(e) => updateDraftField("fee", cleanDecimalInput(e.target.value))}
              style={{ borderLeft: "1px solid var(--primary-color)" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};