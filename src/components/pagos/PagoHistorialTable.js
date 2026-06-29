import React, { useState } from "react";
import DataTable from "@/components/common/DataTable";
import SearchBar from "@/components/common/SearchBar";
import ExportButton from "@/components/common/ExportButton";
import DateRangeSelector from "@/components/common/DateRangeSelector";

export default function PagoHistorialTable({
  data,
  desglose,
  startDate,
  endDate,
  onDateRangeChange,
}) {
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 5;

  const filteredData = data.filter(
    (row) =>
      row.folio.toLowerCase().includes(searchValue.toLowerCase()) ||
      row.fechaPago.toLowerCase().includes(searchValue.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const columns = [
    { key: "folio", label: "Folio de pago", width: "220px" },
    { key: "fechaPago", label: "Fecha de pago", width: "220px" },
    { key: "pago", label: "Pago", width: "220px" },
    { key: "moneda", label: "Moneda", width: "220px" },
    { key: "acciones", label: "Acciones", width: "220px" },
  ];

  const renderCell = (key, row) => {
    switch (key) {
      case "folio":
        return (
          <span className="font-inter fw-semibold" style={{ color: "#0c5cc6" }}>
            {row.folio}
          </span>
        );
      case "acciones":
        return (
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="text-decoration-none fw-semibold"
            style={{ color: "#0c5cc6", fontSize: "13px" }}
          >
            Ver comprobante
          </a>
        );
      default:
        return row[key];
    }
  };

  return (
    <div className="bg-white shadow-premium" style={{ borderRadius: "12px", padding: "16px" }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3
          className="font-inter fw-medium mb-0"
          style={{ fontSize: "18px", color: "#0f1901" }}
        >
          Historial de pagos
        </h3>
        <ExportButton onExport={() => console.log("Exportar historial")} />
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center gap-2">
          <DateRangeSelector
            startDate={startDate}
            endDate={endDate}
            onChange={onDateRangeChange}
            showIcon={false}
          />
          <button
            className="btn d-flex align-items-center gap-2 border bg-white"
            style={{
              height: "38px",
              borderRadius: "8px",
              borderColor: "#d0d5dd",
              fontSize: "13px",
              color: "#0f1901",
              padding: "0 16px",
            }}
          >
            Activos
          </button>
        </div>
        <SearchBar
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Buscar"
          width="300px"
        />
      </div>

      <DataTable
        columns={columns}
        data={paginatedData}
        renderCell={renderCell}
        pagination={true}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredData.length}
        onPageChange={setCurrentPage}
        emptyMessage="No se encontraron pagos."
        minWidth="900px"
      />

      {desglose && (
        <div className="d-flex justify-content-end mt-3">
          <div style={{ width: "300px" }}>
            <h4
              className="font-inter fw-medium mb-2"
              style={{ fontSize: "18px", color: "#0f1901" }}
            >
              Desglose de pagos
            </h4>
            <div className="d-flex flex-column gap-2">
              <div className="d-flex justify-content-between font-inter">
                <span style={{ fontSize: "12px", color: "#0f1901" }}>Total</span>
                <span style={{ fontSize: "16px", color: "#0f1901" }}>{desglose.total}</span>
              </div>
              <div className="d-flex justify-content-between font-inter">
                <span style={{ fontSize: "12px", color: "#0f1901" }}>Pagado</span>
                <span style={{ fontSize: "16px", color: "#0f1901" }}>{desglose.pagado}</span>
              </div>
              <hr className="my-1" />
              <div className="d-flex justify-content-between font-inter">
                <span style={{ fontSize: "12px", color: "#0f1901" }}>Saldo</span>
                <span
                  className="font-inter fw-semibold"
                  style={{ fontSize: "24px", color: "#0c5cc6" }}
                >
                  {desglose.saldo}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
