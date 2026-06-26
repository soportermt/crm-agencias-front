"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function Sidebar({ onRegisterClientClick, mobileOpen, onCloseMobile, isPinned, onTogglePin }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);

  const isExpanded = isPinned || isHovered;

  const handleLogout = () => {
    router.push("/login");
  };

  const handleLinkClick = () => {
    if (onCloseMobile) onCloseMobile();
  };

  const isActive = (path) => pathname === path;

  const getLinkClass = (path, extraClass = "") => {
    const baseClass = "d-flex align-items-center px-3 py-2 text-decoration-none rounded hover-light fw-medium";
    const activeClass = isActive(path) ? "bg-light text-dark fw-bold" : "";
    return `${baseClass} ${activeClass} ${extraClass}`.trim();
  };

  const getLinkStyle = (path) => ({
    fontSize: "13px",
    color: isActive(path) ? "#18181b" : "#3f3f46",
  });

  const renderNavLink = (href, label, iconClass, badge = null) => {
    const active = isActive(href);
    return (
      <Link
        href={href}
        onClick={handleLinkClick}
        className={getLinkClass(href, `gap-3 ${!isExpanded ? "justify-content-center px-0" : ""}`)}
        style={getLinkStyle(href)}
        title={!isExpanded ? label : undefined}
      >
        <i className={`bi ${iconClass}`} style={{ fontSize: "16px", color: active ? "#18181b" : "#3f3f46" }}></i>
        {isExpanded && <span className="text-truncate">{label}</span>}
        {isExpanded && badge}
      </Link>
    );
  };

  const renderCategoryHeader = (label) => {
    if (!isExpanded) return <hr className="my-2" style={{ opacity: 0.1 }} />;
    return (
      <p
        className="text-uppercase fw-semibold px-3 mb-2"
        style={{ fontSize: "11px", letterSpacing: "1px", color: "rgba(0, 0, 0, 0.15)" }}
      >
        {label}
      </p>
    );
  };

  return (
    <>
      <aside
        onMouseEnter={() => !mobileOpen && setIsHovered(true)}
        onMouseLeave={() => !mobileOpen && setIsHovered(false)}
        className={`bg-white border-end d-flex flex-column justify-content-between ${
          mobileOpen ? "d-flex position-fixed h-100 shadow-premium" : "d-none"
        } d-lg-flex font-jakarta`}
        style={{
          width: isExpanded ? "284px" : "80px",
          minWidth: isExpanded ? "284px" : "80px",
          zIndex: 1040,
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          overflowX: "hidden",
          transition: "width 0.25s ease-in-out, min-width 0.25s ease-in-out, padding 0.25s ease-in-out",
          padding: isExpanded ? "24px" : "24px 8px",
        }}
      >
        <div className="flex-shrink-0 mb-4">
          <div className={`d-flex align-items-center mb-3 ${isExpanded ? "justify-content-end" : "justify-content-center"}`} style={{ height: "24px" }}>
            <button
              onClick={onTogglePin}
              className="btn btn-link text-secondary p-0 border-0"
              style={{ textDecoration: "none" }}
              title={isExpanded ? "Fijar menú" : "Expandir y fijar menú"}
            >
              <i className={`bi ${isPinned ? "bi-circle-fill text-primary" : "bi-circle"}`} style={{ fontSize: "14px" }}></i>
            </button>
          </div>

          <button
            onClick={() => {
              onRegisterClientClick();
              if (onCloseMobile) onCloseMobile();
            }}
            className="btn btn-primary-custom w-100 d-flex align-items-center justify-content-center gap-2 shadow-premium font-poppins"
            style={{
              padding: isExpanded ? "8px 16px" : "8px 0",
              fontSize: "13px",
              borderRadius: "8px",
            }}
            title={!isExpanded ? "Registrar nuevo cliente" : undefined}
          >
            <i className="bi bi-plus-lg" style={{ fontSize: "14px" }}></i>
            {isExpanded && <span>Registrar nuevo cliente</span>}
          </button>
        </div>

        <nav className="flex-grow-1 overflow-y-auto pe-1 mb-3">
          <div className="mb-4">
            {renderNavLink("/dashboard", "Dashboard", "bi-grid-fill")}
          </div>

          <div className="mb-3">
            {renderCategoryHeader("Clientes")}
            {renderNavLink("/clientes", "Gestión de clientes", "bi-people-fill")}
          </div>

          <div className="mb-3">
            {renderCategoryHeader("Reservaciones")}
            {renderNavLink("/reservaciones", "Lista de reservaciones", "bi-calendar-check-fill")}
          </div>

          <div className="mb-3">
            {renderCategoryHeader("Vendedores")}
            {renderNavLink("/vendedores", "Gestión de vendedores", "bi-person-badge-fill")}
          </div>

          <div className="mb-3">
            {renderCategoryHeader("Ingresos")}
            {renderNavLink(
              "/ingresos",
              "Control de ingresos",
              "bi-cash-coin",
              <span className="badge rounded-pill bg-danger px-2 py-1 fw-bold" style={{ fontSize: "11px" }}>13</span>
            )}
          </div>

          <div className="mb-3">
            {renderCategoryHeader("Egresos")}
            {renderNavLink(
              "/egresos",
              "Control de egresos",
              "bi-cash-stack",
              <span className="badge rounded-pill bg-danger px-2 py-1 fw-bold" style={{ fontSize: "11px" }}>15</span>
            )}
          </div>

          <div className="mb-3">
            {renderCategoryHeader("Catálogos")}
            {renderNavLink("/destinos", "Destinos", "bi-geo-alt-fill")}
            <div className="mt-1">
              {renderNavLink("/hoteles", "Hoteles", "bi-building")}
            </div>
          </div>

          <div className="mb-3">
            {renderCategoryHeader("Servicios")}
            {renderNavLink("/productos", "Productos", "bi-box-seam-fill")}
          </div>

          <div className="mb-3">
            {renderCategoryHeader("Utilidad por venta")}
            {renderNavLink("/precio-venta", "Precio por venta", "bi-currency-dollar")}
            <div className="mt-1">
              {renderNavLink("/ganancia-operacion", "Ganancia por operación", "bi-calculator")}
            </div>
            <div className="mt-1">
              {renderNavLink("/margen-utilidad", "Margen de utilidad", "bi-pie-chart-fill")}
            </div>
          </div>
        </nav>

        <div className="border-top pt-3 flex-shrink-0">
          <div className="mb-2">
            {renderNavLink("/configuracion", "Configuración", "bi-gear")}
          </div>
          <button
            onClick={handleLogout}
            className={`w-100 d-flex align-items-center ${
              !isExpanded ? "justify-content-center px-0" : "gap-3 px-3"
            } py-2 text-danger small bg-transparent border-0 text-start rounded hover-light fw-medium`}
            style={{ fontSize: "13px" }}
            title={!isExpanded ? "Cerrar sesión" : undefined}
          >
            <i className="bi bi-box-arrow-left" style={{ fontSize: "14px" }}></i>
            {isExpanded && <span>Cerrar sesión</span>}
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
