"use client";

import ProveedorModal from '@/components/common/ProveedorModal';
import ProveedoresFilters from '@/components/proveedores/ProveedoresFilters';
import ProveedoresHeader from '@/components/proveedores/ProveedoresHeader';
import ProveedoresTable from '@/components/proveedores/ProveedoresTable';
import { catalogosService } from '@/services/catalogos.service';
import React, { useEffect, useState } from 'react'

export default function Proveedores() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [proveedores, setProveedores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [proveedorAEditar, setProveedorAEditar] = useState(null);

  async function loadProveedores() {
    setIsLoading(true);
    setError(null);

    try {
      const data = await catalogosService.searchProvidersP();
      setProveedores(data);
    } catch (err) {
      console.error("Error al cargar datos de agencia:", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadProveedores();
  }, []);

  const filteredProveedores = proveedores.filter(v =>
    v.nombre_comercial.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.direccion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProveedorSaved = () => {
    setShowModal(false);
    setProveedorAEditar(null);
    loadProveedores();
  };

  const handleEditClick = (proveedor) => {
    setProveedorAEditar(proveedor);
    setShowModal(true);
  };

  const handleAddClick = () => {
    setProveedorAEditar(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setProveedorAEditar(null);
  };

  if (isLoading) return (<div className="d-flex justify-content-center align-items-center vh-100 bg-light">
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Cargando...</span>
    </div>
  </div>);
  if (error || !proveedores) return <div className="text-danger">No se pudo cargar la información.</div>;

  return (
    <div className="container-fluid p-0">
      <div className="bg-white p-4 border shadow-premium" style={{ borderRadius: "12px" }}>
        <ProveedoresHeader onAddVendedorClick={handleAddClick} />

        <ProveedoresFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filteredData={filteredProveedores}
        />

        <ProveedoresTable
          proveedores={filteredProveedores}
          onEditClick={handleEditClick}
        />
      </div>

      <ProveedorModal
        show={showModal}
        onClose={handleCloseModal}
        onProveedorCreated={handleProveedorSaved}
        proveedorAEditar={proveedorAEditar}
      />
    </div>
  )
}
