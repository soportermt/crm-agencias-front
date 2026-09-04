import React from "react";

export default function StatusBadge({ status }) {
  let bg = "rgba(0, 0, 0, 0.05)";
  let color = "rgba(0, 0, 0, 0.5)";
  let dotBg = "rgba(0, 0, 0, 0.3)";

  if (status === "Nuevo") {
    bg = "rgba(22, 163, 74, 0.1)";
    color = "#16a34a";
    dotBg = "#16a34a";
  } else if (status === "Proceso" || status === "venta") {
    bg = "rgba(245, 158, 11, 0.1)";
    color = "#f59e0b";
    dotBg = "#f59e0b";
  } else if (status === "Cerrado" || status === "Vencido") {
    bg = "rgba(220, 38, 38, 0.1)";
    color = "#dc2626";
    dotBg = "#dc2626";
  } else if (status === "Activo" || status === "Pagado") {
    bg = "rgba(20, 186, 109, 0.1)"; // Light #14BA6D
    color = "#037847";
    dotBg = "#14BA6D";
  } else if (status === "Pendiente") {
    bg = "rgba(58, 134, 255, 0.1)";
    color = "#3A86FF";
    dotBg = "#3A86FF";
  } else if (status === "Inactivo" || status === "Vigente") {
    bg = "rgba(71, 71, 71, 0.08)";
    color = "#475569";
    dotBg = "#475569";
  } else if (status === "Próximo a vencer") {
    bg = "rgba(255, 145, 0, 0.1)";
    color = "#EF6905";
    dotBg = "#EF6905";
  }

  return (
    <span
      className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill"
      style={{ backgroundColor: bg, color, fontSize: "12px", fontWeight: "600" }}
    >
      <span
        style={{
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          backgroundColor: dotBg,
        }}
      ></span>
      {status}
    </span>
  );
}
