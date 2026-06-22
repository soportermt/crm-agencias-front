"use client";

import React, { useState } from "react";
import SearchBar from "@/components/common/SearchBar";
import DataTable from "@/components/common/DataTable";

export default function ClientProfilePurchases() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  const purchases = [
    {
      id: 1,
      code: "SID3843732",
      date: "20/02/2024",
      destination: "Cancún",
      description: "Traslado",
      total: "$ 1,700.50",
      currency: "MXN",
    },
    {
      id: 2,
      code: "SID3843733",
      date: "22/02/2024",
      destination: "Playa del Carmen",
      description: "Reserva de hotel",
      total: "$ 1,500.75",
      currency: "MXN",
    },
    {
      id: 3,
      code: "SID3843734",
      date: "24/02/2024",
      destination: "Tulum",
      description: "Excursión a las ruinas",
      total: "$ 800.00",
      currency: "MXN",
    },
    {
      id: 4,
      code: "SID3843735",
      date: "26/02/2024",
      destination: "Cozumel",
      description: "Buceo",
      total: "$ 1,200.00",
      currency: "MXN",
    },
  ];

  const filteredPurchases = purchases.filter(
    (item) =>
      item.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPurchases.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPurchases = filteredPurchases.slice(startIndex, startIndex + itemsPerPage);

  const columns = [
    { key: "id", label: "ID", sortable: true, width: "80px" },
    { key: "code", label: "Código de confirmación", sortable: true, width: "225px" },
    { key: "date", label: "Fecha de venta", sortable: true, width: "155px" },
    { key: "destination", label: "Destino", sortable: true, width: "155px" },
    { key: "description", label: "Descripción", sortable: true, width: "155px" },
    { key: "total", label: "Total", sortable: true, width: "155px" },
    { key: "currency", label: "Moneda", sortable: true, width: "130px" },
  ];

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div>
      {/* Encabezado y Botón Exportar */}
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
        <h3 className="font-poppins h6 fw-semibold mb-0" style={{ color: "var(--dark-green)" }}>
          Historial de compras
        </h3>
        
        <button
          className="btn d-flex align-items-center gap-2 transition-smooth fw-medium"
          style={{
            backgroundColor: "#e7f1fe",
            border: "1px solid #0c5cc6",
            borderRadius: "8px",
            color: "#0c5cc6",
            padding: "8px 16px",
            fontSize: "13px",
            height: "38px"
          }}
        >
          <i className="bi bi-cloud-arrow-down" style={{ fontSize: "16px" }}></i>
          Exportar
        </button>
      </div>

      {/* Filtros e Input de Búsqueda */}
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <button
            className="btn bg-white border font-inter text-dark-slate"
            style={{
              borderColor: "#d0d5dd",
              borderRadius: "8px",
              fontSize: "13px",
              padding: "8px 16px",
              height: "38px",
            }}
          >
            01/05/2026 al 25/05/2026
          </button>
          
          <button
            className="btn bg-white border font-inter text-dark-slate"
            style={{
              borderColor: "#d0d5dd",
              borderRadius: "8px",
              fontSize: "13px",
              padding: "8px 16px",
              height: "38px",
            }}
          >
            Activos
          </button>
        </div>

        <SearchBar value={searchTerm} onChange={handleSearchChange} />
      </div>

      <div style={{ border: "1px solid rgba(0,0,0,0.08)" }}>
        <DataTable
          columns={columns}
          data={paginatedPurchases}
          minWidth="1000px"
          emptyMessage="No se encontraron compras."
          pagination={true}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
}
