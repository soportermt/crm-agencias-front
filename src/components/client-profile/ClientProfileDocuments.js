"use client";

import React, { useState, useEffect, useRef } from "react";
import DocumentCard from "@/components/common/DocumentCard";
import { clientsService } from "@/services/clients.service";

export default function ClientProfileDocuments({ clientId }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    async function loadDocuments() {
      try {
        setLoading(true);
        if (clientId) {
          const data = await clientsService.getClientDocuments(clientId);
          const formattedData = data.map((d) => ({
            id: d.id,
            name: d.name || "Documento.pdf",
            size: d.size || "250 kb",
            type: d.type?.toUpperCase() || "PDF",
            url: d.url
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

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("El archivo supera el límite de 5MB permitidos.");
      return;
    }

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      alert("Formato no válido. Solo se permiten PDF e imágenes.");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      
      const response = await clientsService.uploadClientDocument(clientId, formData);
      if (response.success && response.document) {
        setDocuments(prev => [response.document, ...prev]);
      }
    } catch (error) {
      console.error("Error subiendo el archivo:", error);
      alert(error.response?.data?.error || "Error al subir el documento.");
    } finally {
      setUploading(false);
      event.target.value = ""; 
    }
  };

  const handleDelete = async (docId) => {
    if (!confirm("¿Seguro que deseas eliminar este documento?")) return;
    try {
      await clientsService.deleteClientDocument(docId);
      setDocuments(prev => prev.filter(d => d.id !== docId));
    } catch (error) {
      console.error("Error eliminando documento:", error);
      alert("Error al eliminar el documento.");
    }
  };

  if (loading) {
    return <div className="text-center py-4"><div className="spinner-border text-primary" role="status"></div></div>;
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
            url={doc.url}
            onDelete={() => handleDelete(doc.id)}
          />
        ))}
      </div>

      <div className="d-flex flex-column gap-4 align-items-end w-100">
        <div
          className="d-flex align-items-center justify-content-center w-100 cursor-pointer transition-smooth"
          onClick={() => !uploading && fileInputRef.current.click()}
          style={{
            backgroundColor: uploading ? "#f1f5f9" : "#e7f1fe",
            height: "97px",
            borderRadius: "12px",
            border: "1.5px dashed rgba(12, 92, 198, 0.2)",
            cursor: uploading ? "not-allowed" : "pointer"
          }}
        >
          <div className="d-flex align-items-center gap-2">
            {uploading ? (
              <span className="spinner-border spinner-border-sm text-primary" role="status"></span>
            ) : (
              <i
                className="bi bi-plus"
                style={{ fontSize: "24px", color: "#0c5cc6" }}
              ></i>
            )}
            <span
              className="fw-medium"
              style={{
                fontSize: "16px",
                lineHeight: "28px",
                color: "#0c5cc6",
              }}
            >
              {uploading ? "Subiendo..." : "Agregar documentos"}
            </span>
          </div>
        </div>

        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileUpload} 
        />
      </div>
    </div>
  );
}
