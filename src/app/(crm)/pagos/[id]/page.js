"use client";

import React, { useState } from "react";
import PagoDetailCard from "@/components/pagos/PagoDetailCard";
import PagoHistorialTable from "@/components/pagos/PagoHistorialTable";
import PagoRegistroModal from "@/components/pagos/PagoRegistroModal";
import {
  pagosDetailMock,
  pagosHistorialMock,
  pagosDesgloseMock,
  pagoServiciosMock,
} from "@/mocks/pagosMock";

export default function PagoDetailPage() {
  const [showModal, setShowModal] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: "2026-05-01",
    endDate: "2026-12-31",
  });

  const parseSpanishDate = (dateStr) => {
    if (!dateStr) return null;
    const months = {
      "ene.": 0, "feb.": 1, "mar.": 2, "abr.": 3, "may.": 4, "jun.": 5,
      "jul.": 6, "ago.": 7, "sep.": 8, "oct.": 9, "nov.": 10, "dic.": 11,
      "ene": 0, "feb": 1, "mar": 2, "abr": 3, "may": 4, "jun": 5,
      "jul": 6, "ago": 7, "sep": 8, "oct": 9, "nov": 10, "dic": 11
    };
    const cleanStr = dateStr.replace(/de\s+/g, "").trim().toLowerCase();
    const parts = cleanStr.split(/\s+/);
    if (parts.length < 3) return null;
    const day = parseInt(parts[0], 10);
    const month = months[parts[1]] ?? 0;
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
  };

  const filteredHistorial = pagosHistorialMock.filter((row) => {
    const rowDate = parseSpanishDate(row.fechaPago);
    const start = new Date(dateRange.startDate);
    const end = new Date(dateRange.endDate);
    end.setHours(23, 59, 59, 999);

    return !rowDate || (rowDate >= start && rowDate <= end);
  });

  return (
    <div className="container-fluid p-0 d-flex flex-column gap-4">
      <PagoDetailCard
        pago={pagosDetailMock}
        onAddPayment={() => setShowModal(true)}
      />

      <PagoHistorialTable
        data={filteredHistorial}
        desglose={pagosDesgloseMock}
        startDate={dateRange.startDate}
        endDate={dateRange.endDate}
        onDateRangeChange={setDateRange}
      />

      <PagoRegistroModal
        show={showModal}
        onClose={() => setShowModal(false)}
        servicios={pagoServiciosMock}
      />
    </div>
  );
}
