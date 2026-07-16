"use client";
import React, { useRef } from "react";

export default function ServiceForm({ service, initialData, onSave, onCancel }) {
  const formRef = useRef(null);

  if (!service) return null;
  const FormComponent = service.Form;

  const handleConfirm = () => {
    const result = formRef.current?.submit();
    if (result?.valid) {
      onSave(result.data);
    }
  };

  return (
    <div className="p-1 d-flex flex-column gap-4">
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="font-inter fw-medium mb-0" style={{ fontSize: "22px", color: "#0f1901" }}>
          Información del servicio
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="btn-close"
          style={{ fontSize: "12px" }}
          aria-label="Cerrar"
        ></button>
      </div>

      <FormComponent ref={formRef} initialData={initialData} />

      <div className="row justify-content-end">
        <div className="col-md-6 p-0">
          <button
            type="button"
            onClick={handleConfirm}
            className="btn btn-primary w-100"
            style={{ backgroundColor: "var(--brand-blue)", fontSize: 14, fontWeight: 500 }}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}