"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
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
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const perPage = 10;
  const debounceRef = useRef(null);
  const [dateRange, setDateRange] = useState({
    startDate: "2026-05-01",
    endDate: "2026-05-25",
  });

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [searchTerm]);

  const loadClients = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await clientsService.getClients({
        page,
        perPage,
        search: debouncedSearch,
        filter: activeFilter,
      });
      setClients(Array.isArray(response.data) ? response.data : []);
      setCurrentPage(response.currentPage || page);
      setTotalPages(response.totalPages || 1);
      setTotalItems(response.total || 0);
    } catch (err) {
      console.error("Error al cargar clientes desde API:", err);
      setError("No se pudo conectar con la API de clientes.");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, activeFilter]);

  useEffect(() => {
    setCurrentPage(1);
    loadClients(1);
  }, [loadClients]);

  const handlePageChange = (page) => {
    loadClients(page);
  };

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
            <button className="btn btn-sm btn-outline-dark ms-3" onClick={() => loadClients(currentPage)}>
              Reintentar
            </button>
          </div>
        ) : (
          <ClientTable
            clients={clients}
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      <ClientModal 
        show={showModal} 
        onClose={() => setShowModal(false)} 
        onClientCreated={() => loadClients(1)}
      />
    </div>
  );
}

