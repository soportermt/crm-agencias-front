"use client";
import CajaTable from '@/components/caja/CajaTable';
import { cajaService } from '@/services/caja.service';
import React, { useEffect, useState } from 'react'

export default function Caja() {
  const [caja, cetCaja] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelado = false;

    async function cargarReservas() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await cajaService.caja();
        console.log(data);

      } catch (err) {
        console.error("Error al cargar reservas:", err);
      }
    }

    cargarReservas();
  }, []);

  return (
    <div className="container-fluid p-0">
      <div className="bg-white p-4 shadow-premium" style={{ borderRadius: "12px" }}>
        <h1 className="font-inter fw-medium mb-1" style={{ color: "#0f1901", fontSize: "24px", lineHeight: "1.2" }}>
          Gestión de caja
        </h1>

        <CajaTable ventas={caja}/>
      </div>
    </div>
  )
}
