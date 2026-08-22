"use client";

import React, { useEffect, useState } from "react";
import StatCard from "@/components/common/StatCard";
import DataTable from "@/components/common/DataTable";
import ExportButton from "@/components/common/ExportButton";
import { reservationsMock, dailySalesMock, pendingTasksMock } from "@/mocks/dashboardMock";
import { usuariosService } from "@/services/usuarios.service";
import { dashboardService } from "@/services/dashboard.service";

const SKELETON_KEYS = ["cobrar", "pagar", "generado", "clientes"];

export default function DashboardPage() {
  const reservations = reservationsMock;
  const dailySales = dailySalesMock;
  const pendingTasks = pendingTasksMock;
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);
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

    fetchData();
    fetchUser();
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
        <div className="col-12 col-md-7">
          <div className="bg-white p-4 border shadow-premium h-100" style={{ borderRadius: "12px" }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="fw-normal font-inter mb-0" style={{ fontSize: "16px", color: "#0f1901" }}>
                Ventas del día
              </h2>
              <a
                href="#"
                className="text-decoration-none fw-medium d-flex align-items-center gap-1 transition-smooth hover-underline"
                style={{ color: "#0c5cc6", fontSize: "14px" }}
                onClick={(e) => e.preventDefault()}
              >
                <span>Ir a la sección</span>
                <i className="bi bi-arrow-up-right"></i>
              </a>
            </div>

            <div className="d-flex flex-column" style={{ gap: "6px" }}>
              {dailySales.map((sale, index) => (
                <div
                  key={index}
                  className="transition-smooth"
                  style={{ backgroundColor: "rgba(71, 71, 71, 0.05)", padding: "10px 16px", borderRadius: "12px" }}
                >
                  <div className="d-flex justify-content-between align-items-start">
                    <div style={{ fontFamily: "var(--font-inter)" }}>
                      <h4 className="fw-semibold mb-0.5" style={{ fontSize: "13px", color: "#1e293b" }}>
                        {sale.hotel}
                      </h4>
                      <p className="mb-1 fw-medium" style={{ fontSize: "12px", color: "#1e293b" }}>
                        {sale.detail}
                      </p>
                      <p className="mb-0 font-inter" style={{ fontSize: "12px", color: "rgba(64, 64, 64, 0.8)" }}>
                        Fecha del servicio: <span className="fw-semibold">{sale.dates}</span>
                      </p>
                    </div>
                    <span
                      className="font-inter fw-semibold"
                      style={{ fontSize: "12px", color: "#227cf2" }}
                    >
                      {sale.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-12 col-md-5">
          <div className="bg-white p-4 border shadow-premium h-100 d-flex flex-column" style={{ borderRadius: "12px" }}>
            <div className="d-flex justify-content-between align-items-center mb-3 flex-shrink-0">
              <h2 className="font-inter mb-0" style={{ fontSize: "16px", color: "#0f1901" }}>
                <span className="fw-semibold">Pendientes</span>
                <span className="fw-normal"> del día</span>
              </h2>
              <a
                href="#"
                className="text-decoration-none fw-medium transition-smooth hover-underline"
                style={{ color: "#0c5cc6", fontSize: "14px" }}
                onClick={(e) => e.preventDefault()}
              >
                Ver más
              </a>
            </div>

            <div className="d-flex flex-column justify-content-between flex-grow-1">
              {pendingTasks.map((task, index) => (
                <div key={index} className="d-flex align-items-center" style={{ gap: "8px", padding: "4px 8px" }}>
                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{
                      width: "36px",
                      height: "36px",
                      minWidth: "36px",
                      backgroundColor: "#f4faeb",
                      color: "#000000",
                      borderRadius: "8px",
                      fontSize: "16px",
                    }}
                  >
                    <i className="bi bi-exclamation-triangle"></i>
                  </div>
                  <div className="flex-grow-1" style={{ fontFamily: "var(--font-inter)" }}>
                    <h4 className="fw-normal text-dark mb-0" style={{ fontSize: "14px", lineHeight: "1.2" }}>
                      Atraso de pago #{task.id}
                    </h4>
                    <p className="mb-0" style={{ fontSize: "12px", color: "rgba(0, 0, 0, 0.4)", lineHeight: "1.2" }}>
                      {task.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 border shadow-premium" style={{ borderRadius: "12px" }}>
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
          <div>
            <h2 className="font-inter mb-0 text-dark" style={{ fontSize: "16px" }}>
              <span className="fw-semibold" style={{ color: "#0f1901" }}>Próximas </span>
              <span className="fw-normal" style={{ color: "#0f1901" }}>reservas del mes</span>
            </h2>
          </div>

          <div className="d-flex align-items-center gap-2">
            <ExportButton onExport={() => console.log("Exportando reservas del dashboard...")} />

            <a
              href="#"
              className="text-decoration-none fw-medium d-flex align-items-center gap-1 px-3 py-2 transition-smooth hover-underline"
              style={{ color: "#0c5cc6", fontSize: "14px" }}
              onClick={(e) => e.preventDefault()}
            >
              <span>Ir a la sección</span>
              <i className="bi bi-arrow-up-right"></i>
            </a>
          </div>
        </div>

        <DataTable
          columns={[
            { key: "id", label: "ID", sortable: true },
            { key: "folio", label: "Folio", sortable: true },
            { key: "cliente", label: "Cliente", sortable: true },
            { key: "hotel", label: "Hotel", sortable: true },
            { key: "habitacion", label: "Tipo de habitación", sortable: true },
            { key: "fecha", label: "Fecha de venta", sortable: true },
            { key: "destino", label: "Destino", sortable: true },
            { key: "descripcion", label: "Descripción", sortable: true },
            { key: "total", label: "Total", sortable: true },
            { key: "moneda", label: "Moneda", sortable: true },
          ]}
          data={reservations}
          pagination={true}
          currentPage={1}
          totalPages={2}
          totalItems={reservations.length}
          emptyMessage="No hay próximas reservas."
        />
      </div>
    </div>
  );
}
