"use client";

import React, { useState, useEffect, useCallback } from "react";
import ClientHeader from "@/components/clients/ClientHeader";
import ClientMetrics from "@/components/clients/ClientMetrics";
import ClientFilters from "@/components/clients/ClientFilters";
import ClientTable from "@/components/clients/ClientTable";
import ClientModal from "@/components/clients/ClientModal";
import { clientsService } from "@/services/clients.service";

export default function ClientesPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [dateRange, setDateRange] = useState({
    startDate: "2026-05-01",
    endDate: "2026-05-25",
  });

  const loadClients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await clientsService.getClients();
      setClients(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al cargar clientes desde API:", err);
      setError("No se pudo conectar con la API de clientes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  const filteredClients = clients.filter((client) => {
    const name = client.nombreCompleto || client.name || "";
    const username = client.username || "";
    const city = client.ciudad || client.city || "";
    const state = client.estado || client.state || "";

    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      state.toLowerCase().includes(searchTerm.toLowerCase());

    const status = client.status || "Nuevo";
    const matchesFilter =
      activeFilter === "Todos" ||
      (activeFilter === "Activos"
        ? status === "Nuevo" || status === "Proceso"
        : status === activeFilter);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="container-fluid p-0">
      <div className="bg-white p-4 border shadow-premium" style={{ borderRadius: "12px" }}>
        <ClientHeader onRegisterClientClick={() => setShowModal(true)} />

        <ClientMetrics />

        <ClientFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          startDate={dateRange.startDate}
          endDate={dateRange.endDate}
          onDateRangeChange={setDateRange}
        />

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="text-muted mt-2 font-poppins small">Cargando clientes desde el backend...</p>
          </div>
        ) : error ? (
          <div className="alert alert-warning my-3 text-center" role="alert">
            {error}
            <button className="btn btn-sm btn-outline-dark ms-3" onClick={loadClients}>
              Reintentar
            </button>
          </div>
        ) : (
          <ClientTable clients={filteredClients} />
        )}
      </div>

      <ClientModal 
        show={showModal} 
        onClose={() => setShowModal(false)} 
        onClientCreated={loadClients}
      />
    </div>
  );
}

