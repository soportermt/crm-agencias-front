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
  const [editingClient, setEditingClient] = useState(null);
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

  const exportToCSV = (data) => {
    if (!data.length) return;

    const headers = ["Nombre", "Correo", "Teléfono", "Estatus"];

    const rows = data.map((row) => [
      row.nombre || "",
      row.correo || "",
      row.telefono || "",
      row.status || "",
    ]);

    const escapeCsvValue = (value) => {
      const str = String(value ?? "");
      if (str.includes(",") || str.includes('"') || str.includes("\n")) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const csvContent = [headers, ...rows]
      .map((r) => r.map(escapeCsvValue).join(","))
      .join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `clientes_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExport = async () => {
    try {
      setLoading(true);
      const response = await clientsService.getClients({
        page: 1,
        perPage: 100000,
        search: debouncedSearch,
        filter: activeFilter,
      });
      const dataToExport = Array.isArray(response.data) ? response.data : [];
      if (dataToExport.length === 0) {
        alert("No hay clientes para exportar con los filtros actuales.");
        return;
      }
      exportToCSV(dataToExport);
    } catch (err) {
      console.error("Error al exportar clientes:", err);
      alert("No se pudieron exportar los clientes.");
    } finally {
      setLoading(false);
      // Reload current page to restore the table state
      loadClients(currentPage);
    }
  };

  return (
    <div className="container-fluid p-0">
      <div className="bg-white p-4 border shadow-premium" style={{ borderRadius: "12px" }}>
        <ClientHeader onRegisterClientClick={() => { setEditingClient(null); setShowModal(true); }} />

        <ClientMetrics />

        <ClientFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          startDate={dateRange.startDate}
          endDate={dateRange.endDate}
          onDateRangeChange={setDateRange}
          onExport={handleExport}
        />

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="text-muted mt-2 font-poppins small">Cargando...</p>
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
            onEdit={(client) => { setEditingClient(client); setShowModal(true); }}
          />
        )}
      </div>

      <ClientModal 
        show={showModal} 
        onClose={() => setShowModal(false)} 
        onClientCreated={() => loadClients(1)}
        client={editingClient}
      />
    </div>
  );
}

