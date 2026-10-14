"use client";

import GruposTable from "@/components/grupos/GruposTable";
import { grupoService } from "@/services/grupo.service";
import React, { useEffect, useState } from "react";

export default function Grupos() {
  const [grupos, setGrupos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelado = false;
    async function cargarGrupos() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await grupoService.gruposapi();
        if (!cancelado) setGrupos(data);
      } catch (err) {
        console.error("Error al cargar ventas:", err);
        if (!cancelado) setError("No se pudieron cargar las ventas");
      } finally {
        if (!cancelado) setIsLoading(false);
      }
    }

    cargarGrupos();
    return () => {
      cancelado = true;
    };
  }, []);

  return (
    <div className="container-fluid p-0">
      <div className="bg-white p-4 shadow-premium" style={{ borderRadius: "8px" }}>
        <h1
          className="font-inter fw-medium mb-1"
          style={{ color: "#0f1901", fontSize: "20px", lineHeight: "1.2" }}
        >
          Listado de grupos
        </h1>
        {error && <div className="alert alert-danger mt-3">{error}</div>}
        {isLoading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="text-muted mt-2 font-poppins small">Cargando...</p>
          </div>
        ) : (
          <GruposTable data={grupos}/>
        )}
      </div>
    </div>
  )
}
