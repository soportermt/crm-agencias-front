"use client";

import React, { useState, useEffect } from "react";
import StatCard from "@/components/common/StatCard";
import { clientsService } from "@/services/clients.service";

const SKELETON_KEYS = ["total", "pendientes", "salidas", "recurrentes"];

export default function ClientMetrics() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalClientes: 0,
    clientesNuevosMes: 0,
    conSaldoPendiente: 0,
    saldoPendienteTotal: "$0",
    proximasSalidas: "$0",
    clientesRecurrentes: 0,
  });

  useEffect(() => {
    async function fetchMetrics() {
      try {
        setLoading(true);
        const data = await clientsService.getMetrics();
        setMetrics(data);
      } catch (err) {
        console.error("Error al cargar métricas:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="row g-3 mb-4">
        {SKELETON_KEYS.map((key) => (
          <div className="col-12 col-sm-6 col-xl-3" key={key}>
            <div
              className="p-3"
              style={{
                borderRadius: "12px",
                backgroundColor: "#f2f2f2",
                minHeight: "76px",
              }}
            >
              <div
                className="placeholder-glow"
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <span className="placeholder col-6" style={{ height: "14px", borderRadius: "4px" }} />
                <span className="placeholder col-4" style={{ height: "24px", borderRadius: "4px" }} />
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
          title="Total clientes"
          value={String(metrics.totalClientes)}
          subtext={`+${metrics.clientesNuevosMes} este mes`}
          valueColor="#0c5cc6"
        />
      </div>
      <div className="col-12 col-sm-6 col-xl-3">
        <StatCard
          title="Con saldo pendiente"
          value={String(metrics.conSaldoPendiente)}
          subtext={`${metrics.saldoPendienteTotal} total`}
          valueColor="#f59e0b"
        />
      </div>
      <div className="col-12 col-sm-6 col-xl-3">
        <StatCard
          title="Próximas salidas"
          value={metrics.proximasSalidas}
          linkText="Ver detalles"
          valueColor="#dc2626"
        />
      </div>
      <div className="col-12 col-sm-6 col-xl-3">
        <StatCard
          title="Clientes recurrentes"
          value={String(metrics.clientesRecurrentes)}
          subtext="2+ viajes realizados"
          valueColor="#16a34a"
        />
      </div>
    </div>
  );
}
