"use client";

import React, { useState, useEffect, useMemo } from "react";
import { catalogosService } from "@/services/catalogos.service";
import { templatesService } from "@/services/templates.service";
import { formatPhone } from "./utils";

export default function NewWhatsAppConversationModal({ show, onClose, onSendTemplate, initialContact }) {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [variableValues, setVariableValues] = useState({});

  useEffect(() => {
    if (!show) return;

    setSearchTerm("");
    if (initialContact) {
      setSelectedContact({
        id: initialContact.clientId || initialContact.id,
        name: initialContact.clientName || initialContact.name || "Cliente",
        phone: initialContact.clientPhone || initialContact.phone || "",
        mail: initialContact.clientEmail || initialContact.mail || ""
      });
    } else {
      setSelectedContact(null);
    }
    setSelectedTemplate(null);
    setVariableValues({});

    async function loadData() {
      try {
        setLoading(true);
        const [contactsData, templatesData, settingsData] = await Promise.all([
          catalogosService.searchCustomers(),
          templatesService.getTemplates(),
          templatesService.getAgencySettings()
        ]);
        
        const rawList = Array.isArray(contactsData) ? contactsData : (contactsData?.data && Array.isArray(contactsData.data) ? contactsData.data : []);
        const normalized = rawList
          .map((c) => ({
            id: c.id ?? c.id_cliente ?? c.value,
            name: c.nombreCompleto || c.nombre || c.name || c.text || c.label || "Cliente",
            phone: c.celular || c.telefono || c.phone || c.tel || "",
            mail: c.correo || c.email || c.mail || "",
          }))
          .filter((c) => c.phone);
        setContacts(normalized);

        const fetchedTemplates = Array.isArray(templatesData) ? templatesData : (templatesData?.data || []);
        setTemplates(fetchedTemplates);

        if (settingsData && settingsData.default_open_template_id) {
          const defaultTpl = fetchedTemplates.find(t => t.id === settingsData.default_open_template_id);
          if (defaultTpl) setSelectedTemplate(defaultTpl);
        } else if (fetchedTemplates.length > 0) {
          const defaultApertura = fetchedTemplates.find(t => t.name === 'crm_apertura_default');
          if (defaultApertura) setSelectedTemplate(defaultApertura);
        }

      } catch (error) {
        console.error("Error al cargar datos:", error);
        setContacts([]);
        setTemplates([]);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [show, initialContact]);

  // Actualizar variables cuando cambie el template o el contacto
  useEffect(() => {
    if (!selectedTemplate) {
      setVariableValues({});
      return;
    }

    const matches = (selectedTemplate.body || "").match(/\{\{\d+\}\}/g) || [];
    const uniqueVars = Array.from(new Set(matches));

    let mapping = [];
    if (selectedTemplate.variables_mapping) {
      mapping = typeof selectedTemplate.variables_mapping === "string"
        ? JSON.parse(selectedTemplate.variables_mapping)
        : selectedTemplate.variables_mapping;
    }
    const mappingMap = new Map((mapping || []).map(m => [m.variable, m]));

    setVariableValues((prev) => {
      const newValues = {};
      uniqueVars.forEach(v => {
        const mapItem = mappingMap.get(v);
        const source = mapItem?.source || (v === "{{1}}" ? "client_name" : "manual");
        
        if (source === "client_name" && selectedContact) {
          newValues[v] = selectedContact.name || "";
        } else if (source === "client_phone" && selectedContact) {
          newValues[v] = selectedContact.phone || "";
        } else if (source === "client_email" && selectedContact) {
          newValues[v] = selectedContact.mail || "";
        } else {
          newValues[v] = prev[v] || "";
        }
      });
      return newValues;
    });
  }, [selectedTemplate, selectedContact]);

  const filteredContacts = useMemo(() => {
    return contacts.filter((c) => {
      if (!searchTerm.trim()) return true;
      const q = searchTerm.toLowerCase();
      return (c.name || "").toLowerCase().includes(q) || (c.phone || "").toLowerCase().includes(q);
    });
  }, [contacts, searchTerm]);

  const parsedButtons = useMemo(() => {
    if (!selectedTemplate?.buttons) return [];
    return typeof selectedTemplate.buttons === "string"
      ? JSON.parse(selectedTemplate.buttons)
      : selectedTemplate.buttons;
  }, [selectedTemplate]);

  const previewBody = useMemo(() => {
    if (!selectedTemplate) return "";
    let text = selectedTemplate.body || "";
    Object.entries(variableValues).forEach(([v, val]) => {
      text = text.replaceAll(v, val || `[${v}]`);
    });
    return text;
  }, [selectedTemplate, variableValues]);

  const canConfirm = selectedContact && selectedTemplate;

  const handleConfirm = () => {
    if (!canConfirm) return;

    // Convertir variableValues a array ordenado por el índice {{n}}
    const keys = Object.keys(variableValues).sort((a, b) => {
      const numA = parseInt(a.replace(/\D/g, ""), 10);
      const numB = parseInt(b.replace(/\D/g, ""), 10);
      return numA - numB;
    });
    const parameters = keys.map(k => variableValues[k] || "");

    onSendTemplate(selectedContact, selectedTemplate, parameters);
    onClose();
  };

  if (!show) return null;

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
                  Selecciona un contacto y una plantilla para iniciar el chat cumpliendo la ventana de 24 horas
                </p>
              </div>
              <button type="button" className="btn-close" onClick={onClose} aria-label="Cerrar"></button>
            </div>

            <div className="modal-body pt-3">
              {initialContact && selectedContact && (
                <div className="mb-4 p-3 rounded d-flex align-items-center justify-content-between" style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}>
                  <div className="d-flex align-items-center gap-3">
                    <div className="rounded-circle d-flex align-items-center justify-content-center text-primary fw-bold" style={{ width: "42px", height: "42px", backgroundColor: "#e7f1fe", fontSize: "15px" }}>
                      {(selectedContact.name || "CL").substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <span className="d-block small text-secondary mb-1" style={{ fontSize: "12px", fontWeight: "500" }}>Destinatario preseleccionado</span>
                      <div className="fw-semibold text-dark" style={{ fontSize: "15px" }}>{selectedContact.name}</div>
                    </div>
                  </div>
                  <div className="text-end d-none d-sm-block">
                    <span className="badge bg-white text-secondary border px-3 py-2 shadow-sm" style={{ fontSize: "13px", fontWeight: "500" }}>
                      <i className="bi bi-whatsapp me-2 text-success" style={{ fontSize: "14px" }}></i>
                      {formatPhone(selectedContact.phone)}
                    </span>
                  </div>
                </div>
              )}
              <div className="row g-3">
                {/* 1. Contactos */}
                {!initialContact && (
                  <div className="col-12 col-md-4">
                  <p className="fw-semibold mb-2 font-poppins" style={{ color: "#0f1901", fontSize: "13px" }}>
                    1. Destinatario
                  </p>
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
                                  {formatPhone(contact.phone)}
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
                )}

                {/* 2. Plantillas */}
                <div className={`col-12 ${initialContact ? 'col-md-6' : 'col-md-4'}`}>
                  <p className="fw-semibold mb-2 font-poppins" style={{ color: "#0f1901", fontSize: "13px" }}>
                    2. Selecciona Plantilla
                  </p>
                  <div className="d-flex flex-column gap-2 overflow-y-auto" style={{ height: "420px" }}>
                    {templates.length === 0 ? (
                      <div className="p-4 text-center text-muted small border rounded">
                        No hay plantillas registradas. Ve a Configuración &gt; Plantillas para registrarlas.
                      </div>
                    ) : (
                      templates.map((template) => {
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
                              <span className="fw-semibold text-truncate" style={{ color: "#0f1901", fontSize: "13px" }}>
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
                            <p className="small mb-0 text-truncate-2" style={{ color: "#404040", fontSize: "12px", lineHeight: "1.4" }}>
                              {template.body}
                            </p>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* 3. Variables y Previsualización */}
                <div className={`col-12 ${initialContact ? 'col-md-6' : 'col-md-4'}`}>
                  <p className="fw-semibold mb-2 font-poppins" style={{ color: "#0f1901", fontSize: "13px" }}>
                    3. Variables y Vista Previa
                  </p>

                  <div className="d-flex flex-column gap-3 overflow-y-auto" style={{ height: "420px" }}>
                    {/* Formulario de variables si las hay */}
                    {Object.keys(variableValues).length > 0 && (
                      <div className="p-3 border rounded bg-white" style={{ borderRadius: "10px" }}>
                        <label className="small fw-semibold text-dark mb-2 d-block" style={{ fontSize: "12px" }}>
                          Completar variables del mensaje:
                        </label>
                        <div className="d-flex flex-column gap-2">
                          {Object.keys(variableValues).map((v) => (
                            <div key={v} className="d-flex flex-column">
                              <span className="small text-muted mb-1" style={{ fontSize: "11px" }}>
                                Variable <code>{v}</code>:
                              </span>
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                style={{ fontSize: "12px", borderRadius: "6px" }}
                                value={variableValues[v] || ""}
                                onChange={(e) =>
                                  setVariableValues((prev) => ({ ...prev, [v]: e.target.value }))
                                }
                                placeholder={`Valor para ${v}`}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Previsualización tipo chat de WhatsApp */}
                    <div
                      className="p-3 border rounded shadow-sm flex-grow-1 d-flex flex-column justify-content-end"
                      style={{
                        backgroundColor: "#efeae2",
                        borderRadius: "12px",
                        minHeight: "220px",
                      }}
                    >
                      {selectedTemplate ? (
                        <>
                          <div
                            className="bg-white p-3 rounded mb-2 shadow-sm position-relative"
                            style={{
                              borderRadius: "10px 10px 10px 0px",
                              maxWidth: "96%",
                              alignSelf: "flex-start",
                            }}
                          >
                            {selectedTemplate.header_type === "DOCUMENT" && (
                              <div
                                className="p-2 mb-2 rounded bg-light border d-flex align-items-center gap-2"
                                style={{ fontSize: "11px", color: "#64748b" }}
                              >
                                <i className="bi bi-file-earmark-pdf-fill text-danger" style={{ fontSize: "18px" }}></i>
                                <div className="text-truncate">
                                  <strong>Documento.pdf</strong>
                                </div>
                              </div>
                            )}

                            <div style={{ fontSize: "13px", color: "#111b21", whiteSpace: "pre-wrap", lineHeight: "1.4" }}>
                              {previewBody}
                            </div>

                            <div className="text-end mt-1" style={{ fontSize: "10px", color: "#667781" }}>
                              Ahora <i className="bi bi-check2-all text-primary ms-1"></i>
                            </div>
                          </div>

                          {/* Renderizar botones de la plantilla */}
                          {parsedButtons.map((b, idx) => (
                            <div
                              key={idx}
                              className="bg-white text-center py-2 px-3 rounded shadow-sm fw-medium text-primary mb-1 border"
                              style={{
                                borderRadius: "8px",
                                fontSize: "12px",
                                cursor: "default",
                              }}
                            >
                              <i className="bi bi-reply-fill me-1"></i>
                              {b.text || `Opción ${idx + 1}`}
                            </div>
                          ))}
                        </>
                      ) : (
                        <div className="text-center text-muted small py-4">
                          Selecciona una plantilla para previsualizar el mensaje
                        </div>
                      )}
                    </div>
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
