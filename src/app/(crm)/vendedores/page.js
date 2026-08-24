"use client";

import React, { useEffect, useState } from "react";
import VendedoresHeader from "@/components/vendedores/VendedoresHeader";
import VendedoresFilters from "@/components/vendedores/VendedoresFilters";
import VendedoresTable from "@/components/vendedores/VendedoresTable";
import VendedoresModal from "@/components/vendedores/VendedoresModal";
import { vendedoresService } from "@/services/vendedores.service";

export default function VendedoresPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [vendedores, setVendedores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadVendedores() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await vendedoresService.get();
        setVendedores(data);
      } catch (err) {
        console.error("Error al cargar datos de agencia:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }

    loadVendedores();
  }, []);

  const filteredVendedores = vendedores.filter(v =>
    v.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.telefono.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return (<div className="d-flex justify-content-center align-items-center vh-100 bg-light">
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Cargando...</span>
    </div>
  </div>);
  if (error || !vendedores) return <div className="text-danger">No se pudo cargar la información.</div>;

  return (
    <div className="container-fluid p-0">
      <div className="bg-white p-4 border shadow-premium" style={{ borderRadius: "12px" }}>
        <VendedoresHeader onAddVendedorClick={() => setShowModal(true)} />

        <VendedoresFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filteredData={filteredVendedores}
        />

        <VendedoresTable vendedores={filteredVendedores} />
      </div>

      <VendedoresModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onClientCreated={(nuevoVendedor) => {
          setVendedores((prev) => [nuevoVendedor, ...prev]);
        }}
      />
    </div>
  );
}
