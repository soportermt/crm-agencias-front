"use client";

import React, { useState, useEffect } from "react";
import SearchBar from "@/components/common/SearchBar";
import QuoteCard from "@/components/common/QuoteCard";
import EmailComposerModal from "@/components/mensajeria/EmailComposerModal";
import { clientsService } from "@/services/clients.service";
import { quotesService } from "@/services/quotes.service";

export default function ClientProfileQuotes({ clientId, client }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showComposer, setShowComposer] = useState(false);
  const [sending, setSending] = useState(false);

  const loadQuotes = async () => {
    try {
      setLoading(true);
      if (clientId) {
        const data = await clientsService.getClientQuotes(clientId);
        setQuotes(data || []);
      }
    } catch (error) {
      console.error("Error al cargar cotizaciones:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuotes();
  }, [clientId]);

  const handleSendQuote = async ({
    subject,
    body,
    html,
    isQuote,
    pdfFile,
    fechaInicial,
    fechaFinal,
    cargoServicios,
  }) => {
    try {
      setSending(true);
      const targetEmail = client?.correo || client?.email;
      if (!targetEmail) {
        alert("El cliente no cuenta con correo electrónico registrado.");
        return;
      }
      const formData = new FormData();
      if (pdfFile) formData.append("file", pdfFile);
      formData.append("clientId", clientId);
      formData.append("to", targetEmail);
      formData.append("subject", subject);
      formData.append("body", body);
      formData.append("html", html || body);
      if (fechaInicial) formData.append("fecha_inicial", fechaInicial);
      if (fechaFinal) formData.append("fecha_final", fechaFinal);
      if (cargoServicios) formData.append("cargo_servicios", cargoServicios);
      formData.append("observaciones", subject);

      await quotesService.sendQuote(formData);
      setShowComposer(false);
      await loadQuotes();
    } catch (err) {
      console.error("Error al enviar cotización:", err);
      alert("No se pudo enviar la cotización. Revisa el archivo adjunto y las credenciales de correo.");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  const filteredQuotes = quotes.filter(
    (quote) =>
      (quote.title && quote.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (quote.details && quote.details.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (quote.type && quote.type.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (quote.userName && quote.userName.toLowerCase().includes(searchTerm.toLowerCase()))
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

        <div className="d-flex align-items-center gap-2">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar cotización..."
          />

          <button
            type="button"
            className="btn btn-primary-custom d-flex align-items-center gap-2"
            style={{ fontSize: "13px", padding: "8px 16px", borderRadius: "10px", whiteSpace: "nowrap" }}
            onClick={() => setShowComposer(true)}
          >
            <i className="bi bi-plus-lg"></i>
            Nueva cotización
          </button>
        </div>
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
            pdfUrl={quote.pdfUrl}
            amount={quote.amount}
            userName={quote.userName}
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

      <EmailComposerModal
        show={showComposer}
        onClose={() => setShowComposer(false)}
        clientInfo={client}
        onSend={handleSendQuote}
        sending={sending}
        initialSubject={`Cotización para ${client?.nombre || "Cliente"}`}
        defaultIsQuote={true}
      />
    </div>
  );
}
