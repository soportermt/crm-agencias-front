"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import StatusBadge from "@/components/common/StatusBadge";
import StatCard from "@/components/common/StatCard";

export default function ClientProfileHeader({ client }) {
  if (!client) return null;
  
  return (
    <div className="mb-4">
      <div className="d-flex align-items-start justify-content-between mb-4">
        <div className="d-flex align-items-center gap-3">
          {(() => {
            const name = client.nombreCompleto || client.name || "Cliente";
            const initials = name.split(" ").filter(p => p.trim()).length >= 2 
                ? (name.split(" ").filter(p => p.trim())[0][0] + name.split(" ").filter(p => p.trim())[1][0]).toUpperCase()
                : name.substring(0, 2).toUpperCase();
            return (
              <div
                className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 fw-bold animate-fade-in"
                style={{
                  width: "64px",
                  height: "64px",
                  backgroundColor: "#e7f1fe",
                  color: "#0c5cc6",
                  fontSize: "24px",
                }}
              >
                {initials}
              </div>
            );
          })()}

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

        <div className="d-flex align-items-center gap-2">
          <Link
            href={`/mensajeria?clientId=${client.id || client.id_cliente}`}
            className="btn btn-bg-style d-flex align-items-center gap-2 fw-medium"
            style={{ fontSize: "13px", padding: "8px 14px", borderRadius: "10px" }}
          >
            <i className="bi bi-whatsapp" style={{ fontSize: "14px", color: "#25D366" }}></i>
            Abrir chat
          </Link>
          <button
            className="btn d-flex align-items-center gap-2 transition-smooth fw-medium p-0 ms-2"
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

