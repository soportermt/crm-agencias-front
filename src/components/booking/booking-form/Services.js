"use client";

import ServiceSummaryCard from "./ServiceSummaryCard";
import { serviceCatalog } from "@/mocks/serviceCatalog";
import { useBookingForm } from "./BookingFormContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Services() {
  const { booking, draft, startDraft, cancelDraft, confirmDraft, removeService } = useBookingForm();

  const activeCatalogEntry = draft && serviceCatalog.find((s) => s.id === draft.tipo);
  const FormComponent = activeCatalogEntry?.Form;

  const toggleService = (service) => {
    if (draft?.tipo === service.id) cancelDraft();
    else startDraft(service.id);
  };

  const openEdit = (item) => startDraft(item.tipo, item.id, item.data);

  return (
    <div className="mt-3">
      <div className="d-flex flex-wrap gap-2 mb-3">
        {serviceCatalog.map((service) => {
          const isSelected = booking.servicios.some((item) => item.tipo === service.id);
          const isActive = draft?.tipo === service.id;
          return (
            <button
              key={service.id}
              type="button"
              className={`btn ${isSelected ? "btn-success" : "btn-outline-primary"} ${isActive ? "active" : ""}`}
              onClick={() => toggleService(service)}
            >
              <FontAwesomeIcon icon={service.icon} /> {service.nombre}
            </button>
          );
        })}
      </div>

      {draft && (
        <div className="card card-body p-1 d-flex flex-column gap-4">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="font-inter fw-medium mb-0" style={{ fontSize: "22px" }}>Información del servicio</h2>
            <button type="button" onClick={cancelDraft} className="btn-close" aria-label="Cerrar" />
          </div>
          <FormComponent />
          <div className="row justify-content-end">
            <div className="col-md-6 p-0">
              <button type="button" onClick={confirmDraft} className="btn btn-primary w-100" style={{ backgroundColor: "var(--brand-blue)" }}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {booking.servicios.map((item) => (
        <ServiceSummaryCard
          key={item.id}
          service={serviceCatalog.find((s) => s.id === item.tipo)}
          data={item.data}
          onEdit={() => openEdit(item)}
          onRemove={() => removeService(item.id)}
        />
      ))}
    </div>
  );
}