import React from "react";

export default function OperadoresSummary({ porOperadorData = [], estadoCuentasData = [] }) {
  return (
    <div className="d-flex gap-4 w-100 flex-wrap flex-md-nowrap">
      <div className="bg-white p-3 border rounded-3 flex-fill" style={{ borderColor: "rgba(161, 161, 170, 0.35)", minWidth: "280px" }}>
        <p className="font-inter fw-semibold mb-3 text-dark" style={{ fontSize: "16px" }}>
          Por operador
        </p>
        <div className="d-flex flex-column gap-3">
          {porOperadorData.map((item, idx) => (
            <div key={idx} className="d-flex flex-column gap-1">
              <div className="d-flex justify-content-between font-inter text-dark" style={{ fontSize: "14px" }}>
                <span>{item.name}</span>
                <span className="fw-medium">{item.amount}</span>
              </div>
              <div className="w-full position-relative rounded-pill" style={{ height: "8px", backgroundColor: "rgba(97, 158, 5, 0.15)" }}>
                <div className="h-100 rounded-pill" style={{ width: `${item.pct}%`, backgroundColor: "#619e05" }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-3 border rounded-3 flex-fill" style={{ borderColor: "rgba(161, 161, 170, 0.35)", minWidth: "280px" }}>
        <p className="font-inter fw-semibold mb-3 text-dark" style={{ fontSize: "16px" }}>
          Estado de cuentas
        </p>
        <div className="d-flex flex-column gap-2 font-inter" style={{ fontSize: "13px" }}>
          <div className="d-flex justify-content-between text-muted fw-medium pb-2 border-bottom">
            <span>Operador</span>
            <div className="d-flex gap-4 ms-auto">
              <span style={{ width: "90px", textAlign: "right" }}>Pagado</span>
              <span style={{ width: "90px", textAlign: "right" }}>Pendiente</span>
            </div>
          </div>
          {estadoCuentasData.map((item, idx) => (
            <div key={idx} className="d-flex justify-content-between align-items-center py-1">
              <span className="fw-medium text-dark">{item.name}</span>
              <div className="d-flex gap-4 ms-auto">
                <span className="fw-medium text-success" style={{ width: "90px", textAlign: "right" }}>{item.paid}</span>
                <span className="fw-medium" style={{ width: "90px", textAlign: "right", color: item.pendingColor }}>{item.pending}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
