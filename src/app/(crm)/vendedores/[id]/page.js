"use client";

import InfoVendedor from '@/components/vendedores/InfoVendedor';
import { vendedoresService } from '@/services/vendedores.service';
import React, { use, useEffect, useState } from 'react'

export default function VendedoresInfo({ params }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [vendedor, setVendedor] = useState(null);
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const [dataVendedor, dataDocs] = await Promise.all([
          vendedoresService.getId(id),
          vendedoresService.getDocId(id),
        ]);

        setVendedor(dataVendedor);
        setDocs(dataDocs?.documentos || []);
      } catch (err) {
        console.error("Error al cargar datos del vendedor:", err);
        setError("No se pudo cargar la información del vendedor.");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadData();
    }
  }, [id]);

  if (loading) {
    return <div className="p-4 text-center">Cargando información...</div>;
  }

  if (error || !vendedor) {
    return <div className="p-4 text-center text-danger">{error || "No se encontró el registro."}</div>;
  }

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
          <InfoVendedor data={vendedor} documentos={docs}/>
        </div>
      </div>
    </div>
  )
}
