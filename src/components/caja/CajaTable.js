import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import DatePicker, { registerLocale } from "react-datepicker";
import { es } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import DataTable from "../common/DataTable";
import SearchBar from "../common/SearchBar";
import ExportButton from "../common/ExportButton";

registerLocale("es", es);

const ITEMS_PER_PAGE = 10;

const COLUMNS = [
  { key: "folio", label: "Folio", width: "180px" },
  { key: "fecha", label: "Fecha de venta", width: "180px" },
  { key: "pasajero_titular", label: "Pasajero titular", width: "225px" },
  { key: "descripcion", label: "Descripción", width: "225px" },
  { key: "cliente", label: "Cliente", width: "225px" },
  { key: "usuario", label: "Usuario", width: "225px" },
  { key: "vendedor", label: "Vendedor", width: "180px" },
  { key: "acciones", label: "Acciones", width: "80px" },
];

const SELECT_STYLE = {
  height: "30px",
  borderRadius: "8px",
  borderColor: "#d0d5dd",
  backgroundColor: "#fff",
  fontSize: "13px",
  color: "#0f1901",
  fontWeight: 400,
  appearance: "none",
  textAlign: "start",
  width: "100%",
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
};

const parseFecha = (dateStr) => {
  if (!dateStr || dateStr === "0000-00-00") return null;
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
};

const normalize = (text) =>
  String(text ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

function exportToCSV(data) {
  if (!data.length) return;

  const headers = [
    "Folio",
    "Fecha de venta",
    "Pasajero titular",
    "Descripción",
    "Cliente",
    "Usuario",
    "Vendedor",
  ];

  const rows = data.map((row) => [
    row.folio,
    formatDate(row.fecha),
    row.pasajero_titular,
    row.descripcion,
    row.cliente,
    row.usuario,
    row.vendedor,
  ]);

  const escapeCsvValue = (value) => {
    const str = String(value ?? "");
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const csvContent = [headers, ...rows]
    .map((r) => r.map(escapeCsvValue).join(","))
    .join("\n");

  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `caja_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function CajaTable({ ventas = [] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [clienteFilter, setClienteFilter] = useState("");
  const [vendedorFilter, setVendedorFilter] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const rows = useMemo(
    () =>
      ventas.map((v) => ({
        id_venta: v.id_venta,
        id_cliente: v.id_cliente,
        id_vendedor: v.id_vendedor,
        folio: v.folio,
        fecha: v.fecha,
        descripcion: v.descripcion || "—",
        usuario: v.usuario_nombre ?? "—",
        cliente: v.idCliente?.nombre ?? "—",
        vendedor: v.vendedor_nombre ?? `Vendedor #${v.id_vendedor}`,
        pasajero_titular: v.pasajero_titular ?? "—",
      })),
    [ventas]
  );

  const clientes = useMemo(() => {
    const map = new Map();
    rows.forEach((r) => map.set(r.id_cliente, r.cliente));
    return [...map].map(([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name));
  }, [rows]);

  const vendedores = useMemo(() => {
    const map = new Map();
    rows.forEach((r) => map.set(r.id_vendedor, r.vendedor));
    return [...map].map(([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name));
  }, [rows]);

  const filteredData = useMemo(() => {
    const search = normalize(searchValue.trim());
    const from = startDate ? new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()) : null;
    const to = endDate ? new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59) : null;

    return rows.filter((r) => {
      if (clienteFilter && String(r.id_cliente) !== clienteFilter) return false;
      if (vendedorFilter && String(r.id_vendedor) !== vendedorFilter) return false;

      if (from || to) {
        const fecha = parseFecha(r.fecha);
        if (!fecha) return false;
        if (from && fecha < from) return false;
        if (to && fecha > to) return false;
      }

      if (search) {
        const haystack = normalize(
          [r.folio, r.cliente, r.pasajero_titular, r.descripcion, r.vendedor, r.usuario].join(" ")
        );
        if (!haystack.includes(search)) return false;
      }

      return true;
    });
  }, [rows, searchValue, clienteFilter, vendedorFilter, startDate, endDate]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue, clienteFilter, vendedorFilter, startDate, endDate]);

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const renderCell = (key, row) => {
    switch (key) {
      case "folio":
        return (
          <Link
            className="font-inter fw-semibold text-brand-blue"
            style={{ textDecoration: "none" }}
            href={`/reservaciones/editar/${row.id_venta}`}
            target="_blank"
          >
            {row.folio}
          </Link>
        );

      case "fecha":
        return <span className="font-inter fw-semibold">{formatDate(row.fecha)}</span>;

      case "acciones":
        return (
          <Link
            href={`/pagos/${row.id_venta}`}
            className="text-decoration-none fw-medium text-brand-blue"
            style={{ fontSize: "12px" }}
          >
            Ver
          </Link>
        );

      default:
        return row[key];
    }
  };

  return (
    <div className="mt-3">
      <div className="d-flex flex-column flex-lg-row justify-content-between gap-3 mb-3">
        <div className="d-flex gap-2">
          <div className="col-md-4">
            <select
              name="clientes"
              className="btn d-flex align-items-center justify-content-center gap-2 border transition-smooth px-3"
              style={SELECT_STYLE}
              value={clienteFilter}
              onChange={(e) => setClienteFilter(e.target.value)}
            >
              <option value="">Todos los clientes</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <select
              name="vendedores"
              className="btn d-flex align-items-center justify-content-center gap-2 border transition-smooth px-3"
              style={SELECT_STYLE}
              value={vendedorFilter}
              onChange={(e) => setVendedorFilter(e.target.value)}
            >
              <option value="">Todos los vendedores</option>
              {vendedores.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <DatePicker
              selectsRange
              startDate={startDate}
              endDate={endDate}
              onChange={handleDateChange}
              isClearable
              placeholderText="Fecha de venta"
              locale="es"
              dateFormat="dd/MM/yyyy"
              className="form-control form-control-sm"
              autoComplete="off"
            />
          </div>
        </div>

        <div className="d-flex gap-2">
          <SearchBar
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Buscar por folio, cliente, pasajero"
            width="300px"
          />
          <ExportButton
            onExport={() => exportToCSV(filteredData)}
            disabled={filteredData.length === 0}
          />
        </div>
      </div>

      <DataTable
        columns={COLUMNS}
        data={paginatedData}
        renderCell={renderCell}
        pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={setCurrentPage}
        emptyMessage="No se encontraron ventas"
        minWidth="900px"
      />
    </div>
  );
}