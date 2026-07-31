"use client";

import React from "react";
import StatCard from "@/components/common/StatCard";

const SKELETON_KEYS = ["total", "vigentes", "pagadas", "pasajeros"];

export default function BookingMetrics({ metrics, loading = false }) {
  if (loading || !metrics) {
    return (
      <div className="row g-3 mb-4">
        {SKELETON_KEYS.map((key) => (
          <div className="col-12 col-sm-6 col-xl-3" key={key}>
            <div
              className="p-3"
              style={{
                borderRadius: "12px",
                backgroundColor: "#f2f2f2",
                minHeight: "96px",
              }}
            >
              <div
                className="placeholder-glow"
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <span className="placeholder col-6" style={{ height: "14px", borderRadius: "4px" }} />
                <span className="placeholder col-4" style={{ height: "24px", borderRadius: "4px" }} />
                <span className="placeholder col-8" style={{ height: "12px", borderRadius: "4px" }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="row g-3 mb-4">
      <div className="col-12 col-sm-6 col-xl-3">
        <StatCard
          title="Total reservas"
          value={metrics.total_reservas}
          subtext="+8 este mes"
          valueColor="#0c5cc6"
        />
      </div>
      <div className="col-12 col-sm-6 col-xl-3">
        <StatCard
          title="Reservas vigentes"
          value={metrics.reservas_vigentes}
          subtext="Requieren atención"
          valueColor="#f59e0b"
        />
      </div>
      <div className="col-12 col-sm-6 col-xl-3">
        <StatCard
          title="Reservas pagadas"
          value={metrics.reservas_pagadas}
          subtext=""
          valueColor="#0E803C"
        />
      </div>
      <div className="col-12 col-sm-6 col-xl-3">
        <StatCard
          title="Pasajeros totales"
          value={metrics.pasajeros_totales}
          subtext="Adultos + menores"
          valueColor="#0F1901"
        />
      </div>
    </div>
  );
}