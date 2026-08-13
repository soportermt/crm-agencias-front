"use client";

import HotelSelect from "@/components/common/HotelSelect";
import { useBookingForm } from "../booking-form/BookingFormContext";
import ProviderSelect from "@/components/common/ProviderSelect";
import DatePicker, { registerLocale } from "react-datepicker";
import { es } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import PassengersInput from "@/components/common/PassengersInput";
import { calcularTotalNeto, formatMoney } from "@/utils/pricing";

registerLocale("es", es);
export default function HospedajeForm() {
  const { draft, updateDraftField } = useBookingForm();
  const { data, errors } = draft;

  const addPasajero = () =>
    updateDraftField("habitaciones", [
      ...data.habitaciones,
      {
        adultos: 2,
        menores: 0,

        tipo_cama: "",
        tipo_habitacion: "",
        plan: "",

        // limitePago: null,
        // limiteCliente: null,

        total_publico: "",
        total_neto: "",
        // fee: "",

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
      <div className="row g-3 mb-2 justify-content-end align-items-end">
        <div className="col-12 col-md-4">
          <ProviderSelect
            idAgencia={data.idAgencia || 1}
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
            required
            autoComplete='off'
          />
        </div>
        <div className="col-12 col-md-4">
          <button type="button" className="btn btn-primary w-100" onClick={addPasajero} style={{ backgroundColor: "#619E05", borderColor: "#619E05" }}>
            + Habitación
          </button>
        </div>
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
                <option value="matrimoniales">2 matrimoniales</option>
                <option value="king">King</option>
                <option value="queen">Queen</option>
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
                  onChange={(e) => updateRoom(i, "total_publico", e.target.value)}
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
          {p.pasajeros.map((pasajero, index) => (
            <div key={index} className="row g-3 mb-1">
              <div className="col-md-4">
                <label className="form-label">
                  Nombre ({pasajero.tipo === "adult" ? "Adulto" : "Menor"})
                </label>

                <input
                  className="form-control"
                  value={pasajero.nombre}
                  onChange={(e) => updatePassenger(i, index, "nombre", e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">
                  Apellidos ({pasajero.tipo === "adult" ? "Adulto" : "Menor"})
                </label>

                <input
                  className="form-control"
                  value={pasajero.apellidos}
                  onChange={(e) => updatePassenger(i, index, "apellidos", e.target.value)}
                />
              </div>

              {pasajero.tipo === "child" && (
                <div className="col-md-2">
                  <label className="form-label">Edad</label>

                  <input
                    type="number"
                    className="form-control"
                    value={pasajero.edad}
                    onChange={(e) => updatePassenger(i, index, "edad", Number(e.target.value))}
                  />
                </div>
              )}
            </div>
          ))}
          <div className="row mb-2 justify-content-end align-items-center">
            <div className="col-12 col-md-4 text-end m-0">
              <button type="button" className="btn btn-outline-primary" onClick={() => removePasajero(i)} style={{ fontSize: 14, fontWeight: 500 }}>
                Eliminar habitación
              </button>
            </div>
          </div>
        </div>
      ))}

      <div className="row">
        <div className="col-12 col-md-4">
          <label className="form-label">Límite pago *</label>
          <DatePicker
            id="fecha"
            selected={data.limitePago}
            onChange={(date) => updateDraftField("limitePago", date)}
            locale="es"
            dateFormat="dd/MM/yyyy"
            className="form-control"
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
            className="form-control"
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
              onChange={(e) => updateDraftField("fee", e.target.value)}
              style={{ borderLeft: "1px solid var(--primary-color)" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};