"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

export default function ServiceSummaryCard({ service, data, onEdit, onRemove }) {
  // const { hotel, destino, dateStart, dateEnd, precio } = service.summary(data);
  const [showConfirm, setShowConfirm] = useState(false);

  const summaryData = service.summary ? service.summary(data) : {};
  const { title, subtitle, dateStart, dateEnd, precio } = summaryData;

  function formatDate(date) {
    if (!date) return "";
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return "";

    return d.toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  const dateRangeLabel =
    dateStart && dateEnd
      ? `${formatDate(dateStart)} a ${formatDate(dateEnd)}`
      : dateStart
        ? formatDate(dateStart)
        : null;

  return (
    <>
      <div className="card service-summary-card mb-2" style={{ backgroundColor: "#F2F2F2", border: "none" }}>
        <div className="card-body row p-2">
          <div className="col-md-8">
            <div className="d-flex align-items-center gap-2">
              <div style={{ color: "rgba(0, 0, 0, 0.1)", fontSize: 48 }}>
                <FontAwesomeIcon icon={service.icon} />
              </div>
              <div style={{ fontSize: 14, lineHeight: "normal", fontWeight: 500 }}>
                {title && <p className="mb-0 fw-bold">{title}</p>}
                {subtitle && <p className="m-0 text-muted">{subtitle}</p>}

                {dateRangeLabel && (
                  <div className="small text-muted mt-1">
                    Fecha: <span style={{ fontWeight: 600 }}>{dateRangeLabel}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="text-end">
              <div className="d-flex gap-1 justify-content-end mb-2">
                <button type="button" className="btn btn-sm btn-icon" onClick={onEdit} title="Editar">
                  <i className="bi bi-pencil" />
                </button>
                <button type="button" className="btn btn-sm btn-icon text-danger" onClick={() => setShowConfirm(true)} title="Quitar">
                  <i className="bi bi-trash" />
                </button>
              </div>
              {precio != null && precio !== "" && (
                <div className="fw-semibold">
                  {new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(precio)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showConfirm && (
        <div
          className="d-flex justify-content-center align-items-center"
          onClick={() => setShowConfirm(false)} 
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1050
          }}
        >
          <div
            className="card shadow-lg p-3"
            onClick={(e) => e.stopPropagation()} 
            style={{ maxWidth: "350px", width: "90%", border: "none", borderRadius: "12px" }}
          >
            <h5 className="fw-bold mb-2">¿Quitar servicio?</h5>
            <p className="text-muted mb-2" style={{ fontSize: "14px" }}>
              ¿Estás seguro de que deseas eliminar este servicio de tu lista?
            </p>
            <div className="d-flex justify-content-end gap-2">
              <button
                className="btn btn-light"
                onClick={() => setShowConfirm(false)}
              >
                Cancelar
              </button>
              <button
                className="btn btn-danger"
                onClick={() => {
                  setShowConfirm(false); 
                  onRemove();
                }}
              >
                Sí, quitar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}