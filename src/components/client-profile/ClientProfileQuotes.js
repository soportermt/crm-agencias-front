"use client";

import React, { useState, useEffect } from "react";
import SearchBar from "@/components/common/SearchBar";
import QuoteCard from "@/components/common/QuoteCard";
import { clientsService } from "@/services/clients.service";

export default function ClientProfileQuotes({ clientId }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadQuotes() {
      try {
        setLoading(true);
        if (clientId) {
          const data = await clientsService.getClientQuotes(clientId);
          setQuotes(data);
        }
      } catch (error) {
        console.error("Error al cargar cotizaciones:", error);
      } finally {
        setLoading(false);
      }
    }
    loadQuotes();
  }, [clientId]);

  if (loading) {
    return <div className="text-center py-4"><div className="spinner-border text-primary" role="status"></div></div>;
  }


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

