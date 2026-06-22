import React from "react";

export default function StatusBadge({ status }) {
  let bg = "bg-light";
  let text = "text-secondary";
  let dotBg = "rgba(0, 0, 0, 0.3)";

  if (status === "Nuevo") {
    bg = "rgba(22, 163, 74, 0.1)";
    text = "text-success";
    dotBg = "#16a34a";
  } else if (status === "Proceso") {
    bg = "rgba(245, 158, 11, 0.1)";
    text = "text-warning";
    dotBg = "#f59e0b";
  } else if (status === "Cerrado") {
    bg = "rgba(220, 38, 38, 0.1)";
    text = "text-danger";
    dotBg = "#dc2626";
  }

  return (
    <span
      className={`d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill ${text}`}
      style={{ backgroundColor: bg, fontSize: "12px", fontWeight: "600" }}
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
