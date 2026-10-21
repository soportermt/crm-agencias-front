"use client";

import DataTable from "@/components/common/DataTable";
import SearchBar from "@/components/common/SearchBar";
import { grupoService } from "@/services/grupo.service";
import { EnvelopeIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useMemo, useState } from "react";
import HabModal from "./HabModal";
import AlertModal from "@/components/common/AlertModal";

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

export default function Habitaciones({ id_grupo, comision }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [habAEditar, setHabAEditar] = useState(null);

  const [habAEliminar, setHabAEliminar] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

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
  const handleDeleteClick = (id_habitacion) => {
    setHabAEliminar(id_habitacion);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      const res = await grupoService.deleteHab(habAEliminar);
      if (res?.success === false) {
        throw new Error(res.error || "No se pudo eliminar la habitación");
      }
      setData((prev) =>
        prev.filter((h) => String(h.id_habitacion) !== String(habAEliminar))
      );
    } catch (err) {
      console.error("Error al eliminar habitación:", err);
      setDeleteError(
        err.response?.data?.error || err.message || "No se pudo eliminar la habitación"
      );
    } finally {
      setHabAEliminar(null);
      setIsDeleting(false);
    }
  };

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
          huespedes: nombres.length ? nombres : ["Sin datos"],
          edades: edades.length ? edades.join(", ") : "Sin datos",
          tipo_habitacion: h.tipo_habitacion ? h.tipo_habitacion : "Sin datos",
          fecha_entrada_raw: h.fecha_entrada,
          fecha_salida_raw: h.fecha_salida,
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

      case "fecha_entrada":
        return (
          <span>{formatDate(row.fecha_entrada_raw)}</span>
        );

      case "fecha_salida":
        return (
          <span>{formatDate(row.fecha_salida_raw)}</span>
        );

      case "acciones":
        return (
          <div className="d-flex align-items-center justify-content-center gap-1">
            <button
              onClick={() => handleEditClick(row)}
              className="btn btn-link p-0 text-decoration-none text-start text-primary fw-medium"
              style={{ whiteSpace: "normal", textAlign: "left", fontSize: 14 }}
            >
              <PencilSquareIcon style={{ width: "20px", height: "20px", color: "rgb(34, 124, 242)" }} /> {row[key]}
            </button>
            <button
              type="button"
              onClick={() => handleDeleteClick(row.id_habitacion)}
              className="btn btn-link p-1"
            >
              <TrashIcon style={{ width: "20px", height: "20px", color: "rgb(175, 35, 58)" }} />
            </button>
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

  const handleHabSaved = () => {
    setShowModal(false);
    setHabAEditar(null);
    loadData(id_grupo);
  };

  const handleEditClick = (grupos) => {
    setHabAEditar(grupos);
    setShowModal(true);
  };

  const handleAddClick = () => {
    setHabAEditar(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setHabAEditar(null);
  };

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

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
    <>
      <div className="mt-0">
        <div className="mb-3">
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-stretch align-items-sm-end gap-2 w-100">
            <div className="flex-grow-1 flex-sm-grow-0">
              <SearchBar
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Buscar por huéspedes"
                width="100%"
              />
            </div>
            <button
              onClick={handleAddClick}
              className="btn btn-primary text-nowrap"
              style={{ fontSize: 14 }}
            >
              <i className="bi bi-plus-lg me-2"></i>
              <span>Habitación</span>
            </button>
          </div>
        </div>
        {habAEliminar && (
          <AlertModal
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} width={50} color="#dc3545" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
            }
            title="¿Desea eliminar esta habitación?"
            description="Eliminará este registro del sistema"
            confirmText="Sí, eliminar"
            isLoading={isDeleting}
            onConfirm={handleConfirmDelete}
            onClose={() => setHabAEliminar(null)}
          />
        )}
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
      {deleteError && <div className="alert alert-danger">{deleteError}</div>}
      <HabModal
        show={showModal}
        onClose={handleCloseModal}
        onHabCreated={handleHabSaved}
        habAEditar={habAEditar}
        id_grupo={id_grupo}
        comision={comision}
      />
    </>
  )
}
