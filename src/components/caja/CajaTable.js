import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import DatePicker, { registerLocale } from "react-datepicker";
import { es } from "date-fns/locale";
import {
  startOfDay, endOfDay, subDays,
  startOfWeek, endOfWeek, subWeeks,
  startOfMonth, endOfMonth, subMonths,
} from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import DataTable from "../common/DataTable";
import SearchBar from "../common/SearchBar";
import ExportButton from "../common/ExportButton";
import { catalogosService } from "@/services/catalogos.service";
import { vendedoresService } from "@/services/vendedores.service";
import { EyeIcon } from "@heroicons/react/24/outline";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faHotel, faMap, faPlaneDeparture, faVanShuttle } from "@fortawesome/free-solid-svg-icons";

registerLocale("es", es);

const WEEK = { weekStartsOn: 1 };

const PRESETS = [
  { label: "Hoy", range: () => [startOfDay(new Date()), endOfDay(new Date())] },
  {
    label: "Ayer",
    range: () => {
      const d = subDays(new Date(), 1);
      return [startOfDay(d), endOfDay(d)];
    },
  },
  {
    label: "Últimos 7 días",
    range: () => [startOfDay(subDays(new Date(), 6)), endOfDay(new Date())],
  },
  {
    label: "Esta semana",
    range: () => [startOfWeek(new Date(), WEEK), endOfWeek(new Date(), WEEK)],
  },
  {
    label: "Semana pasada",
    range: () => {
      const d = subWeeks(new Date(), 1);
      return [startOfWeek(d, WEEK), endOfWeek(d, WEEK)];
    },
  },
  {
    label: "Este mes",
    range: () => [startOfMonth(new Date()), endOfMonth(new Date())],
  },
  {
    label: "Mes pasado",
    range: () => {
      const d = subMonths(new Date(), 1);
      return [startOfMonth(d), endOfMonth(d)];
    },
  },
];


const ITEMS_PER_PAGE = 10;

const COLUMNS = [
  { key: "folio", label: "Folio", width: "100px" },
  { key: "servicios", label: "Servicios", width: "130px" },
  { key: "fecha", label: "Fecha de venta", width: "130px" },
  // { key: "pasajero_titular", label: "Pasajero titular", width: "225px" },
  { key: "cliente", label: "Cliente", width: "180px" },
  // { key: "usuario", label: "Usuario", width: "225px" },
  { key: "vendedor", label: "Vendedor", width: "180px" },
  { key: "saldo", label: "Saldo a pagar", align: "end", width: "120px" },
  { key: "acciones", label: "Acciones", width: "80px", align: "center" },
];

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
const ICONOS_SERVICIOS = {
  1: faHotel,
  2: faVanShuttle,
  5: faMap,
  6: faPlaneDeparture,
  10: faCirclePlus,
};
const ICONO_DEFAULT = faCirclePlus;

export default function CajaTable({ ventas = [], filters, onFiltersChange }) {
  const {
    startDate,
    endDate,
    cliente: clienteFilter,
    vendedor: vendedorFilter,
  } = filters;

  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [clientes, setClientes] = useState([]);
  const [vendedores, setVendedores] = useState([]);

  const pickerRef = useRef(null);
  const applyPreset = (preset) => {
    handleDateChange(preset.range());
    pickerRef.current?.setOpen(false);
  };

  const setFilter = (patch) => onFiltersChange((prev) => ({ ...prev, ...patch }));

  const handleDateChange = ([start, end]) => setFilter({ startDate: start, endDate: end });

  const rows = useMemo(
    () =>
      ventas.map((v) => {
        const servicios = Array.from(
          new Map(
            (v.ventasServicioses ?? []).map((s) => [
              String(s.id_tipo_servicio),
              {
                id: s.id_tipo_servicio,
                nombre: s.idTipoServicio?.tipo_servicio ?? "Servicio",
              },
            ])
          ).values()
        );

        return {
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
          servicios,
          saldo: v.saldo,
          moneda: v.moneda ?? "MXN",
          _raw: v,
        };
      }),
    [ventas]
  );

  useEffect(() => {
    let cancelado = false;
    async function cargarClientes() {
      try {
        const data = await catalogosService.clientes();
        if (!cancelado) setClientes(data || []);
      } catch (err) {
        console.error("Error al cargar catálogo de clientes:", err);
      }
    }

    async function loadVendedores() {
      try {
        const vendedores = await vendedoresService.get();
        setVendedores(vendedores);
      } catch (err) {
        console.error(err);
      }
    }

    loadVendedores();
    cargarClientes();
    return () => { cancelado = true; };
  }, []);

  const filteredData = useMemo(() => {
    const search = normalize(searchValue.trim());
    if (!search) return rows;

    return rows.filter((r) =>
      normalize(
        [r.folio, r.cliente, r.pasajero_titular, r.descripcion, r.vendedor, r.usuario].join(" ")
      ).includes(search)
    );
  }, [rows, searchValue]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue, clienteFilter, vendedorFilter, startDate, endDate]);

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const formatMoney = (value) => {
    const num = Number(value || 0);
    return num.toLocaleString("es-MX", {
        style: "currency",
        currency: "MXN",
    });
};

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

      case "servicios":
        return <div className="d-flex align-items-center gap-2">
          {row.servicios.length === 0 ? (
            <span>—</span>
          ) : (
            row.servicios.map((s) => (
              <span key={s.id} title={s.nombre} className="text-brand-blue" style={{ fontSize: 18 }}>
                <FontAwesomeIcon icon={ICONOS_SERVICIOS[s.id] ?? ICONO_DEFAULT} />
              </span>
            ))
          )}
        </div>;

      case "saldo":
        return <span className="font-inter fw-semibold text-danger" style={{ fontSize: 15 }}>{formatMoney(row.saldo)}</span>;

      case "acciones":
        return (
          <div className="d-flex align-items-center justify-content-center gap-2">
            <a
              href={`caja/pagos/${row.id_venta}`}
              className="btn btn-link p-1 text-primary"
            >
              <EyeIcon style={{ width: "20px", height: "20px" }} />
            </a>

          </div>
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
              style={{ height: "30px", borderRadius: "8px", borderColor: "#d0d5dd", backgroundColor: "#fff", fontSize: "13px", color: "#0f1901", fontWeight: 400, appearance: "none", textAlign: "start", width: "100%" }}
              value={clienteFilter}
              onChange={(e) => setFilter({ cliente: e.target.value })}
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
              name="vendedor"
              className="btn d-flex align-items-center justify-content-center gap-2 border transition-smooth px-3"
              style={{ height: "30px", borderRadius: "8px", borderColor: "#d0d5dd", backgroundColor: "#fff", fontSize: "13px", color: "#0f1901", fontWeight: 400, appearance: "none", textAlign: "start", width: "100%" }}
              value={vendedorFilter}
              onChange={(e) => setFilter({ vendedor: e.target.value })}
            >
              <option value="">Todos los vendedores</option>
              {vendedores.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <DatePicker
              ref={pickerRef}
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
            >
              <div className="d-flex flex-wrap gap-1 p-2 border-top">
                {PRESETS.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => applyPreset(p)}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </DatePicker>
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