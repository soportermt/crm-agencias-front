"use client";

import React, { useCallback, useEffect, useState } from "react";
import DataTable from "@/components/common/DataTable";
import StatusBadge from "@/components/common/StatusBadge";
import { configService } from "@/services/config.service";
import CuentasModal from "../common/CuentasModal";

export default function BancosTab() {
  const [cuentas, setCuentas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCuenta, setSelectedCuenta] = useState(null);

  const loadCuentas = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await configService.bancos();
      setCuentas(data);
    } catch (err) {
      console.error("Error al cargar datos de agencia:", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCuentas();
  }, [loadCuentas]);

  const handleAccountCreated = (nuevaCuenta) => {
    // console.log("Cuenta creada con éxito:", nuevaCuenta);
    loadCuentas();
  };

  const handleOpenCreate = () => {
    setSelectedCuenta(null);
    setShowModal(true);
  };

  const handleOpenEdit = (cuentaRow) => {
    setSelectedCuenta(cuentaRow);
    setShowModal(true);
  };

  const handleAccountSaved = (savedAccount, isEdit) => {
    // console.log(isEdit ? "Cuenta actualizada:" : "Cuenta creada:", savedAccount);
    loadCuentas(); 
  };

  const columns = [
    { key: "id_cuenta", label: "ID", align: "center", width: "80px" },
    { key: "descripcion", label: "Descripción", align: "left" },
    { key: "cuenta", label: "Cuenta", align: "left" },
    { key: "estatus", label: "Estatus", align: "center" },
    { key: "acciones", label: "", align: "center", width: "100px" },
  ];

  const renderCell = (colKey, row) => {
    if (colKey === "estatus") {
      return (
        <div className="d-flex justify-content-center">
          <StatusBadge
            status={row.estatus === "1" ? "Activo" : "Inactivo"}
          />
        </div>
      );
    }
    if (colKey === "acciones") {
      return (
        <div className="d-flex justify-content-center">
          <button
            style={{ color: "#0c5cc6", fontSize: "13px", background: "transparent", border: "none" }}
            onClick={(e) => {
              e.preventDefault();
              handleOpenEdit(row);
            }}
          >
            Editar
          </button>
        </div>
      );
    }
    return row[colKey];
  };

  return (
    <div className="d-flex flex-column font-inter w-100">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0 fw-medium text-dark" style={{ fontSize: "18px", letterSpacing: "-0.126px" }}>
          Cuentas de banco
        </h5>
        <button
          className="btn btn-primary-custom d-flex align-items-center justify-content-center gap-2 shadow-premium"
          style={{ padding: "10px 16px", fontSize: "14px", borderRadius: "8px" }}
          onClick={handleOpenCreate}
        >
          <i className="bi bi-plus-lg"></i>
          <span>Agregar cuentas de banco</span>
        </button>
      </div>

      <div className="w-100">
        <DataTable
          columns={columns}
          data={cuentas}
          renderCell={renderCell}
          pagination={false}
          emptyMessage="No se encontraron cuentas de banco."
          minWidth="100%"
        />
      </div>


      <CuentasModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onAccountSaved={handleAccountSaved}
        cuentaToEdit={selectedCuenta}
      />
    </div>
  );
}
