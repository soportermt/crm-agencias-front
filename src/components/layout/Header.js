"use client";

import React from "react";
import Image from "next/image";

export default function Header({ onToggleMobileSidebar }) {
  return (
    <header
      className="bg-white border-bottom px-4 py-3 d-flex align-items-center justify-content-between position-sticky top-0 shadow-premium"
      style={{ zIndex: 100, height: "76px" }}
    >
      <div className="d-flex align-items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="btn btn-outline-secondary d-lg-none"
          aria-label="Toggle menú"
        >
          <i className="bi bi-list"></i>
        </button>

        <div className="py-1">
          <Image
            src="/2bt2025.png"
            alt="2Business Travel Logo"
            width={115}
            height={23}
            priority
            style={{ height: "auto", maxWidth: "115px" }}
          />
        </div>
      </div>

      <div className="d-flex align-items-center gap-3">
        <div className="position-relative d-none d-md-block" style={{ width: "250px" }}>
          <input
            type="text"
            placeholder="Buscar..."
            className="form-control rounded-3 pe-5 ps-3 py-2 border-0 bg-light text-secondary"
            style={{ fontSize: "14px" }}
          />
          <i
            className="bi bi-search position-absolute end-0 top-50 translate-middle-y me-3 text-secondary"
            style={{ opacity: 0.5, fontSize: "14px" }}
          ></i>
        </div>

        <button className="btn btn-light rounded-circle p-2 border-0 d-flex align-items-center justify-content-center text-secondary transition-smooth">
          <i className="bi bi-sun-fill" style={{ fontSize: "1rem" }}></i>
        </button>

        <div className="d-flex align-items-center gap-2 border-start ps-3">
          <div className="text-end d-none d-sm-block">
            <p className="mb-0 fw-semibold text-dark small">Vanessa Fuentes</p>
            <p className="mb-0 text-muted" style={{ fontSize: "10px" }}>Administrador</p>
          </div>
          <div
            className="rounded-circle bg-primary-subtle d-flex align-items-center justify-content-center fw-bold text-primary font-poppins"
            style={{ width: "32px", height: "32px", fontSize: "13px" }}
          >
            VF
          </div>
        </div>
      </div>
    </header>
  );
}
