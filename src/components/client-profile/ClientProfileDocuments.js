"use client";

import React, { useState, useEffect } from "react";
import DocumentCard from "@/components/common/DocumentCard";
import { clientsService } from "@/services/clients.service";

export default function ClientProfileDocuments({ clientId }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDocuments() {
      try {
        setLoading(true);
        if (clientId) {
          const data = await clientsService.getClientDocuments(clientId);
          // format demo data for frontend UI
          const formattedData = data.map((d) => ({
            id: d.id,
            name: d.name || "Documento.pdf",
            size: d.size || "250 kb",
            type: d.type?.toUpperCase() || "PDF",
          }));
          setDocuments(formattedData);
        }
      } catch (error) {
        console.error("Error al cargar documentos:", error);
      } finally {
        setLoading(false);
      }
    }
    loadDocuments();
  }, [clientId]);

  if (loading) {
    return <div className="text-center py-4"><div className="spinner-border text-success" role="status"></div></div>;
  }


  return (
    <div className="d-flex flex-column gap-4 font-inter w-100">
      <div className="d-flex align-items-center justify-content-between">
        <p
          className="fw-medium mb-0"
          style={{
            fontSize: "18px",
            lineHeight: "28px",
            color: "#1e293b",
          }}
        >
          Documentos del cliente
        </p>
      </div>

      <div className="d-flex flex-column gap-3">
        {documents.map((doc) => (
          <DocumentCard
            key={doc.id}
            name={doc.name}
            size={doc.size}
            type={doc.type}
          />
        ))}
      </div>

      <div className="d-flex flex-column gap-4 align-items-end w-100">
        <div
          className="d-flex align-items-center justify-content-center w-100 cursor-pointer transition-smooth"
          style={{
            backgroundColor: "#e7f1fe",
            height: "97px",
            borderRadius: "12px",
            border: "1.5px dashed rgba(12, 92, 198, 0.2)",
          }}
        >
          <div className="d-flex align-items-center gap-2">
            <i
              className="bi bi-plus"
              style={{ fontSize: "24px", color: "#0c5cc6" }}
            ></i>
            <span
              className="fw-medium"
              style={{
                fontSize: "16px",
                lineHeight: "28px",
                color: "#0c5cc6",
              }}
            >
              Agregar documentos
            </span>
          </div>
        </div>

        <button
          className="btn d-flex align-items-center justify-content-center text-white transition-smooth"
          style={{
            backgroundColor: "#227cf2",
            border: "1px solid #227cf2",
            borderRadius: "8px",
            width: "227.5px",
            height: "40px",
            fontSize: "14px",
            fontWeight: "500",
            boxShadow: "0px 1px 2px rgba(16, 24, 40, 0.05)",
          }}
        >
          Confirmar
        </button>
      </div>
    </div>
  );
}

