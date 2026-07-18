import React, { useState } from 'react';
import Services from './Services';
import CustomersSelect from '@/components/common/CustomersSelect';
import { useBookingForm } from './BookingFormContext';
import DatePicker, { registerLocale } from "react-datepicker";
import { es } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";

registerLocale("es", es);
export default function BookingForm() {
  const {
    booking,
    updateBooking
  } = useBookingForm();

  return (
    <div className="container-fluid py-2">
      <h5 style={{ fontSize: "18px", fontWeight: 600 }}>Información general</h5>
      <div className="row g-3">
        <div className="col-12 col-md-6 col-lg-3">
          <label htmlFor="agente" className="form-label">
            Agente *
          </label>
          <select
            id="agente"
            name="agente"
            className="form-select"
          >
            <option value={1}>Agente de prueba</option>
          </select>
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <label htmlFor="moneda" className="form-label">
            Moneda *
          </label>
          <select
            id="agente"
            name="agente"
            className="form-select"
          >
            <option value={"MXN"}>MXN</option>
            <option value={"USD"}>USD</option>
          </select>
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <label htmlFor="fecha" className="form-label">
            Fecha de creación *
          </label>
          <DatePicker
            id="fecha"
            selected={booking.creationDate}
            onChange={(date) => updateBooking("creationDate", date)}
            locale="es"
            dateFormat="dd/MM/yyyy"
            className="form-control"
            placeholderText="Selecciona una fecha"
          />
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <label htmlFor="fechaLimite" className="form-label">
            Límite de cambios *
          </label>
          <DatePicker
            id="fecha"
            selected={booking.limitDate}
            onChange={(date) => updateBooking("limitDate", date)}
            locale="es"
            dateFormat="dd/MM/yyyy"
            className="form-control"
            placeholderText="Selecciona una fecha"
          />
        </div>
      </div>
      <hr style={{ color: "rgba(161, 161, 170, 0.8)" }} />
      <h5 style={{ fontSize: "18px", fontWeight: 600 }}>Datos de la reserva</h5>
      <div className="row g-3">
        <div className="col-12 col-md-6 col-lg-4">
          <CustomersSelect
            value={booking.customerId}
            onChange={(customer) => {
              updateBooking("customerId", customer.value);
              updateBooking("customer", customer.label);
            }}
          />
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <label htmlFor="titular" className="form-label">
            Pasajero titular *
          </label>
          <input
            id="titular"
            type="text"
            className="form-control"
          />
        </div>
        <div className="col-12">
          <label htmlFor="observaciones" className="form-label">
            Descripción
          </label>
          <textarea
            id="observaciones"
            rows={4}
            className="form-control"
          />
        </div>
      </div>
      <Services />
    </div>
  )
}