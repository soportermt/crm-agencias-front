"use client";

import React from "react";
import DocumentCard from "@/components/common/DocumentCard";

export default function ClientProfileDocuments() {
  const documents = [
    {
      id: 1,
      name: "Acta_nacimiento.pdf",
      size: "290 kb",
      type: "PDF",
    },
    {
      id: 2,
      name: "Pasaporte.pdf",
      size: "340 kb",
      type: "PDF",
    },
  ];

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

