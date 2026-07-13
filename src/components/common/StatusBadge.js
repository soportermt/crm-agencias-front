import React from "react";

export default function StatusBadge({ status }) {
  let bg = "rgba(0, 0, 0, 0.05)";
  let color = "rgba(0, 0, 0, 0.5)";
  let dotBg = "rgba(0, 0, 0, 0.3)";

  if (status === "Nuevo") {
    bg = "rgba(22, 163, 74, 0.1)";
    color = "#16a34a";
    dotBg = "#16a34a";
  } else if (status === "Proceso") {
    bg = "rgba(245, 158, 11, 0.1)";
    color = "#f59e0b";
    dotBg = "#f59e0b";
  } else if (status === "Cerrado") {
    bg = "rgba(220, 38, 38, 0.1)";
    color = "#dc2626";
    dotBg = "#dc2626";
  } else if (status === "Activo" || status === "Pagado") {
    bg = "#ecfdf3";
    color = "#037847";
    dotBg = "#037847";
  } else if (status === "Pendiente") {
    bg = "rgba(245, 158, 11, 0.1)";
    color = "#b9861f";
    dotBg = "#b9861f";
  } else if (status === "Vencido") {
    bg = "rgba(175, 35, 58, 0.1)";
    color = "#af233a";
    dotBg = "#af233a";
  } else if (status === "Inactivo" || status === "Vigente") {
    bg = "rgba(71, 71, 71, 0.08)";
    color = "#475569";
    dotBg = "#475569";
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
