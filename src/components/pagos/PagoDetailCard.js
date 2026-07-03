"use client";

import React from "react";
import { PlusIcon } from "@heroicons/react/24/outline";

export default function PagoDetailCard({ pago, onAddPayment }) {
  return (
    <div
      className="bg-white shadow-premium d-flex flex-column flex-lg-row gap-4 align-items-stretch align-items-lg-center p-4"
      style={{ borderRadius: "12px" }}
    >
      <div className="d-flex flex-column gap-3" style={{ flex: "1 1 0%", minWidth: "0" }}>
        <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
          <div className="d-flex flex-column gap-1">
            <h2
              className="font-inter fw-bold mb-0 text-nowrap"
              style={{ fontSize: "20px", color: "#1e293b", letterSpacing: "-0.14px" }}
            >
              {pago.cliente}
            </h2>
            <span
              className="font-inter text-nowrap"
              style={{ fontSize: "14px", color: "#404040" }}
            >
              {pago.descripcion}
            </span>
          </div>
          <span
            className="d-inline-flex align-items-center px-4 py-2 rounded-pill font-inter fw-semibold text-nowrap"
            style={{
              backgroundColor: "#e7f1fe",
              color: "#0c5cc6",
              fontSize: "14px",
            }}
          >
            No. {pago.numeroReserva}
          </span>
        </div>

        <div className="d-flex flex-column gap-1">
          <span
            className="font-inter mb-1 text-nowrap"
            style={{ fontSize: "14px", color: "black" }}
          >
            Datos de la reserva
          </span>
          <div className="d-flex gap-5 flex-wrap">
            <div className="font-inter" style={{ fontSize: "12px", minWidth: "220px", flex: 1 }}>
              <div className="d-flex mb-1" style={{ gap: "16px" }}>
                <span className="text-nowrap" style={{ color: "rgba(64,64,64,0.5)", width: "130px" }}>Destino</span>
                <span className="text-nowrap" style={{ color: "#0f1901" }}>{pago.destino}</span>
              </div>
              <div className="d-flex mb-1" style={{ gap: "16px" }}>
                <span className="text-nowrap" style={{ color: "rgba(64,64,64,0.5)", width: "130px" }}>Hotel</span>
                <span className="text-nowrap" style={{ color: "#0f1901" }}>{pago.hotel}</span>
              </div>
              <div className="d-flex" style={{ gap: "16px" }}>
                <span className="text-nowrap" style={{ color: "rgba(64,64,64,0.5)", width: "130px" }}>Venta hecha por</span>
                <span className="text-nowrap" style={{ color: "#0f1901" }}>{pago.ventaHechaPor}</span>
              </div>
            </div>
            <div className="font-inter" style={{ fontSize: "12px", minWidth: "220px", flex: 1 }}>
              <div className="d-flex mb-1" style={{ gap: "16px" }}>
                <span className="text-nowrap" style={{ color: "rgba(64,64,64,0.5)", width: "140px" }}>Fecha de entrada</span>
                <span className="text-nowrap" style={{ color: "#0f1901" }}>{pago.fechaEntrada}</span>
              </div>
              <div className="d-flex mb-1" style={{ gap: "16px" }}>
                <span className="text-nowrap" style={{ color: "rgba(64,64,64,0.5)", width: "140px" }}>Fecha de salida</span>
                <span className="text-nowrap" style={{ color: "#0f1901" }}>{pago.fechaSalida}</span>
              </div>
              <div className="d-flex" style={{ gap: "16px" }}>
                <span className="text-nowrap" style={{ color: "rgba(64,64,64,0.5)", width: "140px" }}>Estado</span>
                <span className="fw-semibold text-nowrap" style={{ color: "#09489a" }}>{pago.estado}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="d-none d-lg-block"
        style={{
          width: "1px",
          height: "160px",
          backgroundColor: "rgba(0,0,0,0.1)",
          alignSelf: "center",
        }}
      ></div>
      <hr className="d-block d-lg-none w-100 my-2" />

      <div
        className="d-flex flex-column gap-3 align-items-start justify-content-center"
        style={{ flex: "0 0 326px" }}
      >
        <span
          className="font-inter fw-medium"
          style={{ fontSize: "18px", color: "#1e293b" }}
        >
          Registrar pago/abono
        </span>
        <div className="d-flex flex-column align-items-center gap-1 w-100">
          <span
            className="font-inter fw-semibold"
            style={{ fontSize: "20px", color: "#09489a" }}
          >
            {pago.fechaLimitePago}
          </span>
          <span
            className="font-inter"
            style={{ fontSize: "14px", color: "rgba(0,0,0,0.4)" }}
          >
            Fecha de limite de pago
          </span>
        </div>
        <button
          onClick={onAddPayment}
          className="btn btn-primary d-flex align-items-center justify-content-center gap-2 border-0 w-100"
          style={{
            backgroundColor: "#227cf2",
            borderRadius: "8px",
            padding: "10px 16px",
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          <PlusIcon style={{ width: "20px", height: "20px" }} />
          <span>Agregar pago</span>
        </button>
      </div>
    </div>
  );
}
