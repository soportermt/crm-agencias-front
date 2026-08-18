"use client";

import React from "react";
import Image from "next/image";
import StatusBadge from "@/components/common/StatusBadge";
import StatCard from "@/components/common/StatCard";

export default function ClientProfileHeader({ client }) {
  if (!client) return null;
  
  return (
    <div className="mb-4">
      <div className="d-flex align-items-start justify-content-between mb-4">
        <div className="d-flex align-items-center gap-3">
          <div
            className="rounded-circle overflow-hidden position-relative d-flex align-items-center justify-content-center"
            style={{ width: "64px", height: "64px", flexShrink: 0, backgroundColor: "#f3f4f6" }}
          >
            {client.foto || client.avatar ? (
              <img
                src={client.foto || client.avatar || "/avatar-placeholder.jpg"}
                alt="Avatar de cliente"
                className="w-100 h-100 object-fit-cover position-absolute top-0 start-0"
                style={{ zIndex: 2 }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = "none";
                }}
              />
            ) : null}
            <div className="w-100 h-100 d-flex align-items-center justify-content-center">
              <i className="bi bi-person-fill text-secondary" style={{ fontSize: "36px" }}></i>
            </div>
          </div>

          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <h1 className="h4 font-poppins fw-bold mb-0" style={{ color: "var(--dark-green)" }}>
                {client.nombreCompleto || client.name}
              </h1>
              <StatusBadge status={client.status || "Nuevo"} />
            </div>

            <div className="d-flex flex-wrap align-items-center gap-3 font-inter small" style={{ color: "var(--grey-text)" }}>
              {client.celular && (
                <div className="d-flex align-items-center gap-1">
                  <i className="bi bi-telephone"></i>
                  <span>{client.celular}</span>
                </div>
              )}
              {client.correo && (
                <div className="d-flex align-items-center gap-1">
                  <i className="bi bi-envelope"></i>
                  <span>{client.correo}</span>
                </div>
              )}
              {(client.ciudad || client.estado) && (
                <div className="d-flex align-items-center gap-1">
                  <i className="bi bi-geo-alt"></i>
                  <span>{[client.ciudad || client.city, client.estado || client.state].filter(Boolean).join(", ")}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          className="btn d-flex align-items-center gap-2 transition-smooth fw-medium p-0"
          style={{
            backgroundColor: "transparent",
            border: "none",
            color: "#0c5cc6",
            fontSize: "13px",
          }}
        >
          <i className="bi bi-pencil" style={{ fontSize: "14px" }}></i>
          Editar datos
        </button>
      </div>

      <div className="row g-3">
        <div className="col-12 col-sm-6 col-md-3">
          <StatCard
            title="Reservas totales"
            value={String(client.reservasTotales || 0)}
            valueColor="#0c5cc6"
            size="sm"
            titleColor="var(--dark-green)"
          />
        </div>
        
        <div className="col-12 col-sm-6 col-md-3">
          <StatCard
            title="Total comprado"
            value={client.totalComprado || "$0"}
            valueColor="#16a34a"
            size="sm"
            titleColor="var(--dark-green)"
          />
        </div>
        
        <div className="col-12 col-sm-6 col-md-3">
          <StatCard
            title="Último viaje"
            value={client.ultimoViaje || "Sin viajes"}
            valueColor="#dc2626"
            size="sm"
            titleColor="var(--dark-green)"
          />
        </div>
        
        <div className="col-12 col-sm-6 col-md-3">
          <StatCard
            title="Saldo pendiente"
            value={client.saldoPendiente || "$0"}
            valueColor="#d97706"
            size="sm"
            titleColor="var(--dark-green)"
          />
        </div>
      </div>
    </div>
  );
}

