"use client";

import React, { useState, useEffect } from "react";
import { catalogosService } from "@/services/catalogos.service";
import { WA_TEMPLATES } from "./utils";

export default function NewWhatsAppConversationModal({ show, onClose, onSendTemplate }) {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  useEffect(() => {
    if (!show) return;

    setSearchTerm("");
    setSelectedContact(null);
    setSelectedTemplate(null);

    async function loadContacts() {
      try {
        setLoading(true);
        const data = await catalogosService.searchCustomers();
        const normalized = (data || [])
          .map((c) => ({
            id: c.id,
            name: c.text || c.name || "Cliente",
            phone: c.phone || c.telefono || "",
            mail: c.mail || c.correo || c.email || "",
          }))
          .filter((c) => c.phone);
        setContacts(normalized);
      } catch (error) {
        console.error("Error al cargar contactos:", error);
        setContacts([]);
      } finally {
        setLoading(false);
      }
    }

    loadContacts();
  }, [show]);

  if (!show) return null;

  const filteredContacts = contacts.filter((c) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (c.name || "").toLowerCase().includes(q) || (c.phone || "").toLowerCase().includes(q);
  });

  const canConfirm = selectedContact && selectedTemplate;

  const handleConfirm = () => {
    if (!canConfirm) return;
    onSendTemplate(selectedContact, selectedTemplate);
    onClose();
  };

  return (
    <>
      <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true" style={{ zIndex: 1050 }}>
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content" style={{ borderRadius: "12px", border: "none", boxShadow: "0 8px 16px 0 rgba(12,12,13,0.1)", maxWidth: "none", width: "100%" }}>
            <div className="modal-header border-0 pb-0">
              <div>
                <h5 className="modal-title font-poppins fw-semibold" style={{ color: "#0f1901", fontSize: "16px" }}>
                  Abrir conversación en WhatsApp
                </h5>
                <p className="small mb-0 mt-1" style={{ color: "var(--grey-text)", fontSize: "13px" }}>
                  Selecciona un contacto y una plantilla para iniciar el chat
                </p>
              </div>
              <button type="button" className="btn-close" onClick={onClose} aria-label="Cerrar"></button>
            </div>

            <div className="modal-body pt-3">
              <div className="row g-3">
                {/* Contactos */}
                <div className="col-12 col-md-7">
                  <div className="d-flex flex-column" style={{ height: "420px" }}>
                    <div className="position-relative mb-2">
                      <i
                        className="bi bi-search position-absolute text-secondary"
                        style={{ left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "13px" }}
                      ></i>
                      <input
                        type="text"
                        className="form-control input-custom ps-5"
                        placeholder="Buscar contacto..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ height: "40px", fontSize: "13px" }}
                      />
                    </div>

                    <div className="flex-grow-1 overflow-y-auto border rounded" style={{ borderRadius: "12px", borderColor: "#f0f0f0" }}>
                      {loading ? (
                        <div className="text-center py-5">
                          <div className="spinner-border text-primary" role="status" style={{ width: "22px", height: "22px" }}></div>
                        </div>
                      ) : filteredContacts.length === 0 ? (
                        <div className="text-center py-5 px-3">
                          <i className="bi bi-person-x text-secondary" style={{ fontSize: "28px", color: "#cbd5e1" }}></i>
                          <p className="small text-secondary mt-2 mb-0" style={{ color: "var(--grey-text)" }}>
                            No se encontraron contactos con teléfono
                          </p>
                        </div>
                      ) : (
                        filteredContacts.map((contact) => {
                          const isSelected = selectedContact?.id === contact.id;
                          return (
                            <button
                              key={contact.id}
                              onClick={() => setSelectedContact(contact)}
                              className={`w-100 text-start border-0 bg-transparent d-flex align-items-center gap-2 px-3 py-2 mensajeria-conversation-item ${isSelected ? "active" : ""}`}
                              style={{ fontSize: "13px" }}
                            >
                              <div
                                className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 fw-bold"
                                style={{
                                  width: "38px",
                                  height: "38px",
                                  backgroundColor: isSelected ? "#dbeafe" : "#e7f1fe",
                                  color: "#0c5cc6",
                                  fontSize: "13px",
                                }}
                              >
                                {(contact.name || "CL").substring(0, 2).toUpperCase()}
                              </div>
                              <div className="flex-grow-1 overflow-hidden">
                                <span className="fw-semibold text-truncate d-block" style={{ color: "#0f1901" }}>
                                  {contact.name}
                                </span>
                                <span className="text-truncate d-block small" style={{ color: "var(--grey-text)", fontSize: "12px" }}>
                                  {contact.phone}
                                </span>
                              </div>
                              {isSelected && (
                                <i className="bi bi-check-circle-fill flex-shrink-0" style={{ color: "#0c5cc6", fontSize: "16px" }}></i>
                              )}
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>

                {/* Plantillas */}
                <div className="col-12 col-md-5">
                  <p className="fw-semibold mb-2 font-poppins" style={{ color: "#0f1901", fontSize: "13px" }}>
                    Plantillas de WhatsApp Business
                  </p>
                  <div className="d-flex flex-column gap-2 overflow-y-auto" style={{ height: "384px" }}>
                    {WA_TEMPLATES.map((template) => {
                      const isSelected = selectedTemplate?.id === template.id;
                      return (
                        <button
                          key={template.id}
                          onClick={() => setSelectedTemplate(template)}
                          className="text-start border w-100 rounded p-3 bg-transparent transition-smooth"
                          style={{
                            borderColor: isSelected ? "#0c5cc6" : "#e1e1e1",
                            backgroundColor: isSelected ? "#f4f9ff" : "#ffffff",
                            borderRadius: "12px",
                          }}
                        >
                          <div className="d-flex align-items-center justify-content-between gap-2 mb-1">
                            <span className="fw-semibold" style={{ color: "#0f1901", fontSize: "13px" }}>
                              {template.name}
                            </span>
                            <span
                              className="rounded-pill flex-shrink-0"
                              style={{
                                fontSize: "10px",
                                padding: "2px 8px",
                                backgroundColor: "#e7f1fe",
                                color: "#0c5cc6",
                              }}
                            >
                              {template.category}
                            </span>
                          </div>
                          <div className="small mb-1" style={{ color: "var(--grey-text)", fontSize: "11px" }}>
                            {template.language}
                          </div>
                          <p className="small mb-0" style={{ color: "#404040", fontSize: "12px", lineHeight: "1.4" }}>
                            {template.body}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer border-0 justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-light"
                style={{ borderRadius: "12px", fontSize: "13px", padding: "10px 20px" }}
                onClick={onClose}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-primary-custom d-flex align-items-center gap-2"
                style={{ fontSize: "13px", padding: "10px 20px" }}
                onClick={handleConfirm}
                disabled={!canConfirm}
              >
                <i className="bi bi-whatsapp" style={{ fontSize: "14px" }}></i>
                Abrir conversación
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" style={{ zIndex: 1040 }}></div>
    </>
  );
}
