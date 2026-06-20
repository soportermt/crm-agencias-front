"use client";

import React, { useState } from "react";
import StatCard from "@/components/dashboard/StatCard";

export default function DashboardPage() {
  const reservations = [
    {
      id: 1,
      folio: "892783",
      cliente: "María Domínguez Fernandez",
      hotel: "OCEAN VIEW CANCÚN ARENAS",
      habitacion: "Todo Incluido",
      fecha: "20/02/2024",
      destino: "Cancún",
      descripcion: "Traslado",
      total: "$ 1,700.50",
      moneda: "MXN",
    },
    {
      id: 2,
      folio: "892784",
      cliente: "Carlos Ramirez",
      hotel: "PARADISE ISLAND RESORT",
      habitacion: "Desayuno Incluido",
      fecha: "15/03/2024",
      destino: "Isla Mujeres",
      descripcion: "Vuelo",
      total: "$ 2,200.75",
      moneda: "MXN",
    },
    {
      id: 3,
      folio: "892785",
      cliente: "Lucía Martínez",
      hotel: "SUNSET BEACH HOTEL",
      habitacion: "Media Pensión",
      fecha: "10/04/2024",
      destino: "Playa del Carmen",
      descripcion: "Traslado",
      total: "$ 1,950.00",
      moneda: "MXN",
    },
    {
      id: 4,
      folio: "892786",
      cliente: "Javier Soto",
      hotel: "MOUNTAIN VIEW LODGE",
      habitacion: "Solo Alojamiento",
      fecha: "25/05/2024",
      destino: "Tulum",
      descripcion: "Traslado",
      total: "$ 1,950.00",
      moneda: "MXN",
    },
    {
      id: 5,
      folio: "892787",
      cliente: "Ana Torres",
      hotel: "SAND DUNES RESORT",
      habitacion: "Todo Incluido",
      fecha: "30/06/2024",
      destino: "Cozumel",
      descripcion: "Traslado",
      total: "$ 2,500.00",
      moneda: "MXN",
    },
  ];

  const dailySales = [
    {
      hotel: "OCEAN VIEW CANCÚN ARENAS",
      detail: "Tour de amanecer en la Riviera Maya",
      dates: "09/06/2026 a 12/06/2026",
      type: "Tour",
    },
    {
      hotel: "EXPLORACIÓN TULUM",
      detail: "Aventura en la selva de Tulum",
      dates: "09/06/2026 a 12/06/2026",
      type: "Tour",
    },
    {
      hotel: "RETIRO PLAYA DEL CARMEN",
      detail: "Relax en la playa de Playa del Carmen",
      dates: "09/06/2026 a 12/06/2026",
      type: "Tour",
    },
  ];

  const pendingTasks = [
    { id: "9584", time: "Justo ahora" },
    { id: "6543", time: "Justo ahora" },
    { id: "475984", time: "Hace 12 horas" },
    { id: "332r3", time: "Hace 13 horas" },
  ];

  return (
    <div className="container-fluid p-0">
      <div className="mb-4">
        <p className="text-secondary small mb-1" style={{ fontFamily: "var(--font-inter)" }}>Martes, 16 de abril 2026</p>
        <h1 className="h4 fw-semibold font-poppins text-dark m-0">Bienvenido de vuelta, Vanessa</h1>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-md-3">
          <StatCard
            title="Total a Cobrar"
            value="$15,769,184.91"
            trend="up"
          />
        </div>
        <div className="col-12 col-sm-6 col-md-3">
          <StatCard
            title="Total a Pagar"
            value="$700,457.30"
            trend="down"
          />
        </div>
        <div className="col-12 col-sm-6 col-md-3">
          <StatCard
            title="Total Generado en Ventas"
            value="$36,978,278.74"
            trend="up"
          />
        </div>
        <div className="col-12 col-sm-6 col-md-3">
          <StatCard
            title="Clientes Registrados"
            value="630"
            trend="user"
          />
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-md-7">
          <div className="bg-white p-4 border shadow-premium h-100" style={{ borderRadius: "12px" }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="fw-normal font-inter mb-0" style={{ fontSize: "16px", color: "#0f1901" }}>
                Ventas del día
              </h2>
              <a
                href="#"
                className="text-decoration-none fw-medium d-flex align-items-center gap-1 transition-smooth hover-underline"
                style={{ color: "#0c5cc6", fontSize: "14px" }}
                onClick={(e) => e.preventDefault()}
              >
                <span>Ir a la sección</span>
                <i className="bi bi-arrow-up-right"></i>
              </a>
            </div>
            
            <div className="d-flex flex-column" style={{ gap: "6px" }}>
              {dailySales.map((sale, index) => (
                <div
                  key={index}
                  className="transition-smooth"
                  style={{ backgroundColor: "rgba(71, 71, 71, 0.05)", padding: "10px 16px", borderRadius: "12px" }}
                >
                  <div className="d-flex justify-content-between align-items-start">
                    <div style={{ fontFamily: "var(--font-inter)" }}>
                      <h4 className="fw-semibold mb-0.5" style={{ fontSize: "13px", color: "#1e293b" }}>
                        {sale.hotel}
                      </h4>
                      <p className="mb-1 fw-medium" style={{ fontSize: "12px", color: "#1e293b" }}>
                        {sale.detail}
                      </p>
                      <p className="mb-0 font-inter" style={{ fontSize: "12px", color: "rgba(64, 64, 64, 0.8)" }}>
                        Fecha del servicio: <span className="fw-semibold">{sale.dates}</span>
                      </p>
                    </div>
                    <span
                      className="font-inter fw-semibold"
                      style={{ fontSize: "12px", color: "#227cf2" }}
                    >
                      {sale.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-12 col-md-5">
          <div className="bg-white p-4 border shadow-premium h-100" style={{ borderRadius: "12px" }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="font-inter mb-0" style={{ fontSize: "16px", color: "#0f1901" }}>
                <span className="fw-semibold">Pendientes</span>
                <span className="fw-normal"> del día</span>
              </h2>
              <a
                href="#"
                className="text-decoration-none fw-medium transition-smooth hover-underline"
                style={{ color: "#0c5cc6", fontSize: "14px" }}
                onClick={(e) => e.preventDefault()}
              >
                Ver más
              </a>
            </div>

            <div className="d-flex flex-column" style={{ gap: "10px" }}>
              {pendingTasks.map((task, index) => (
                <div key={index} className="d-flex align-items-center" style={{ gap: "8px", padding: "4px 8px" }}>
                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{
                      width: "36px",
                      height: "36px",
                      minWidth: "36px",
                      backgroundColor: "#f4faeb",
                      color: "#619e05",
                      borderRadius: "8px",
                      fontSize: "16px",
                    }}
                  >
                    <i className="bi bi-exclamation-triangle-fill"></i>
                  </div>
                  <div className="flex-grow-1" style={{ fontFamily: "var(--font-inter)" }}>
                    <h4 className="fw-semibold text-dark mb-0.5" style={{ fontSize: "14px", lineHeight: "20px" }}>
                      Atraso de pago #{task.id}
                    </h4>
                    <p className="mb-0" style={{ fontSize: "12px", color: "rgba(0, 0, 0, 0.4)", lineHeight: "16px" }}>
                      {task.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 border shadow-premium" style={{ borderRadius: "12px" }}>
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
          <div>
            <h2 className="font-inter mb-0 text-dark" style={{ fontSize: "16px" }}>
              <span className="fw-semibold" style={{ color: "#0f1901" }}>Próximas </span>
              <span className="fw-normal" style={{ color: "#0f1901" }}>reservas del mes</span>
            </h2>
          </div>
          
          <div className="d-flex align-items-center gap-2">
            <button
              className="btn d-flex align-items-center gap-2 px-3 py-2 transition-smooth"
              style={{
                backgroundColor: "#e7f1fe",
                border: "1px solid #0c5cc6",
                borderRadius: "8px",
                color: "#0c5cc6",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              <i className="bi bi-cloud-arrow-down-fill"></i>
              <span>Exportar</span>
            </button>
            
            <a
              href="#"
              className="text-decoration-none fw-medium d-flex align-items-center gap-1 px-3 py-2 transition-smooth hover-underline"
              style={{ color: "#0c5cc6", fontSize: "14px" }}
              onClick={(e) => e.preventDefault()}
            >
              <span>Ir a la sección</span>
              <i className="bi bi-arrow-up-right"></i>
            </a>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table align-middle table-hover mb-0" style={{ minWidth: "1200px" }}>
             <thead className="small">
              <tr className="align-middle">
                {["ID", "Folio", "Cliente", "Hotel", "Tipo de habitación", "Fecha de venta", "Destino", "Descripción", "Total", "Moneda"].map((header, index) => (
                  <th
                    key={index}
                    className="fw-medium font-inter"
                    style={{
                      backgroundColor: "#e7f1fe",
                      color: "#0c5cc6",
                      padding: "10px 16px",
                      borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                      borderTop: "none",
                    }}
                  >
                    <span className="d-inline-flex align-items-center gap-1">
                      {header}
                      {(header === "ID" || header === "Folio" || header === "Cliente" || header === "Hotel" || header === "Tipo de habitación" || header === "Fecha de venta" || header === "Destino" || header === "Descripción" || header === "Total" || header === "Moneda") && (
                        <i className="bi bi-arrow-down small opacity-50"></i>
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="small">
              {reservations.map((res) => (
                <tr key={res.id} style={{ borderBottom: "1px solid rgba(0,0,0,0.1)" }}>
                  <td className="py-3 px-3 font-inter" style={{ color: "#0f1901", fontSize: "13px" }}>{res.id}</td>
                  <td className="py-3 px-3 font-inter" style={{ color: "#0f1901", fontSize: "13px" }}>{res.folio}</td>
                  <td className="py-3 px-3 font-inter" style={{ color: "#0f1901", fontSize: "13px" }}>{res.cliente}</td>
                  <td className="py-3 px-3 font-inter" style={{ color: "#0f1901", fontSize: "13px" }}>{res.hotel}</td>
                  <td className="py-3 px-3 font-inter" style={{ color: "#0f1901", fontSize: "13px" }}>{res.habitacion}</td>
                  <td className="py-3 px-3 font-inter" style={{ color: "#0f1901", fontSize: "13px" }}>{res.fecha}</td>
                  <td className="py-3 px-3 font-inter" style={{ color: "#0f1901", fontSize: "13px" }}>{res.destino}</td>
                  <td className="py-3 px-3 font-inter" style={{ color: "#0f1901", fontSize: "13px" }}>{res.descripcion}</td>
                  <td className="py-3 px-3 font-inter" style={{ color: "#0f1901", fontSize: "13px" }}>{res.total}</td>
                  <td className="py-3 px-3 font-inter" style={{ color: "#0f1901", fontSize: "13px" }}>{res.moneda}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="d-flex justify-content-center mt-4">
          <nav aria-label="Navegación de reservas">
            <div className="d-inline-flex align-items-center">
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                style={{
                  border: "1px solid #dcdcdc",
                  color: "#292929",
                  fontSize: "14px",
                  height: "36px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                  cursor: "pointer",
                  textDecoration: "none",
                  backgroundColor: "#ffffff",
                  borderTopLeftRadius: "6px",
                  borderBottomLeftRadius: "6px",
                  padding: "0 12px",
                }}
              >
                <i className="bi bi-chevron-left" style={{ fontSize: "12px", color: "#292929" }}></i>
                <span>Previous</span>
              </a>

              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                style={{
                  border: "1px solid #dcdcdc",
                  color: "#292929",
                  fontSize: "14px",
                  height: "36px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                  cursor: "pointer",
                  textDecoration: "none",
                  backgroundColor: "#f6f6f6",
                  marginLeft: "-1px",
                  padding: "0 14px",
                }}
              >
                1
              </a>

              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                style={{
                  border: "1px solid #dcdcdc",
                  color: "#292929",
                  fontSize: "14px",
                  height: "36px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                  cursor: "pointer",
                  textDecoration: "none",
                  backgroundColor: "#ffffff",
                  marginLeft: "-1px",
                  padding: "0 14px",
                }}
              >
                2
              </a>

              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                style={{
                  border: "1px solid #dcdcdc",
                  color: "#292929",
                  fontSize: "14px",
                  height: "36px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                  cursor: "pointer",
                  textDecoration: "none",
                  backgroundColor: "#ffffff",
                  borderTopRightRadius: "6px",
                  borderBottomRightRadius: "6px",
                  marginLeft: "-1px",
                  padding: "0 12px",
                }}
              >
                <span>Next</span>
                <i className="bi bi-chevron-right" style={{ fontSize: "12px", color: "#292929" }}></i>
              </a>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}
