"use client";

import React, { useEffect, useState } from "react";
import StatCard from "@/components/common/StatCard";
import { usuariosService } from "@/services/usuarios.service";
import { dashboardService } from "@/services/dashboard.service";
import InfoTableVendedor from "@/components/vendedores/InfoTableVendedor";
import { vendedoresService } from "@/services/vendedores.service";
import Link from "next/link";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const SKELETON_KEYS = ["cobrar", "pagar", "generado", "clientes"];
function parseDesglose(desgloseStr) {
  try {
    return typeof desgloseStr === "string" ? JSON.parse(desgloseStr) : desgloseStr;
  } catch {
    return {};
  }
}

function formatDate(dateStr) {
  if (!dateStr || dateStr === "0000-00-00") return "-";
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
  });
}

function getServiceDetail(sale) {
  const d = parseDesglose(sale.desglose);

  switch (Number(sale.id_tipo_servicio)) {
    case 2: // traslado
      return `${d.origen || "-"} → ${d.destino || "-"}${d.redondo ? " (redondo)" : ""}`;
    case 1: // hospedaje
      const noHab = d.habitaciones?.length || d.no_hab || 0;
      return `${noHab} habitación${noHab === 1 ? "" : "es"} · ${d.ocupacion || ""}`;
    default: // tours, actividades, etc.
      return d.ocupacion || sale.descripcion;
  }
}

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);
  const [sales, setSales] = useState([]);
  const [salesDay, setSalesDay] = useState([]);
  const [vendedores, setVendedores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await dashboardService.getSalesStats();
        setData(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

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

    async function loadVentas() {
      try {
        const data = await dashboardService.getMonthSales();
        setSales(data);
      } catch (error) {
        console.error("Error fetching ventas:", error);
      }
    }

    async function loadVendedores() {
      try {
        const vendedores = await vendedoresService.get();
        setVendedores(vendedores);
      } catch (err) {
        console.error(err);
      }
    }

    async function loadVentasDia() {
      try {
        const data = await dashboardService.getDaySales();
        setSalesDay(data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchData();
    fetchUser();
    loadVentas();
    loadVendedores();
    loadVentasDia();
  }, []);


  const rawDate = new Intl.DateTimeFormat("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  const fecha = rawDate.charAt(0).toUpperCase() + rawDate.slice(1);

  const userName = user?.idUsuario?.profiles?.fullname || user?.nombre || "Usuario";

  const formatCurrency = (value) => {
    if (value == null || isNaN(value)) return "$0.00";
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(value);
  };

  const chartData = React.useMemo(() => {
    if (!sales.length) return [];
    const totals = {};
    sales.forEach((venta) => {
      const fecha = venta.fecha?.split(" ")[0];
      if (!fecha) return;
      const monto = (venta.ventasServicioses || []).reduce(
        (sum, s) => sum + (Number(s.tarifa_publica) || 0),
        0
      );
      totals[fecha] = (totals[fecha] || 0) + monto;
    });
    return Object.keys(totals)
      .sort()
      .map((fecha) => ({ fecha: formatDate(fecha), total: totals[fecha] }));
  }, [sales]);

  return (
    <div className="container-fluid p-0">
      <div className="mb-4">
        <p className="text-secondary small mb-1" style={{ fontFamily: "var(--font-inter)" }}>{fecha}</p>
        <h1 className="h4 fw-semibold font-poppins text-dark m-0">Bienvenido de vuelta, {userName}</h1>
      </div>

      {loading || !data ? (
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
      ) : (
        <div className="row g-3 mb-4">
          <div className="col-12 col-sm-6 col-md-3">
            <StatCard
              title="Total a Cobrar"
              value={formatCurrency(data?.total_a_cobrar)}
              trend="up"
              hasShadow={true}
            />
          </div>
          <div className="col-12 col-sm-6 col-md-3">
            <StatCard
              title="Total a Pagar"
              value={formatCurrency(data?.total_a_pagar)}
              trend="down"
              hasShadow={true}
            />
          </div>
          <div className="col-12 col-sm-6 col-md-3">
            <StatCard
              title="Total Generado en Ventas"
              value={formatCurrency(data?.total_generado)}
              trend="up"
              hasShadow={true}
            />
          </div>
          <div className="col-12 col-sm-6 col-md-3">
            <StatCard
              title="Clientes Registrados"
              value={data?.clientes_registrados?.toLocaleString("es-MX") || "0"}
              trend="user"
              hasShadow={true}
            />
          </div>
        </div>
      )}

      <div className="row g-3 mb-4">
        <div className="col-12 col-md-6">
          <div className="bg-white p-3 border shadow-premium h-100" style={{ borderRadius: "12px" }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <p className="mb-0" style={{ fontWeight: 500 }}>
                Ventas del día
              </p>
              <Link
                href="/reservaciones"
                target="_blank"
                className="text-decoration-none fw-medium d-flex align-items-center gap-1 transition-smooth hover-underline"
                style={{ color: "#0c5cc6", fontSize: "14px" }}
              >
                <span>Ir a la sección</span>
                <i className="bi bi-arrow-up-right"></i>
              </Link>
            </div>

            <div
              className="d-flex flex-column pe-1"
              style={{
                gap: "6px",
                maxHeight: "150px",
                overflowY: "auto",
              }}
            >
              {loading ? (
                [1, 2, 3].map((_, idx) => (
                  <div
                    key={idx}
                    className="placeholder-glow"
                    style={{
                      backgroundColor: "rgb(231, 241, 254, 0.6)",
                      padding: "10px 16px",
                      borderRadius: "12px",
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-start">
                      <div style={{ width: "70%" }}>
                        <span
                          className="placeholder col-8 mb-1"
                          style={{ height: "13px", borderRadius: "4px", display: "block" }}
                        />
                        <span
                          className="placeholder col-6 mb-1"
                          style={{ height: "12px", borderRadius: "4px", display: "block" }}
                        />
                        <span
                          className="placeholder col-10"
                          style={{ height: "11px", borderRadius: "4px", display: "block" }}
                        />
                      </div>
                      <span
                        className="placeholder col-3"
                        style={{ height: "14px", borderRadius: "4px" }}
                      />
                    </div>
                  </div>
                ))
              ) : salesDay.length === 0 ? (
                <div
                  className="d-flex flex-column align-items-center justify-content-center text-center"
                  style={{ padding: "32px 16px", gap: "8px" }}
                >
                  <i
                    className="bi bi-calendar-x"
                    style={{ fontSize: "24px", color: "rgba(64, 64, 64, 0.35)" }}
                  ></i>
                  <p
                    className="mb-0 font-inter fw-medium"
                    style={{ fontSize: "13px", color: "#1e293b" }}
                  >
                    Sin ventas registradas hoy
                  </p>
                  <p
                    className="mb-0 font-inter"
                    style={{ fontSize: "12px", color: "rgba(64, 64, 64, 0.6)" }}
                  >
                    Aquí aparecerán los servicios en cuanto se generen ventas del día
                  </p>
                </div>
              ) : (
                salesDay.map((sale, index) => (
                  <div
                    key={index}
                    className="transition-smooth"
                    style={{
                      backgroundColor: "rgba(231, 241, 254, 0.6)",
                      padding: "10px 16px",
                      borderRadius: "12px",
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-start">
                      <div style={{ fontFamily: "var(--font-inter)" }}>
                        <h4
                          className="fw-semibold mb-0.5"
                          style={{ fontSize: "13px", color: "rgb(12, 92, 198)" }}
                        >
                          {sale.descripcion || sale.folio}
                        </h4>
                        <p
                          className="mb-1 fw-medium"
                          style={{ fontSize: "12px", color: "#1e293b" }}
                        >
                          {getServiceDetail(sale)}
                        </p>
                        <p
                          className="mb-0 font-inter"
                          style={{ fontSize: "12px", color: "rgba(64, 64, 64, 0.8)" }}
                        >
                          Fecha del servicio:{" "}
                          <span className="fw-semibold">
                            {sale.fin_servicio &&
                              sale.fin_servicio !== sale.inicio_servicio &&
                              sale.fin_servicio !== "0000-00-00" &&
                              sale.fin_servicio !== "0000-00-00 00:00:00"
                              ? `${formatDate(sale.inicio_servicio)} a ${formatDate(sale.fin_servicio)}`
                              : formatDate(sale.inicio_servicio)}
                          </span>
                        </p>
                      </div>
                      <span
                        className="font-inter fw-semibold"
                        style={{ fontSize: "12px", color: "#227cf2" }}
                      >
                        {sale.tipo_servicio}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div
            className="bg-white p-3 border shadow-premium h-100 d-flex flex-column"
            style={{ borderRadius: "12px" }}
          >
            <p className="mb-3" style={{ fontWeight: 500 }}>Ventas del mes</p>

            <div className="d-flex align-items-center justify-content-center">
              {loading ? (
                <div className="placeholder-glow w-100 h-100">
                  <span className="placeholder w-100 h-100" style={{ borderRadius: "8px" }} />
                </div>
              ) : chartData.length === 0 ? (
                <div className="text-secondary small">Sin ventas registradas este mes</div>
              ) : (
                <ResponsiveContainer width="100%" height={150}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="fecha" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Line type="monotone" dataKey="total" stroke="#0c5cc6" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-2 border shadow-premium" style={{ borderRadius: "12px" }}>
        <InfoTableVendedor data={sales} dashboard vendedores={vendedores} />
      </div>
    </div>
  );
}
