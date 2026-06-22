"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function Sidebar({ onRegisterClientClick, mobileOpen, onCloseMobile }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    router.push("/login");
  };

  const handleLinkClick = () => {
    if (onCloseMobile) onCloseMobile();
  };

  const isActive = (path) => pathname === path;

  const getLinkClass = (path, extraClass = "") => {
    const baseClass = "d-flex align-items-center px-3 py-2 text-decoration-none transition-smooth rounded hover-light fw-medium";
    const activeClass = isActive(path) ? "bg-light text-dark fw-bold" : "";
    return `${baseClass} ${activeClass} ${extraClass}`.trim();
  };

  const getLinkStyle = (path) => ({
    fontSize: "13px",
    color: isActive(path) ? "#18181b" : "#3f3f46",
  });

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
            <Link
              href="/dashboard"
              onClick={handleLinkClick}
              className={getLinkClass("/dashboard", "gap-3 border-radius-12")}
              style={getLinkStyle("/dashboard")}
            >
              <i className="bi bi-grid-fill" style={{ color: isActive("/dashboard") ? "#18181b" : "#3f3f46" }}></i>
              <span>Dashboard</span>
            </Link>
          </div>

          <div className="mb-3">
            <p
              className="text-uppercase fw-semibold px-3 mb-2"
              style={{ fontSize: "11px", letterSpacing: "1px", color: "rgba(0, 0, 0, 0.15)" }}
            >
              Clientes
            </p>
            <Link
              href="/clientes"
              onClick={handleLinkClick}
              className={getLinkClass("/clientes", "gap-3")}
              style={getLinkStyle("/clientes")}
            >
              <span>Gestión de clientes</span>
            </Link>
          </div>

          <div className="mb-3">
            <p
              className="text-uppercase fw-semibold px-3 mb-2"
              style={{ fontSize: "11px", letterSpacing: "1px", color: "rgba(0, 0, 0, 0.2)" }}
            >
              Reservaciones
            </p>
            <Link
              href="/reservaciones"
              onClick={handleLinkClick}
              className={getLinkClass("/reservaciones", "gap-3")}
              style={getLinkStyle("/reservaciones")}
            >
              <span>Lista de reservaciones</span>
            </Link>
          </div>

          <div className="mb-3">
            <p
              className="text-uppercase fw-semibold px-3 mb-2"
              style={{ fontSize: "11px", letterSpacing: "1px", color: "rgba(0, 0, 0, 0.15)" }}
            >
              Vendedores
            </p>
            <Link
              href="/vendedores"
              onClick={handleLinkClick}
              className={getLinkClass("/vendedores", "gap-3")}
              style={getLinkStyle("/vendedores")}
            >
              <span>Gestión de vendedores</span>
            </Link>
          </div>

          <div className="mb-3">
            <p
              className="text-uppercase fw-semibold px-3 mb-2"
              style={{ fontSize: "11px", letterSpacing: "1px", color: "rgba(0, 0, 0, 0.2)" }}
            >
              Ingresos
            </p>
            <Link
              href="/ingresos"
              onClick={handleLinkClick}
              className={getLinkClass("/ingresos", "justify-content-between")}
              style={getLinkStyle("/ingresos")}
            >
              <span>Control de ingresos</span>
              <span className="badge rounded-pill bg-danger px-2 py-1 fw-bold" style={{ fontSize: "11px" }}>13</span>
            </Link>
          </div>

          <div className="mb-3">
            <p
              className="text-uppercase fw-semibold px-3 mb-2"
              style={{ fontSize: "11px", letterSpacing: "1px", color: "rgba(0, 0, 0, 0.2)" }}
            >
              Egresos
            </p>
            <Link
              href="/egresos"
              onClick={handleLinkClick}
              className={getLinkClass("/egresos", "justify-content-between")}
              style={getLinkStyle("/egresos")}
            >
              <span>Control de egresos</span>
              <span className="badge rounded-pill bg-danger px-2 py-1 fw-bold" style={{ fontSize: "11px" }}>15</span>
            </Link>
          </div>

          <div className="mb-3">
            <p
              className="text-uppercase fw-semibold px-3 mb-2"
              style={{ fontSize: "11px", letterSpacing: "1px", color: "rgba(0, 0, 0, 0.2)" }}
            >
              Catálogos
            </p>
            <Link
              href="/destinos"
              onClick={handleLinkClick}
              className={getLinkClass("/destinos", "gap-3 mb-1")}
              style={getLinkStyle("/destinos")}
            >
              <span>Destinos</span>
            </Link>
            <Link
              href="/hoteles"
              onClick={handleLinkClick}
              className={getLinkClass("/hoteles", "gap-3")}
              style={getLinkStyle("/hoteles")}
            >
              <span>Hoteles</span>
            </Link>
          </div>

          <div className="mb-3">
            <p
              className="text-uppercase fw-semibold px-3 mb-2"
              style={{ fontSize: "11px", letterSpacing: "1px", color: "rgba(0, 0, 0, 0.2)" }}
            >
              Servicios
            </p>
            <Link
              href="/productos"
              onClick={handleLinkClick}
              className={getLinkClass("/productos", "gap-3")}
              style={getLinkStyle("/productos")}
            >
              <span>Productos</span>
            </Link>
          </div>

          <div className="mb-3">
            <p
              className="text-uppercase fw-semibold px-3 mb-2"
              style={{ fontSize: "11px", letterSpacing: "1px", color: "rgba(0, 0, 0, 0.2)" }}
            >
              Utilidad por venta
            </p>
            <Link
              href="/precio-venta"
              onClick={handleLinkClick}
              className={getLinkClass("/precio-venta", "gap-3 mb-1")}
              style={getLinkStyle("/precio-venta")}
            >
              <span>Precio por venta</span>
            </Link>
            <Link
              href="/ganancia-operacion"
              onClick={handleLinkClick}
              className={getLinkClass("/ganancia-operacion", "gap-3 mb-1")}
              style={getLinkStyle("/ganancia-operacion")}
            >
              <span>Ganancia por operación</span>
            </Link>
            <Link
              href="/margen-utilidad"
              onClick={handleLinkClick}
              className={getLinkClass("/margen-utilidad", "gap-3")}
              style={getLinkStyle("/margen-utilidad")}
            >
              <span>Margen de utilidad</span>
            </Link>
          </div>
        </nav>

        <div className="border-top pt-3 flex-shrink-0">
          <Link
            href="/configuracion"
            onClick={handleLinkClick}
            className={getLinkClass("/configuracion", "gap-3 mb-2")}
            style={getLinkStyle("/configuracion")}
          >
            <i className="bi bi-gear" style={{ fontSize: "14px" }}></i>
            <span>Configuración</span>
          </Link>
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
