"use client";

import InfoVendedor from '@/components/vendedores/InfoVendedor';
import { vendedoresService } from '@/services/vendedores.service';
import React, { use, useEffect, useState } from 'react'

export default function VendedoresInfo({ params }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [vendedores, setVendedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadVendedores() {
      try {
        setLoading(true);
        const data = await vendedoresService.getId(id);
        setVendedores(data);
      } catch (err) {
        console.error("Error al cargar detalles del cliente:", err);
        setError("No se pudo cargar la información del cliente.");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadVendedores();
    }
  }, [id]);

  return (
    <div className="container-fluid py-1">
      <div className="col-12 col-xl-9 my-2">
        <div
          className="bg-white shadow-premium p-1 position-sticky"
          style={{
            borderRadius: "8px",
            top: "1rem",
            maxHeight: "calc(100vh - 2rem)",
            overflowY: "auto",
          }}
        >
          <InfoVendedor data={vendedores}/>
        </div>
      </div>
    </div>
  )
}
