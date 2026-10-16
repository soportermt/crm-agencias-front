"use client";

import { grupoService } from "@/services/grupo.service";
import { calcularTotalesHabitaciones } from "@/utils/calcularHab";
import React, { useEffect, useState } from "react";

const money = (n) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(Number(n) || 0);

const formatDate = (s) => {
  if (!s) return "—";
  const [y, m, d] = String(s).slice(0, 10).split("-");
  return y && m && d ? `${d}/${m}/${y}` : "—";
};

const val = (v) => (v === null || v === undefined || v === "" ? "—" : v);

function InfoCard({ title, icon, children }) {
  return (
    <div className="h-100 border rounded-3 bg-white overflow-hidden" style={{ borderColor: "#e9ecef" }}>
      <div
        className="px-3 py-2 d-flex align-items-center gap-2 border-bottom font-inter fw-semibold"
        style={{ background: "#e7f1fe", color: "#0c5cc6", fontSize: 14 }}
      >
        {title}
      </div>
      <dl className="mb-0">{children}</dl>
    </div>
  );
}

function Field({ label, children, multiline = false }) {
  return (
    <div
      className={`d-flex gap-3 px-3 py-2 border-bottom ${multiline ? "flex-column" : "justify-content-between align-items-start"}`}
      style={{ fontSize: 14 }}
    >
      <dt className="text-secondary font-poppins mb-0" style={{ fontWeight: 400 }}>
        {label}
      </dt>
      <dd
        className={`mb-0 font-inter fw-medium ${multiline ? "" : "text-end"}`}
        style={{ color: "#0f1901", whiteSpace: multiline ? "pre-wrap" : "normal" }}
      >
        {children}
      </dd>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="col-6 col-lg-3">
      <div className="border rounded-3 p-3 h-100" style={{ borderColor: "#e9ecef", background: "#fff" }}>
        <div className="text-secondary small font-poppins">{label}</div>
        <div className="font-inter fw-semibold" style={{ fontSize: 20, color: "#0f1901" }}>
          {value}
        </div>
      </div>
    </div>
  );
}

export default function General({ id_grupo }) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadData(id) {
    setIsLoading(true);
    setError(null);
    try {
      setData(await grupoService.getGroupInfo(id));
    } catch (err) {
      console.error("Error al cargar el grupo:", err);
      setError("No se pudo cargar la información del grupo");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!id_grupo) return;
    loadData(id_grupo);
  }, [id_grupo]);

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="text-muted mt-2 font-poppins small">Cargando...</p>
      </div>
    );
  }

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!data) return <div className="alert alert-warning">No se encontró el grupo</div>;

  const vs = data.idVentaservicio ?? {};
  const venta = vs.idVenta ?? {};

  const totalHabs = calcularTotalesHabitaciones(data.grupoHabitaciones);

  return (
    <div>
      <div className="row g-3 mb-3">
        <Stat label="Folio" value={val(venta.folio)} />
        <Stat label="Costo" value={money(vs.costo)} /> 
        <Stat label="Tarifa pública" value={money(vs.tarifa_publica)} />
        <Stat label="Habitaciones" value={val(data.num_habitaciones)} />
      </div>

      <div className="row g-3">
        <div className="col-12 col-lg-6">
          <InfoCard title="INFORMACIÓN DE LA VENTA">
            <Field label="Fecha de venta">{formatDate(venta.fecha)}</Field>
            <Field label="Titular">{val(venta.pasajero_titular)}</Field>
            <Field label="Cliente">{val(data.idCliente?.nombre)}</Field>
            <Field label="Proveedor">{val(vs.idProveedor?.nombre_comercial)}</Field> 
            <Field label="Estancia">
              {vs.inicio_servicio ? `${formatDate(vs.inicio_servicio)} – ${formatDate(vs.fin_servicio)}` : "—"} 
            </Field>
            <Field label="Costo">{money(vs.costo)}</Field>
            <Field label="Tarifa pública">{money(vs.tarifa_publica)}</Field>
            <Field label="Fee">{money(vs.fee)}</Field> 
            <Field label="Observaciones" multiline>
              {val(venta.observaciones)} 
            </Field>
          </InfoCard>
        </div>

        <div className="col-12 col-lg-6">
          <InfoCard title="INFORMACIÓN DEL GRUPO">
            <Field label="Evento">{val(data.titulo_evento)}</Field>
            <Field label="Hotel">{val(data.hotel)}</Field>
            <Field label="Tipo de habitación">{val(data.tipo_habitacion)}</Field>
            <Field label="No. de habitaciones">{val(data.num_habitaciones)}</Field>
            <Field label="Noches">{val(data.noches)}</Field>
            <Field label="Estatus">
              <span
                className={`badge ${data.estatus === "Activo" ? "bg-success-subtle text-success" : "bg-secondary-subtle text-secondary"}`}
              >
                {val(data.estatus)}
              </span>
            </Field>
            <Field label="Neto acumulado">{money(totalHabs.neto)}</Field> 
            <Field label="Total acumulado">{money(totalHabs.publico)}</Field>
            <Field label="Condiciones" multiline>
              {val(data.condiciones)}
            </Field>
          </InfoCard>
        </div>
      </div>
    </div>
  );
}