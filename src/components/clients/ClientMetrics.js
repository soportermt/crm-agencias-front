"use client";

import React from "react";
import StatCard from "@/components/common/StatCard";

export default function ClientMetrics() {
  return (
    <div className="row g-3 mb-4">
      <div className="col-12 col-sm-6 col-xl-3">
        <StatCard
          title="Total clientes"
          value="47"
          subtext="+5 este mes"
          valueColor="#0c5cc6"
        />
      </div>
      <div className="col-12 col-sm-6 col-xl-3">
        <StatCard
          title="Con saldo pendiente"
          value="12"
          subtext="$48,200 total"
          valueColor="#f59e0b"
        />
      </div>
      <div className="col-12 col-sm-6 col-xl-3">
        <StatCard
          title="Próximas salidas"
          value="$12,800"
          linkText="Ver detalles"
          valueColor="#dc2626"
        />
      </div>
      <div className="col-12 col-sm-6 col-xl-3">
        <StatCard
          title="Clientes recurrentes"
          value="19"
          subtext="2+ viajes realizados"
          valueColor="#16a34a"
        />
      </div>
    </div>
  );
}
