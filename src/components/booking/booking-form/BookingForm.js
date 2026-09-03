import React, { useState } from 'react';
import Services from './Services';
import CustomersSelect from '@/components/common/CustomersSelect';
import { useBookingForm } from './BookingFormContext';
import DatePicker, { registerLocale } from "react-datepicker";
import { es } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import VendedoresSelect from '@/components/common/VendedoresSelect';

registerLocale("es", es);
export default function BookingForm({ mode }) {
  const {
    booking,
    updateBooking
  } = useBookingForm();

  return (
    <div className="container-fluid py-2">
      <h5 style={{ fontSize: "18px", fontWeight: 600 }}>Información general</h5>
      <div className="row g-3">
        <div className="col-12 col-md-6 col-lg-3">
          <VendedoresSelect
           value={booking.idVendedor}
            onChange={(vendedor) => {
              updateBooking("idVendedor", vendedor.id)
            }}
          />
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <label htmlFor="moneda" className="form-label">
            Moneda *
          </label>
          <select
            className="form-select"
            value={booking.moneda}
            onChange={(e) => updateBooking("moneda", e.target.value)}
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
            selected={booking.fecha}
            onChange={(date) => updateBooking("fecha", date)}
            locale="es"
            dateFormat="dd/MM/yyyy"
            className="form-control"
            placeholderText="Selecciona una fecha"
            autoComplete='off'
          />
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <label htmlFor="fechaLimite" className="form-label">
            Límite de cambios 
          </label>
          <DatePicker
            id="fechaLimite"
            selected={booking.limiteCancelacion}
            onChange={(date) => updateBooking("limiteCancelacion", date)}
            locale="es"
            dateFormat="dd/MM/yyyy"
            className="form-control"
            placeholderText="Selecciona una fecha"
            autoComplete='off'
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
              updateBooking("customer", customer);
              updateBooking("pasajeroTitular", customer.label ?? customer.text ?? "");
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
            value={booking.pasajeroTitular}
            onChange={(e) => updateBooking("pasajeroTitular", e.target.value)}
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
            value={booking.descripcion}
            onChange={(e) => updateBooking("descripcion", e.target.value)}
          />
        </div>
      </div>
      <Services mode={mode} />
    </div>
  )
}