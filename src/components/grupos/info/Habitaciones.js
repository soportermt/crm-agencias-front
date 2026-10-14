"use client";

import DataTable from "@/components/common/DataTable";
import SearchBar from "@/components/common/SearchBar";
import { grupoService } from "@/services/grupo.service";
import { EnvelopeIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useMemo, useState } from "react";

const ITEMS_PER_PAGE = 10;

const columns = [
  { key: "huespedes", label: "Huéspedes", sortable: true, width: "220px" },
  { key: "edades", label: "Edades", sortable: true, width: "120px" },
  { key: "tipo_habitacion", label: "Tipo Habitación", sortable: true, width: "130px" },
  { key: "fecha_entrada", label: "Entrada", sortable: true, align: "center", width: "110px" },
  { key: "fecha_salida", label: "Salida", sortable: true, align: "center", width: "110px" },
  { key: "noches", label: "Noches", sortable: true, align: "center", width: "90px" },
  { key: "acciones", label: "", align: "center", width: "90px" },
];

const formatDate = (s) => {
  if (!s) return "—";
  const [y, m, d] = String(s).slice(0, 10).split("-");
  return y && m && d ? `${d}/${m}/${y}` : "—";
};

const normalize = (s) =>
  String(s ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

export default function Habitaciones({ id_grupo }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");

  async function loadData(id) {
    setIsLoading(true);
    setError(null);
    try {
      const res = await grupoService.getGroupHabs(id);
      setData(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error("Error al cargar las habitaciones:", err);
      setError("No se pudieron cargar las habitaciones");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!id_grupo) return;
    loadData(id_grupo);
  }, [id_grupo]);

  const rows = useMemo(
    () =>
      data.map((h) => {
        const huespedes = h.habitacionesHuespedes ?? [];

        const nombres = huespedes
          .map((g) => `${g.nombres ?? ""} ${g.apellidos ?? ""}`.trim())
          .filter(Boolean);

        const edades = huespedes
          .map((g) => g.edad)
          .filter((e) => e !== null && e !== undefined && e !== "");

        return {
          ...h,
          huespedes: nombres.length ? nombres : ["Sin dato"],
          edades: edades.length ? edades.join(", ") : "Sin dato",
          tipo_habitacion: h.tipo_habitacion && h.tipo_habitacion !== "-" ? h.tipo_habitacion : "Sin dato",
          fecha_entrada: formatDate(h.fecha_entrada),
          fecha_salida: formatDate(h.fecha_salida),
        };
      }),
    [data]
  );

  const renderCell = (key, row) => {
    switch (key) {
      case "huespedes":
        return (
          <div className="d-flex flex-column">
            {row.huespedes.map((n, i) => (
              <span key={i} className="font-inter fw-medium">{n}</span>
            ))}
          </div>
        );
      case "acciones":
        return (
          <div className="d-flex align-items-center justify-content-center gap-1">
            <button
              onClick={() => onEditClick(row)}
              className="btn btn-link p-0 text-decoration-none text-start text-primary fw-medium"
              style={{ whiteSpace: "normal", textAlign: "left", fontSize: 14 }}
            >
              <PencilSquareIcon style={{ width: "20px", height: "20px", color: "rgb(34, 124, 242)" }} /> {row[key]}
            </button>
            <button
              onClick={() => onEditClick(row)}
              className="btn btn-link p-0 text-decoration-none text-start text-primary fw-medium"
              style={{ whiteSpace: "normal", textAlign: "left", fontSize: 14 }}
            >
              <EnvelopeIcon style={{ width: "20px", height: "20px", color: "rgb(34, 124, 242)" }} /> {row[key]}
            </button>
            <a
              href={`/grupos/${row.id_venta}`}
              className="btn btn-link p-1 text-primary"
            >
              <TrashIcon style={{ width: "20px", height: "20px", color: "rgb(175, 35, 58)" }} />
            </a>
          </div>
        );
      default:
        return row[key];
    }
  };

  const filteredRows = useMemo(() => {
    const search = normalize(searchValue.trim());
    if (!search) return rows;

    return rows.filter((r) => normalize(r.huespedes.join(" ")).includes(search));
  }, [rows, searchValue]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / ITEMS_PER_PAGE));
  const paginated = filteredRows.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue]);

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="mt-0">
      <div className="mb-3">
        <div className="d-flex justify-content-between align-items-end w-100">
          <div>
            <SearchBar
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Buscar por huéspedes"
              width="300px"
            />
          </div>
          <div>
            <button className="btn btn-primary">
              <i className="bi bi-plus-lg" style={{ marginRight: 8 }}></i>
              <span>Habitación</span>
            </button>
          </div>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={paginated}
        renderCell={renderCell}
        pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        emptyMessage="No se encontraron habitaciones."
      />
    </div>
  )
}
