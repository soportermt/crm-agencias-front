"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { usuariosService } from "@/services/usuarios.service";

export default function Header({ onToggleMobileSidebar }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await usuariosService.getCurrentUser();
        if (Array.isArray(data) && data.length > 0) {
          setUser(data[0]);
        } else if (data && !Array.isArray(data)) {
          setUser(data);
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };
    fetchUser();
  }, []);

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  };

  const userName = user?.idUsuario?.profiles?.fullname || user?.nombre || "Usuario";
  const userRole = user?.rol || "Rol no asignado";
  const initials = getInitials(userName);
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
            <p className="mb-0 fw-semibold text-dark small">{userName}</p>
            <p className="mb-0 text-muted" style={{ fontSize: "10px" }}>{userRole}</p>
          </div>
          <div
            className="rounded-circle bg-primary-subtle d-flex align-items-center justify-content-center fw-bold text-primary font-poppins position-relative overflow-hidden flex-shrink-0"
            style={{ width: "32px", height: "32px", fontSize: "13px" }}
          >
            {user?.foto ? (
              <img 
                src={`${process.env.NEXT_PUBLIC_API_URL || ''}/images/usuarios/${user.foto}`} 
                alt={userName} 
                className="w-100 h-100 object-fit-cover position-absolute top-0 start-0" 
                style={{ zIndex: 2 }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = "none";
                }}
              />
            ) : null}
            <span className="position-relative d-flex align-items-center justify-content-center w-100 h-100" style={{ zIndex: 1 }}>
              {initials}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
