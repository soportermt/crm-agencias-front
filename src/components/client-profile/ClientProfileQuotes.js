"use client";

import React, { useState } from "react";
import SearchBar from "@/components/common/SearchBar";
import QuoteCard from "@/components/common/QuoteCard";

export default function ClientProfileQuotes() {
  const [searchTerm, setSearchTerm] = useState("");

  const quotes = [
    {
      id: 1,
      title: "Barcelo Maya Grand",
      details: "Rivera Maya/Playa del Carmen",
      dateRange: "09/06/2026 a 12/06/2026",
      type: "Hospedaje",
      icon: "hotel",
    },
    {
      id: 2,
      title: "Redondo",
      details: "Hotel - Aeropuerto",
      dateRange: "15/06/2026 al 19/06/2026",
      type: "Traslado",
      icon: "shuttle",
    },
  ];

  const filteredQuotes = quotes.filter(
    (quote) =>
      quote.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="d-flex flex-column gap-4 font-inter">
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
        <div className="d-flex align-items-center gap-2">
          <p
            className="fw-medium mb-0"
            style={{
              fontSize: "18px",
              lineHeight: "28px",
              color: "#1e293b",
            }}
          >
            Cotizaciones
          </p>
        </div>

        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar"
        />
      </div>

      <div className="d-flex flex-column gap-3 w-100">
        {filteredQuotes.map((quote) => (
          <QuoteCard
            key={quote.id}
            title={quote.title}
            details={quote.details}
            dateRange={quote.dateRange}
            type={quote.type}
            icon={quote.icon}
          />
        ))}

        {filteredQuotes.length === 0 && (
          <div
            className="text-center py-5 text-secondary font-inter"
            style={{ fontSize: "13px" }}
          >
            No se encontraron cotizaciones.
          </div>
        )}
      </div>
    </div>
  );
}

