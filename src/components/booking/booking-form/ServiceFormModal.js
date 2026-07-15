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
    <div className="modal d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">{service.nombre}</h5>
              <button type="button" className="btn-close" onClick={onClose} />
            </div>
            <div className="modal-body">
              <FormComponent ref={formRef} initialData={initialData} />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                Guardar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
}