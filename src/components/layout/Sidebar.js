"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function Sidebar({ onRegisterClientClick, mobileOpen, onCloseMobile }) {
  const router = useRouter();

  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <>
      <aside
        className={`bg-white border-end transition-smooth d-flex flex-column justify-content-between p-4 ${
          mobileOpen ? "d-flex position-fixed h-100 shadow-premium" : "d-none"
        } d-lg-flex font-jakarta`}
        style={{
          width: "284px",
          minWidth: "284px",
          zIndex: 1040,
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <button
          onClick={() => {
            onRegisterClientClick();
            if (onCloseMobile) onCloseMobile();
          }}
          className="btn btn-primary-custom w-100 mb-4 d-flex align-items-center justify-content-center gap-2 shadow-premium flex-shrink-0 font-poppins"
          style={{
            padding: "8px 16px",
            fontSize: "13px",
            borderRadius: "8px",
          }}
        >
          <i className="bi bi-plus-lg" style={{ fontSize: "14px" }}></i>
          <span>Registrar nuevo cliente</span>
        </button>

        <nav className="flex-grow-1 overflow-y-auto pe-1 mb-3">
          <div className="mb-4">
            <a
              href="/dashboard"
              className="d-flex align-items-center gap-3 px-3 py-2 border-radius-12 bg-light fw-medium transition-smooth"
              style={{
                color: "#18181b",
                fontSize: "13px",
                textDecoration: "none",
              }}
            >
              <i className="bi bi-grid-fill" style={{ color: "#18181b" }}></i>
              <span>Dashboard</span>
            </a>
          </div>

          <div className="mb-3">
            <p
              className="text-uppercase fw-semibold px-3 mb-2"
              style={{ fontSize: "11px", letterSpacing: "1px", color: "rgba(0, 0, 0, 0.15)" }}
            >
              Clientes
            </p>
            <a
              href="#"
              className="d-flex align-items-center gap-3 px-3 py-2 text-decoration-none transition-smooth rounded hover-light fw-medium"
              style={{ fontSize: "13px", color: "#3f3f46" }}
            >
              <span>Gestión de clientes</span>
            </a>
          </div>

          <div className="mb-3">
            <p
              className="text-uppercase fw-semibold px-3 mb-2"
              style={{ fontSize: "11px", letterSpacing: "1px", color: "rgba(0, 0, 0, 0.2)" }}
            >
              Reservaciones
            </p>
            <a
              href="#"
              className="d-flex align-items-center gap-3 px-3 py-2 text-decoration-none transition-smooth rounded hover-light fw-medium"
              style={{ fontSize: "13px", color: "#3f3f46" }}
            >
              <span>Lista de reservaciones</span>
            </a>
          </div>

          <div className="mb-3">
            <p
              className="text-uppercase fw-semibold px-3 mb-2"
              style={{ fontSize: "11px", letterSpacing: "1px", color: "rgba(0, 0, 0, 0.15)" }}
            >
              Vendedores
            </p>
            <a
              href="#"
              className="d-flex align-items-center gap-3 px-3 py-2 text-decoration-none transition-smooth rounded hover-light fw-medium"
              style={{ fontSize: "13px", color: "#3f3f46" }}
            >
              <span>Gestión de vendedores</span>
            </a>
          </div>

          <div className="mb-3">
            <p
              className="text-uppercase fw-semibold px-3 mb-2"
              style={{ fontSize: "11px", letterSpacing: "1px", color: "rgba(0, 0, 0, 0.2)" }}
            >
              Ingresos
            </p>
            <a
              href="#"
              className="d-flex align-items-center justify-content-between px-3 py-2 text-decoration-none transition-smooth rounded hover-light fw-medium"
              style={{ fontSize: "13px", color: "#3f3f46" }}
            >
              <span>Control de ingresos</span>
              <span className="badge rounded-pill bg-danger px-2 py-1 fw-bold" style={{ fontSize: "11px" }}>13</span>
            </a>
          </div>

          <div className="mb-3">
            <p
              className="text-uppercase fw-semibold px-3 mb-2"
              style={{ fontSize: "11px", letterSpacing: "1px", color: "rgba(0, 0, 0, 0.2)" }}
            >
              Egresos
            </p>
            <a
              href="#"
              className="d-flex align-items-center justify-content-between px-3 py-2 text-decoration-none transition-smooth rounded hover-light fw-medium"
              style={{ fontSize: "13px", color: "#3f3f46" }}
            >
              <span>Control de egresos</span>
              <span className="badge rounded-pill bg-danger px-2 py-1 fw-bold" style={{ fontSize: "11px" }}>15</span>
            </a>
          </div>

          <div className="mb-3">
            <p
              className="text-uppercase fw-semibold px-3 mb-2"
              style={{ fontSize: "11px", letterSpacing: "1px", color: "rgba(0, 0, 0, 0.2)" }}
            >
              Catálogos
            </p>
            <a
              href="#"
              className="d-flex align-items-center gap-3 px-3 py-2 text-decoration-none transition-smooth rounded hover-light fw-medium mb-1"
              style={{ fontSize: "13px", color: "#3f3f46" }}
            >
              <span>Destinos</span>
            </a>
            <a
              href="#"
              className="d-flex align-items-center gap-3 px-3 py-2 text-decoration-none transition-smooth rounded hover-light fw-medium"
              style={{ fontSize: "13px", color: "#3f3f46" }}
            >
              <span>Hoteles</span>
            </a>
          </div>

          <div className="mb-3">
            <p
              className="text-uppercase fw-semibold px-3 mb-2"
              style={{ fontSize: "11px", letterSpacing: "1px", color: "rgba(0, 0, 0, 0.2)" }}
            >
              Servicios
            </p>
            <a
              href="#"
              className="d-flex align-items-center gap-3 px-3 py-2 text-decoration-none transition-smooth rounded hover-light fw-medium"
              style={{ fontSize: "13px", color: "#3f3f46" }}
            >
              <span>Productos</span>
            </a>
          </div>

          <div className="mb-3">
            <p
              className="text-uppercase fw-semibold px-3 mb-2"
              style={{ fontSize: "11px", letterSpacing: "1px", color: "rgba(0, 0, 0, 0.2)" }}
            >
              Utilidad por venta
            </p>
            <a
              href="#"
              className="d-flex align-items-center gap-3 px-3 py-2 text-decoration-none transition-smooth rounded hover-light fw-medium mb-1"
              style={{ fontSize: "13px", color: "#3f3f46" }}
            >
              <span>Precio por venta</span>
            </a>
            <a
              href="#"
              className="d-flex align-items-center gap-3 px-3 py-2 text-decoration-none transition-smooth rounded hover-light fw-medium mb-1"
              style={{ fontSize: "13px", color: "#3f3f46" }}
            >
              <span>Ganancia por operación</span>
            </a>
            <a
              href="#"
              className="d-flex align-items-center gap-3 px-3 py-2 text-decoration-none transition-smooth rounded hover-light fw-medium"
              style={{ fontSize: "13px", color: "#3f3f46" }}
            >
              <span>Margen de utilidad</span>
            </a>
          </div>
        </nav>

        <div className="border-top pt-3 flex-shrink-0">
          <a
            href="#"
            className="d-flex align-items-center gap-3 px-3 py-2 text-decoration-none transition-smooth rounded hover-light fw-medium mb-2"
            style={{ fontSize: "13px", color: "#3f3f46" }}
          >
            <i className="bi bi-gear" style={{ fontSize: "14px" }}></i>
            <span>Configuración</span>
          </a>
          <button
            onClick={handleLogout}
            className="w-100 d-flex align-items-center gap-3 px-3 py-2 text-danger small bg-transparent border-0 text-start transition-smooth rounded hover-light fw-medium"
            style={{ fontSize: "13px" }}
          >
            <i className="bi bi-box-arrow-left" style={{ fontSize: "14px" }}></i>
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      <style jsx global>{`
        @media (max-width: 991.98px) {
          aside {
            position: fixed !important;
            height: 100vh !important;
            left: 0;
            top: 0;
            box-shadow: 0px 8px 30px rgba(0,0,0,0.1);
          }
        }
      `}</style>
    </>
  );
}
