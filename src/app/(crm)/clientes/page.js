"use client";

import React, { useState } from "react";
import ClientHeader from "@/components/clients/ClientHeader";
import ClientMetrics from "@/components/clients/ClientMetrics";
import ClientFilters from "@/components/clients/ClientFilters";
import ClientTable from "@/components/clients/ClientTable";
import ClientModal from "@/components/clients/ClientModal";
import { clientsMock } from "@/mocks/clientsMock";

export default function ClientesPage() {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("Todos");

  const filteredClients = clientsMock.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.state.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      activeFilter === "Todos" ||
      (activeFilter === "Activos"
        ? client.status === "Nuevo" || client.status === "Proceso"
        : client.status === activeFilter);

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
        />

        <ClientTable clients={filteredClients} />
      </div>

      <ClientModal show={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
