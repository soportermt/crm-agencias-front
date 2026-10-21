"use client";

import AlertModal from "@/components/common/AlertModal";
import GrupoModal from "@/components/grupos/GrupoModal";
import GruposTable from "@/components/grupos/GruposTable";
import { grupoService } from "@/services/grupo.service";
import { subDays } from "date-fns";
import React, { useCallback, useEffect, useState } from "react";

const toYMD = (d) =>
  d
    ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
    : null;

export default function Grupos() {
  const [grupos, setGrupos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    startDate: subDays(new Date(), 30),
    endDate: new Date(),
  });

  const [grupoAEditar, setGrupoAEditar] = useState(null);
  const [grupoAEliminar, setGrupoAEliminar] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const cargarGrupos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await grupoService.gruposapi(
        toYMD(filters.startDate),
        toYMD(filters.endDate),
      );
      setGrupos(data);
    } catch (err) {
      console.error("Error al cargar grupos:", err);
      setError("No se pudieron cargar los grupos");
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    if (filters.startDate && !filters.endDate) return;
    cargarGrupos();
  }, [cargarGrupos, filters.startDate, filters.endDate]);

  const handleGrupoSaved = () => {
    setShowModal(false);
    setGrupoAEditar(null);
    cargarGrupos();
  };

  const handleEditClick = (grupos) => {
    setGrupoAEditar(grupos);
    setShowModal(true);
  };

  const handleAddClick = () => {
    setGrupoAEditar(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setGrupoAEditar(null);
  };

  const handleDeleteClick = (id_grupo) => {
    setGrupoAEliminar(id_grupo);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      await grupoService.delete(grupoAEliminar);
      setGrupoAEliminar(null);
      await cargarGrupos();
    } catch (err) {
      console.error("Error al eliminar grupo:", err);
      setError(err.response?.data?.error || "No se pudo eliminar el grupo");
      setGrupoAEliminar(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="container-fluid p-0">
      <div className="bg-white p-4 shadow-premium" style={{ borderRadius: "8px" }}>
        <h1
          className="font-inter fw-medium mb-1"
          style={{ color: "#0f1901", fontSize: "20px", lineHeight: "1.2" }}
        >
          Listado de grupos
        </h1>
        {error && <div className="alert alert-danger mt-3">{error}</div>}
        {isLoading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="text-muted mt-2 font-poppins small">Cargando...</p>
          </div>
        ) : (
          <GruposTable
            data={grupos}
            filters={filters}
            onFiltersChange={setFilters}
            isLoading={isLoading}
            onEditClick={handleEditClick}
            onDeleteClick={handleDeleteClick}
          />
        )}

        <GrupoModal
          show={showModal}
          onClose={handleCloseModal}
          onGrupoCreated={handleGrupoSaved}
          grupoAEditar={grupoAEditar}
        />

        {grupoAEliminar && (
          <AlertModal
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} width={50} color="#dc3545" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
            }
            title="¿Desea eliminar este grupo?"
            description="Esta acción cancelará también el servicio asociado."
            confirmText="Sí, eliminar"
            isLoading={isDeleting}
            onConfirm={handleConfirmDelete}
            onClose={() => setGrupoAEliminar(null)}
          />
        )}
      </div>
    </div>
  )
}
