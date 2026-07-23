"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ServiceSummaryCard({ service, data, onEdit, onRemove }) {
  const { hotel, destino, dateStart, dateEnd, precio } = service.summary(data);

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
    <div className="card service-summary-card mb-2" style={{ backgroundColor: "#F2F2F2", border: "none" }}>
      <div className="card-body row p-2">
        {/* <span className="service-summary-badge">{service.nombre}</span> */}
        <div className="col-md-6">
          <div className="d-flex align-items-center gap-2">
            <div style={{ color: "rgba(0, 0, 0, 0.1)", fontSize: 48 }}>
              <FontAwesomeIcon icon={service.icon} />
            </div>
            <div style={{fontSize: 14, lineHeight: "normal", fontWeight: 500}}>
              <p className="mb-0">{hotel}</p>
              <p className="m-0">{destino}</p>
              {dateRangeLabel && (
                <div className="small text-muted mt-1">Fecha del servicio: <span style={{fontWeight: 600}}>{dateRangeLabel}</span></div>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="text-end">
            <div className="d-flex gap-1 justify-content-end">
              <button type="button" className="btn btn-sm btn-icon" onClick={onEdit} title="Editar">
                <i className="bi bi-pencil" />
              </button>
              <button type="button" className="btn btn-sm btn-icon text-danger" onClick={onRemove} title="Quitar">
                <i className="bi bi-trash" />
              </button>
            </div>
            {precio != null && (
              <div className="fw-semibold mb-2">
                {new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(precio)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}