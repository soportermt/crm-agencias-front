"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { pdf } from "@react-pdf/renderer";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import es from "react-phone-input-2/lang/es.json";
import PagoPDF from "@/components/pdf/PagoPDF";
import { templatesService } from "@/services/templates.service";
import {
  PURPOSE_RECIBO,
  getSendBlockedReason,
  getWhatsappCredentialsStatus,
  resolveTemplate,
  sendPdfViaWhatsapp,
} from "@/utils/whatsappReceipt";

const money = (value) =>
  Number(value || 0).toLocaleString("es-MX", { style: "currency", currency: "MXN" });

export default function EnviarReciboWhatsappModal({
  show,
  onClose,
  venta,
  pagos,
  agencia,
  pago,
}) {
  const [loading, setLoading] = useState(true);
  const [connection, setConnection] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [agencySettings, setAgencySettings] = useState(null);
  const [phone, setPhone] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);

  const cargarDatos = useCallback(async () => {
    setLoading(true);
    setResult(null);

    const [connectionStatus, templatesRes, settingsRes] = await Promise.all([
      getWhatsappCredentialsStatus(),
      templatesService.getTemplates().catch(() => []),
      templatesService.getAgencySettings().catch(() => null),
    ]);

    setConnection(connectionStatus);
    setTemplates(Array.isArray(templatesRes) ? templatesRes : templatesRes?.data || []);
    setAgencySettings(settingsRes || null);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!show) return;
    const telefonoCliente = venta?.idCliente?.telefono || venta?.idCliente?.celular || "";
    setPhone(String(telefonoCliente).replace(/\D/g, ""));
    cargarDatos();
  }, [show, venta, cargarDatos]);

  const template = useMemo(
    () => resolveTemplate({ templates, agencySettings, purpose: PURPOSE_RECIBO }),
    [templates, agencySettings]
  );

  const pagosActivos = useMemo(
    () => (pagos || []).filter((p) => String(p.estatus) === "1"),
    [pagos]
  );

  const totalPagos = useMemo(
    () =>
      pagosActivos.reduce(
        (acc, item) =>
          acc +
          (item.pagosDetalles || []).reduce((sum, detalle) => sum + Number(detalle.monto || 0), 0),
        0
      ),
    [pagosActivos]
  );

  const blockedReason = getSendBlockedReason({ connection, template, phone });
  const puedeEnviar = !loading && !sending && !blockedReason;

  const handleEnviar = async () => {
    if (blockedReason) {
      setResult({ success: false, message: blockedReason });
      return;
    }

    setSending(true);
    setResult(null);

    try {
      const folio = venta?.folio || venta?.id_venta || "venta";
      const nombreArchivo = `Recibo-Pagos-${String(folio).replace(/[^\w-]+/g, "_")}.pdf`;
      const blob = await pdf(
        <PagoPDF pagos={pagos} venta={venta} agencia={agencia} />
      ).toBlob();

      const res = await sendPdfViaWhatsapp({
        blob,
        fileName: nombreArchivo,
        folio,
        clientId: venta?.id_cliente || venta?.idCliente?.id_cliente,
        clientName: venta?.idCliente?.nombre || "Cliente",
        phone,
        email: venta?.idCliente?.correo || "",
        template,
        purpose: PURPOSE_RECIBO,
      });

      if (res?.success === false) {
        setResult({ success: false, message: res.message || "No se pudo enviar el recibo." });
      } else if (res?.delivered === false) {
        setResult({
          success: false,
          message: res.apiMessage || res.message || "WhatsApp no pudo entregar el recibo.",
        });
      } else {
        setResult({
          success: true,
          message: `Recibo enviado por WhatsApp a ${res.toPhone || phone}.`,
        });
      }
    } catch (error) {
      console.error("Error al enviar el recibo por WhatsApp:", error);
      setResult({
        success: false,
        message:
          error?.response?.data?.message ||
          error?.message ||
          "No fue posible conectar con el servicio de mensajería.",
      });
    } finally {
      setSending(false);
    }
  };

  if (!show || typeof document === "undefined") return null;

  return createPortal(
    <>
      <div className="modal-backdrop fade show" style={{ zIndex: 2000 }} />
      <div
        className="modal fade show d-block"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        style={{ zIndex: 2001 }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content" style={{ borderRadius: 12 }}>
            <div className="modal-body p-4">
              <div className="d-flex align-items-start justify-content-between mb-3">
                <div>
                  <h5 className="mb-1">Enviar recibo por WhatsApp</h5>
                  <p className="mb-0" style={{ fontSize: 13, color: "#6E6B7B" }}>
                    Se adjunta el PDF del recibo de pagos automáticamente.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  onClick={onClose}
                  disabled={sending}
                  aria-label="Cerrar"
                />
              </div>

              <div
                className="p-3 mb-3"
                style={{ backgroundColor: "#F5F8FF", borderRadius: 8, fontSize: 13, color: "#5E5873" }}
              >
                <div className="d-flex justify-content-between mb-1">
                  <span>Cliente:</span>
                  <strong>{venta?.idCliente?.nombre || "—"}</strong>
                </div>
                <div className="d-flex justify-content-between mb-1">
                  <span>Folio:</span>
                  <strong>{venta?.folio || "—"}</strong>
                </div>
                <div className="d-flex justify-content-between mb-1">
                  <span>Total en pagos:</span>
                  <strong>{money(totalPagos)}</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Plantilla:</span>
                  <strong>{template?.name || "Sin configurar"}</strong>
                </div>
                {pago?.id_pago && (
                  <div className="d-flex justify-content-between mt-1">
                    <span>Pago recién registrado:</span>
                    <strong>#{pago.id_pago}</strong>
                  </div>
                )}
              </div>

              {loading ? (
                <div className="text-center py-3">
                  <span className="spinner-border spinner-border-sm text-primary me-2" />
                  <span style={{ fontSize: 13, color: "#6E6B7B" }}>
                    Verificando credenciales de WhatsApp...
                  </span>
                </div>
              ) : (
                <>
                  {blockedReason && (
                    <div
                      className="alert alert-warning py-2 px-3 mb-3"
                      style={{ fontSize: 12, borderRadius: 8 }}
                    >
                      {blockedReason}
                    </div>
                  )}

                  <label className="form-label" style={{ fontSize: 13, fontWeight: 500, color: "#5E5873" }}>
                    Número destino
                  </label>
                  <PhoneInput
                    country={"mx"}
                    enableSearch={true}
                    searchPlaceholder="Buscar país..."
                    searchNotFound="País no encontrado"
                    localization={es}
                    countryCodeEditable={false}
                    value={phone}
                    onChange={(value) => {
                      setPhone(value || "");
                      setResult(null);
                    }}
                    disabled={sending}
                    inputClass="form-control input-custom"
                    containerClass="w-100"
                    inputStyle={{
                      paddingLeft: "48px",
                      height: "43px",
                      borderRadius: "12px",
                      border: "1px solid var(--border-color)",
                      width: "100%",
                      fontSize: "14px",
                    }}
                    buttonStyle={{
                      borderRadius: "12px 0 0 12px",
                      backgroundColor: "transparent",
                      border: "none",
                      paddingLeft: "8px",
                    }}
                    dropdownStyle={{ zIndex: 2060, borderRadius: "12px" }}
                  />

                  {result && (
                    <div
                      className="mt-3"
                      style={{
                        fontSize: 13,
                        color: result.success ? "#28C76F" : "#EA5455",
                      }}
                    >
                      {result.message}
                    </div>
                  )}
                </>
              )}

              <div className="d-flex gap-2 mt-4">
                <button
                  type="button"
                  className="btn btn-outline-secondary w-50"
                  onClick={onClose}
                  disabled={sending}
                >
                  Cerrar
                </button>
                <button
                  type="button"
                  className="btn w-50 text-white"
                  style={{ backgroundColor: "#25D366", borderColor: "#25D366" }}
                  onClick={handleEnviar}
                  disabled={!puedeEnviar}
                >
                  {sending ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                      Enviando...
                    </>
                  ) : (
                    "Enviar recibo"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
