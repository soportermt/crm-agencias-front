import React from 'react'
import Services from './Services'

export default function BookingForm() {
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
            required
          >
            <option>Andrea Lizeth Pérez</option>
          </select>
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <label htmlFor="moneda" className="form-label">
            Moneda *
          </label>
          <input
            id="moneda"
            type="text"
            className="form-control"
            required
          />
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <label htmlFor="fecha" className="form-label">
            Fecha de creación *
          </label>
          <input
            id="fecha"
            type="date"
            className="form-control"
            required
          />
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <label htmlFor="fechaLimite" className="form-label">
            Límite de cambios *
          </label>
          <input
            id="fechaLimite"
            type="date"
            className="form-control"
            required
          />
        </div>
      </div>
      <hr style={{ color: "rgba(161, 161, 170, 0.8)" }} />
      <h5 style={{ fontSize: "18px", fontWeight: 600 }}>Datos de la reserva</h5>
      <div className="row g-3">
        <div className="col-12 col-md-6 col-lg-4">
          <label htmlFor="vendidoA" className="form-label">
            Vendido a *
          </label>
          <select
            id="vendidoA"
            className="form-select"
            required
          >
            <option>Mildred Fernanda Sánchez</option>
          </select>
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <label htmlFor="titular" className="form-label">
            Pasajero titular *
          </label>
          <input
            id="titular"
            type="text"
            className="form-control"
            required
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
      <Services/>
    </div>
  )
}