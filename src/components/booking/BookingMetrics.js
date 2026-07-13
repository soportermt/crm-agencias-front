"use client";

import React from "react";
import StatCard from "@/components/common/StatCard";

export default function BookingMetrics() {
  return (
    <div className="row g-3 mb-4">
      <div className="col-12 col-sm-6 col-xl-3">
        <StatCard
          title="Total reservas"
          value="47"
          subtext="+8 este mes"
          valueColor="#0c5cc6"
        />
      </div>
      <div className="col-12 col-sm-6 col-xl-3">
        <StatCard
          title="Reservas vigentes"
          value="18"
          subtext="Requieren atención"
          valueColor="#f59e0b"
        />
      </div>
      <div className="col-12 col-sm-6 col-xl-3">
        <StatCard
          title="Reservas pagadas"
          value="22"
          subtext=""
          valueColor="#0E803C"
        />
      </div>
      <div className="col-12 col-sm-6 col-xl-3">
        <StatCard
          title="Pasajeros totales"
          value="134"
          subtext="Adultos + menores"
          valueColor="#0F1901"
        />
      </div>
    </div>
  );
}
