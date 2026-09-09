"use client";

import React, { useState, useEffect, useMemo } from "react";
import { templatesService } from "@/services/templates.service";

export default function PlantillasTab() {
  const [templates, setTemplates] = useState([]);
  const [agencySettings, setAgencySettings] = useState({
    default_open_template_id: null,
    default_reservation_template_id: null,
  });
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [generatingDefaults, setGeneratingDefaults] = useState(false);
  const [message, setMessage] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "MARKETING",
    language: "es_MX",
    headerType: "NONE",
    body: "",
    buttons: [],
    variablesMapping: [],
  });

  const [savingTemplate, setSavingTemplate] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tplList, settings] = await Promise.all([
        templatesService.getTemplates(),
        templatesService.getAgencySettings(),
      ]);

      const normalizedTemplates = Array.isArray(tplList) ? tplList : (tplList?.data || []);
      setTemplates(normalizedTemplates);

      if (settings) {
        setAgencySettings({
          default_open_template_id: settings.default_open_template_id || null,
          default_reservation_template_id: settings.default_reservation_template_id || null,
        });
      }
    } catch (err) {
      console.error("Error al cargar plantillas:", err);
      showMessage("danger", "No se pudieron cargar las plantillas de WhatsApp.");
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4500);
  };

  const handleSaveSettings = async () => {
    try {
      setSavingSettings(true);
      await templatesService.updateAgencySettings({
        defaultOpenTemplateId: agencySettings.default_open_template_id,
        defaultReservationTemplateId: agencySettings.default_reservation_template_id,
      });
      showMessage("success", "Preferencias globales de plantillas guardadas correctamente.");
    } catch (err) {
      console.error("Error al guardar preferencias:", err);
      showMessage("danger", "Error al guardar preferencias.");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleSyncMeta = async () => {
    try {
      setSyncing(true);
      const res = await templatesService.syncMeta();
      showMessage("success", res.message || "Sincronización con Meta completada.");
      await loadData();
    } catch (err) {
      console.error("Error al sincronizar con Meta:", err);
      showMessage("danger", err?.response?.data?.message || "Error al sincronizar con Meta.");
    } finally {
      setSyncing(false);
    }
  };

  const handleGenerateDefaults = async () => {
    try {
      setGeneratingDefaults(true);
      const res = await templatesService.createDefaultsInMeta();
      showMessage("success", res.message || "Plantillas base creadas.");
      await loadData();
    } catch (err) {
      console.error("Error creando plantillas base:", err);
      showMessage("danger", err?.response?.data?.message || "Error al crear plantillas base.");
    } finally {
      setGeneratingDefaults(false);
    }
  };

  const detectedVariables = useMemo(() => {
    const matches = formData.body.match(/\{\{\d+\}\}/g) || [];
    return Array.from(new Set(matches));
  }, [formData.body]);

  useEffect(() => {
    setFormData((prev) => {
      const existingMap = new Map((prev.variablesMapping || []).map((m) => [m.variable, m]));
      const newMapping = detectedVariables.map((v) => {
        if (existingMap.has(v)) {
          return existingMap.get(v);
        }
        return {
          variable: v,
          source: v === "{{1}}" ? "client_name" : "manual",
          label: v === "{{1}}" ? "Nombre del Cliente" : `Variable ${v}`,
        };
      });
      return { ...prev, variablesMapping: newMapping };
    });
  }, [detectedVariables]);

  const openCreateModal = () => {
    setEditingTemplate(null);
    setFormData({
      name: "",
      category: "MARKETING",
      language: "es_MX",
      headerType: "NONE",
      body: "",
      buttons: [],
      variablesMapping: [],
    });
    setModalOpen(true);
  };

  const openEditModal = (t) => {
    setEditingTemplate(t);
    let parsedButtons = [];
    if (t.buttons) {
      parsedButtons = typeof t.buttons === "string" ? JSON.parse(t.buttons) : t.buttons;
    }
    let parsedMapping = [];
    if (t.variables_mapping) {
      parsedMapping = typeof t.variables_mapping === "string" ? JSON.parse(t.variables_mapping) : t.variables_mapping;
    }
    setFormData({
      name: t.name,
      category: t.category,
      language: t.language || "es_MX",
      headerType: t.header_type || "NONE",
      body: t.body,
      buttons: parsedButtons || [],
      variablesMapping: parsedMapping || [],
    });
    setModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVariableSourceChange = (variable, source) => {
    setFormData((prev) => ({
      ...prev,
      variablesMapping: prev.variablesMapping.map((m) =>
        m.variable === variable ? { ...m, source } : m
      ),
    }));
  };

  const handleAddButton = () => {
    if (formData.buttons.length >= 3) return;
    setFormData((prev) => ({
      ...prev,
      buttons: [...prev.buttons, { type: "QUICK_REPLY", text: `Opción ${prev.buttons.length + 1}` }],
    }));
  };

  const handleButtonTextChange = (index, text) => {
    setFormData((prev) => {
      const next = [...prev.buttons];
      next[index] = { ...next[index], text };
      return { ...prev, buttons: next };
    });
  };

  const handleRemoveButton = (index) => {
    setFormData((prev) => {
      const next = prev.buttons.filter((_, i) => i !== index);
      return { ...prev, buttons: next };
    });
  };

  const handleSaveTemplate = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.body.trim()) {
      alert("Por favor completa el nombre y el cuerpo del mensaje.");
      return;
    }

    try {
      setSavingTemplate(true);
      const payload = {
        name: formData.name.trim().toLowerCase().replace(/\s+/g, "_"),
        category: formData.category,
        language: formData.language,
        headerType: formData.headerType === "NONE" ? null : formData.headerType,
        body: formData.body,
        buttons: formData.buttons,
        variablesMapping: formData.variablesMapping,
      };

      if (editingTemplate) {
        await templatesService.updateTemplate(editingTemplate.id, payload);
        showMessage("success", "Plantilla actualizada localmente.");
      } else {
        await templatesService.createTemplate(payload);
        showMessage("success", "Plantilla guardada localmente.");
      }

      setModalOpen(false);
      await loadData();
    } catch (err) {
      console.error("Error guardando plantilla:", err);
      showMessage("danger", "No se pudo guardar la plantilla.");
    } finally {
      setSavingTemplate(false);
    }
  };

  const handleDeleteTemplate = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta plantilla de la base local?")) return;
    try {
      await templatesService.deleteTemplate(id);
      showMessage("success", "Plantilla eliminada.");
      await loadData();
    } catch (err) {
      console.error("Error eliminando plantilla:", err);
      showMessage("danger", "No se pudo eliminar la plantilla.");
    }
  };

  const previewBody = useMemo(() => {
    let text = formData.body || "Vista previa del mensaje...";
    (formData.variablesMapping || []).forEach((m) => {
      let sampleVal = "[Dato]";
      if (m.source === "client_name") sampleVal = "Carlos Mendoza";
      if (m.source === "client_phone") sampleVal = "+52 55 1234 5678";
      if (m.source === "client_email") sampleVal = "carlos@ejemplo.com";
      if (m.source === "manual") sampleVal = "[Texto personalizado]";
      text = text.replaceAll(m.variable, sampleVal);
    });
    return text;
  }, [formData.body, formData.variablesMapping]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column h-100 font-inter">
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4">
        <div>
          <h5 className="mb-1 fw-semibold text-dark" style={{ fontSize: "18px", letterSpacing: "-0.126px" }}>
            Plantillas de WhatsApp Business
          </h5>
          <p className="small text-secondary mb-0" style={{ fontSize: "13px" }}>
            Administra las plantillas oficiales y las asignaciones predeterminadas para apertura y reservas.
          </p>
        </div>

        <div className="d-flex flex-wrap align-items-center gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary d-flex align-items-center gap-2"
            style={{ borderRadius: "8px", fontSize: "13px", padding: "8px 14px" }}
            onClick={handleSyncMeta}
            disabled={syncing}
          >
            <i className={`bi bi-arrow-repeat ${syncing ? "spin" : ""}`}></i>
            {syncing ? "Sincronizando..." : "Sincronizar con Meta"}
          </button>

          <button
            type="button"
            className="btn btn-outline-primary d-flex align-items-center gap-2"
            style={{ borderRadius: "8px", fontSize: "13px", padding: "8px 14px" }}
            onClick={handleGenerateDefaults}
            disabled={generatingDefaults}
          >
            <i className="bi bi-magic"></i>
            {generatingDefaults ? "Creando..." : "Crear Plantillas Base"}
          </button>
        </div>
      </div>

      {message && (
        <div className={`alert alert-${message.type} py-2 px-3 small mb-3`} style={{ borderRadius: "8px" }}>
          {message.text}
        </div>
      )}

      <div
        className="card border mb-4 shadow-sm"
        style={{ borderRadius: "12px", borderColor: "#e2e8f0", backgroundColor: "#f8fafc" }}
      >
        <div className="card-body p-3 p-md-4">
          <div className="d-flex align-items-center gap-2 mb-2">
            <i className="bi bi-gear-fill text-primary" style={{ fontSize: "16px" }}></i>
            <h6 className="mb-0 fw-semibold text-dark" style={{ fontSize: "14px" }}>
              Configuración Global de la Agencia (Pre-selección automática)
            </h6>
          </div>
          <p className="small text-muted mb-3" style={{ fontSize: "12px" }}>
            Elige qué plantilla se abrirá por defecto al iniciar una conversación en la Bandeja o al enviar un comprobante de reserva en PDF.
          </p>

          <div className="row g-3">
            <div className="col-12 col-md-5">
              <label className="form-label small fw-medium text-dark mb-1" style={{ fontSize: "12px" }}>
                Plantilla para Apertura de Conversación
              </label>
              <select
                className="form-select"
                style={{ borderRadius: "8px", fontSize: "13px" }}
                value={agencySettings.default_open_template_id || ""}
                onChange={(e) =>
                  setAgencySettings((prev) => ({
                    ...prev,
                    default_open_template_id: e.target.value ? Number(e.target.value) : null,
                  }))
                }
              >
                <option value="">-- Sin predeterminar --</option>
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.category})
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-md-5">
              <label className="form-label small fw-medium text-dark mb-1" style={{ fontSize: "12px" }}>
                Plantilla para Envío de Reservación (PDF)
              </label>
              <select
                className="form-select"
                style={{ borderRadius: "8px", fontSize: "13px" }}
                value={agencySettings.default_reservation_template_id || ""}
                onChange={(e) =>
                  setAgencySettings((prev) => ({
                    ...prev,
                    default_reservation_template_id: e.target.value ? Number(e.target.value) : null,
                  }))
                }
              >
                <option value="">-- Sin predeterminar --</option>
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.header_type || "Texto"})
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-md-2 d-flex align-items-end">
              <button
                type="button"
                className="btn btn-primary-custom w-100"
                style={{ borderRadius: "8px", fontSize: "13px", height: "38px" }}
                onClick={handleSaveSettings}
                disabled={savingSettings}
              >
                {savingSettings ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex flex-column gap-3">
        {templates.length === 0 ? (
          <div className="text-center py-5 border rounded bg-white" style={{ borderRadius: "12px" }}>
            <i className="bi bi-chat-square-text text-secondary" style={{ fontSize: "32px" }}></i>
            <p className="mt-2 mb-2 fw-medium text-dark" style={{ fontSize: "14px" }}>
              No tienes plantillas registradas todavía
            </p>
            <p className="small text-muted mb-3" style={{ fontSize: "12px" }}>
              Puedes crearlas manualmente o utilizar el botón &quot;Crear Plantillas Base&quot; para generar las sugeridas.
            </p>
            <button
              type="button"
              className="btn btn-primary-custom btn-sm"
              onClick={handleGenerateDefaults}
              disabled={generatingDefaults}
            >
              Crear Plantillas Base Sugeridas
            </button>
          </div>
        ) : (
          <div className="row g-3">
            {templates.map((t) => {
              const isDefaultOpen = agencySettings.default_open_template_id === t.id;
              const isDefaultReserva = agencySettings.default_reservation_template_id === t.id;

              let buttons = [];
              if (t.buttons) {
                buttons = typeof t.buttons === "string" ? JSON.parse(t.buttons) : t.buttons;
              }

              let varMappings = [];
              if (t.variables_mapping) {
                varMappings =
                  typeof t.variables_mapping === "string"
                    ? JSON.parse(t.variables_mapping)
                    : t.variables_mapping;
              }

              return (
                <div key={t.id} className="col-12 col-lg-6">
                  <div
                    className="card h-100 border shadow-sm transition-smooth"
                    style={{
                      borderRadius: "12px",
                      borderColor: isDefaultOpen || isDefaultReserva ? "#0c5cc6" : "#e2e8f0",
                      backgroundColor: "#ffffff",
                    }}
                  >
                    <div className="card-body p-3 p-md-4 d-flex flex-column">
                      <div className="d-flex align-items-start justify-content-between gap-2 mb-2">
                        <div>
                          <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                            <span className="fw-semibold text-dark font-poppins" style={{ fontSize: "14px" }}>
                              {t.name}
                            </span>
                            <span
                              className="badge"
                              style={{
                                backgroundColor: t.category === "MARKETING" ? "#e0f2fe" : "#ecfdf5",
                                color: t.category === "MARKETING" ? "#0284c7" : "#059669",
                                fontSize: "10px",
                                fontWeight: "600",
                              }}
                            >
                              {t.category}
                            </span>
                            <span
                              className="badge"
                              style={{
                                backgroundColor: "#f1f5f9",
                                color: "#475569",
                                fontSize: "10px",
                              }}
                            >
                              {t.language || "es_MX"}
                            </span>
                          </div>

                          <div className="d-flex align-items-center gap-2">
                            {isDefaultOpen && (
                              <span
                                className="badge bg-primary text-white"
                                style={{ fontSize: "10px", borderRadius: "10px" }}
                              >
                                Default Apertura
                              </span>
                            )}
                            {isDefaultReserva && (
                              <span
                                className="badge bg-success text-white"
                                style={{ fontSize: "10px", borderRadius: "10px" }}
                              >
                                Default Reserva
                              </span>
                            )}
                            {t.header_type && (
                              <span className="badge bg-light text-secondary border" style={{ fontSize: "10px" }}>
                                Encabezado: {t.header_type}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="d-flex align-items-center gap-1">
                          <span
                            className={`badge ${
                              String(t.status).toUpperCase() === "APPROVED"
                                ? "bg-success-subtle text-success border border-success-subtle"
                                : "bg-warning-subtle text-warning-emphasis border border-warning-subtle"
                            }`}
                            style={{ fontSize: "10px" }}
                          >
                            {t.status || "PENDING"}
                          </span>
                        </div>
                      </div>

                      <div
                        className="p-3 my-2 rounded flex-grow-1"
                        style={{
                          backgroundColor: "#f8fafc",
                          fontSize: "13px",
                          lineHeight: "1.5",
                          color: "#334155",
                          border: "1px solid #f1f5f9",
                        }}
                      >
                        {t.body}
                      </div>

                      {buttons && buttons.length > 0 && (
                        <div className="d-flex flex-wrap gap-2 mt-2">
                          {buttons.map((b, idx) => (
                            <span
                              key={idx}
                              className="badge bg-white text-primary border border-primary-subtle py-1 px-2 d-flex align-items-center gap-1"
                              style={{ fontSize: "11px", borderRadius: "6px" }}
                            >
                              <i className="bi bi-reply-fill" style={{ fontSize: "10px" }}></i>
                              {b.text}
                            </span>
                          ))}
                        </div>
                      )}

                      {varMappings && varMappings.length > 0 && (
                        <div className="mt-3 pt-2 border-top">
                          <span className="small text-muted fw-semibold d-block mb-1" style={{ fontSize: "11px" }}>
                            Mapeo de variables:
                          </span>
                          <div className="d-flex flex-wrap gap-1">
                            {varMappings.map((m, idx) => (
                              <span
                                key={idx}
                                className="badge bg-light text-dark border py-1 px-2"
                                style={{ fontSize: "10px" }}
                              >
                                <code>{m.variable}</code> &rarr;{" "}
                                {m.source === "client_name"
                                  ? "Nombre Cliente"
                                  : m.source === "client_phone"
                                  ? "Celular"
                                  : m.source === "client_email"
                                  ? "Correo"
                                  : "Manual"}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ zIndex: 1050, backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content" style={{ borderRadius: "12px", border: "none" }}>
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title font-poppins fw-semibold text-dark" style={{ fontSize: "16px" }}>
                  {editingTemplate ? "Editar Plantilla" : "Nueva Plantilla de WhatsApp"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setModalOpen(false)}
                  aria-label="Cerrar"
                ></button>
              </div>

              <form onSubmit={handleSaveTemplate}>
                <div className="modal-body pt-3">
                  <div className="row g-3">
                    <div className="col-12 col-md-7">
                      <div className="row g-2 mb-3">
                        <div className="col-12 col-sm-6">
                          <label className="form-label small fw-medium text-dark" style={{ fontSize: "12px" }}>
                            Nombre de la plantilla
                          </label>
                          <input
                            type="text"
                            name="name"
                            className="form-control"
                            style={{ borderRadius: "8px", fontSize: "13px" }}
                            placeholder="ej: crm_apertura_default"
                            value={formData.name}
                            onChange={handleFormChange}
                            required
                          />
                        </div>

                        <div className="col-12 col-sm-6">
                          <label className="form-label small fw-medium text-dark" style={{ fontSize: "12px" }}>
                            Categoría
                          </label>
                          <select
                            name="category"
                            className="form-select"
                            style={{ borderRadius: "8px", fontSize: "13px" }}
                            value={formData.category}
                            onChange={handleFormChange}
                          >
                            <option value="MARKETING">Marketing</option>
                            <option value="UTILITY">Utilidad (Utility)</option>
                          </select>
                        </div>
                      </div>

                      <div className="row g-2 mb-3">
                        <div className="col-12 col-sm-6">
                          <label className="form-label small fw-medium text-dark" style={{ fontSize: "12px" }}>
                            Idioma
                          </label>
                          <select
                            name="language"
                            className="form-select"
                            style={{ borderRadius: "8px", fontSize: "13px" }}
                            value={formData.language}
                            onChange={handleFormChange}
                          >
                            <option value="es_MX">Español (México) - es_MX</option>
                            <option value="es">Español - es</option>
                            <option value="en_US">Inglés (US) - en_US</option>
                          </select>
                        </div>

                        <div className="col-12 col-sm-6">
                          <label className="form-label small fw-medium text-dark" style={{ fontSize: "12px" }}>
                            Tipo de Encabezado
                          </label>
                          <select
                            name="headerType"
                            className="form-select"
                            style={{ borderRadius: "8px", fontSize: "13px" }}
                            value={formData.headerType}
                            onChange={handleFormChange}
                          >
                            <option value="NONE">Ninguno (Solo Texto)</option>
                            <option value="DOCUMENT">Documento (PDF)</option>
                            <option value="IMAGE">Imagen</option>
                          </select>
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label small fw-medium text-dark d-flex justify-content-between" style={{ fontSize: "12px" }}>
                          <span>Cuerpo del Mensaje</span>
                          <span className="text-muted">Usa {'{{1}}'}, {'{{2}}'} para variables</span>
                        </label>
                        <textarea
                          name="body"
                          rows="4"
                          className="form-control"
                          style={{ borderRadius: "8px", fontSize: "13px" }}
                          placeholder="Hola {{1}}, gracias por comunicarte..."
                          value={formData.body}
                          onChange={handleFormChange}
                          required
                        ></textarea>
                      </div>

                      {formData.variablesMapping.length > 0 && (
                        <div className="p-3 mb-3 border rounded" style={{ backgroundColor: "#f8fafc", borderRadius: "8px" }}>
                          <label className="small fw-semibold text-dark d-block mb-2" style={{ fontSize: "12px" }}>
                            Mapeo de Variables Detectadas
                          </label>
                          <div className="d-flex flex-column gap-2">
                            {formData.variablesMapping.map((m) => (
                              <div key={m.variable} className="d-flex align-items-center gap-2">
                                <span className="badge bg-secondary font-monospace" style={{ fontSize: "11px" }}>
                                  {m.variable}
                                </span>
                                <select
                                  className="form-select form-select-sm"
                                  style={{ borderRadius: "6px", fontSize: "12px" }}
                                  value={m.source}
                                  onChange={(e) => handleVariableSourceChange(m.variable, e.target.value)}
                                >
                                  <option value="client_name">Nombre del Cliente</option>
                                  <option value="client_phone">Teléfono / Celular</option>
                                  <option value="client_email">Correo Electrónico</option>
                                  <option value="manual">Entrada Manual en Envío</option>
                                </select>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <label className="small fw-medium text-dark mb-0" style={{ fontSize: "12px" }}>
                            Botones de Respuesta Rápida (Opcional, máx 3)
                          </label>
                          {formData.buttons.length < 3 && (
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-primary py-0 px-2"
                              style={{ fontSize: "11px", borderRadius: "4px" }}
                              onClick={handleAddButton}
                            >
                              <i className="bi bi-plus"></i> Agregar Botón
                            </button>
                          )}
                        </div>

                        <div className="d-flex flex-column gap-2">
                          {formData.buttons.map((b, idx) => (
                            <div key={idx} className="input-group input-group-sm">
                              <span className="input-group-text bg-light text-muted" style={{ fontSize: "11px" }}>
                                Botón {idx + 1}
                              </span>
                              <input
                                type="text"
                                className="form-control"
                                style={{ fontSize: "12px" }}
                                value={b.text}
                                onChange={(e) => handleButtonTextChange(idx, e.target.value)}
                                placeholder="Texto del botón"
                                maxLength="25"
                                required
                              />
                              <button
                                type="button"
                                className="btn btn-outline-danger"
                                onClick={() => handleRemoveButton(idx)}
                              >
                                <i className="bi bi-x"></i>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="col-12 col-md-5">
                      <label className="small fw-medium text-dark mb-2" style={{ fontSize: "12px" }}>
                        Previsualización en WhatsApp
                      </label>

                      <div
                        className="p-3 border rounded shadow-sm"
                        style={{
                          backgroundColor: "#efeae2",
                          borderRadius: "12px",
                          minHeight: "260px",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "flex-end",
                        }}
                      >
                        <div
                          className="bg-white p-3 rounded mb-2 shadow-sm position-relative"
                          style={{
                            borderRadius: "10px 10px 10px 0px",
                            maxWidth: "92%",
                            alignSelf: "flex-start",
                          }}
                        >
                          {formData.headerType === "DOCUMENT" && (
                            <div
                              className="p-2 mb-2 rounded bg-light border d-flex align-items-center gap-2"
                              style={{ fontSize: "11px", color: "#64748b" }}
                            >
                              <i className="bi bi-file-earmark-pdf-fill text-danger" style={{ fontSize: "18px" }}></i>
                              <div className="text-truncate">
                                <strong>Comprobante.pdf</strong>
                                <div style={{ fontSize: "9px" }}>1 pág · Documento</div>
                              </div>
                            </div>
                          )}

                          <div style={{ fontSize: "13px", color: "#111b21", whiteSpace: "pre-wrap", lineHeight: "1.4" }}>
                            {previewBody}
                          </div>

                          <div className="text-end mt-1" style={{ fontSize: "10px", color: "#667781" }}>
                            12:00 p.m. <i className="bi bi-check2-all text-primary ms-1"></i>
                          </div>
                        </div>

                        {formData.buttons.map((b, idx) => (
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
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-0">
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => setModalOpen(false)}
                    disabled={savingTemplate}
                    style={{ borderRadius: "8px", fontSize: "13px" }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary-custom"
                    disabled={savingTemplate}
                    style={{ borderRadius: "8px", fontSize: "13px" }}
                  >
                    {savingTemplate ? "Guardando..." : "Guardar Plantilla"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
