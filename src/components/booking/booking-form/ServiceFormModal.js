"use client";
import React, { useRef } from "react";
import { createPortal } from "react-dom";

export default function ServiceFormModal({ service, initialData, onSave, onClose }) {
  const formRef = useRef(null);

  if (!service) return null;
  const FormComponent = service.Form;

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = formRef.current?.submit();
    if (result?.valid) {
      onSave(result.data);
    }
  };

  return createPortal(
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 1050,
        display: "flex",
        justifyContent: "flex-end",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white h-100 overflow-auto"
        style={{
          width: "740px",
          maxWidth: "100%",
          boxShadow: "-4px 0 24px rgba(0,0,0,0.15)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit} className="p-4 d-flex flex-column gap-4">
          <div className="d-flex justify-content-between align-items-center">
            <h2
              className="font-inter fw-medium mb-0"
              style={{ fontSize: "22px", color: "#0f1901" }}
            >
              Información del servicio
            </h2>
            <button
              onClick={onClose}
              className="btn-close"
              style={{ fontSize: "12px" }}
              aria-label="Cerrar"
            ></button>
          </div>

          <div className="modal-body">
            <FormComponent ref={formRef} initialData={initialData} />
          </div>

          <div className="row justify-content-end">
            <div className="col-md-6 p-0">
              <button
                className="btn btn-primary w-100" style={{backgroundColor: "var(--brand-blue)", fontSize: 14, fontWeight: 500}}>
                Confirmar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}