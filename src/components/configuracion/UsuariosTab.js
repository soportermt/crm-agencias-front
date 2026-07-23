"use client";

import React, { useState } from "react";
import StatusBadge from "@/components/common/StatusBadge";
import { mockUsuarios } from "@/mocks/configuracion";
import UsuarioModal from "@/components/configuracion/UsuarioModal";

export default function UsuariosTab() {
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleAddUser = () => {
    setSelectedUser(null);
    setShowModal(true);
  };

  const handleEditUser = (usuario) => {
    setSelectedUser(usuario);
    setShowModal(true);
  };

  return (
    <div className="d-flex flex-column font-inter w-100">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0 fw-medium text-dark" style={{ fontSize: "18px", letterSpacing: "-0.126px" }}>
          Lista de usuarios
        </h5>
        <button
          className="btn btn-primary-custom d-flex align-items-center justify-content-center gap-2 shadow-premium"
          style={{ padding: "10px 16px", fontSize: "14px", borderRadius: "8px" }}
          onClick={handleAddUser}
        >
          <i className="bi bi-plus-lg"></i>
          <span>Agregar usuario</span>
        </button>
      </div>

      <div className="row g-3">
        {mockUsuarios.map((usuario) => (
          <div key={usuario.id} className="col-12 col-md-6">
            <div 
              className="border rounded p-3 d-flex gap-3 align-items-center" 
              style={{ borderColor: "rgba(161, 161, 170, 0.35) !important", borderRadius: "8px", borderWidth: "1px", borderStyle: "solid", cursor: "pointer" }}
              onClick={() => handleEditUser(usuario)}
            >
              <img 
                src={usuario.avatar} 
                alt={usuario.nombre} 
                className="rounded-circle object-fit-cover" 
                style={{ width: "60px", height: "60px" }}
              />
              <div className="d-flex flex-column">
                <div className="d-flex align-items-center gap-2">
                  <span className="fw-bold text-dark m-0" style={{ fontSize: "20px", letterSpacing: "-0.14px" }}>
                    {usuario.nombre}
                  </span>
                  <StatusBadge status={usuario.estatus} />
                </div>
                <div className="d-flex flex-column text-secondary mt-1" style={{ fontSize: "14px", color: "#404040" }}>
                  <span className="fw-medium">{usuario.rol}</span>
                  <span className="fw-normal">{usuario.email}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <UsuarioModal 
        show={showModal} 
        onClose={() => setShowModal(false)} 
        user={selectedUser} 
      />
    </div>
  );
}
