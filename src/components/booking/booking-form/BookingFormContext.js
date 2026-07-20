"use client";

import { createContext, useContext, useState } from "react";
import { serviceCatalog } from "@/mocks/serviceCatalog";

const BookingFormContext = createContext(null);

const initialBooking = {
  idVenta: null,
  folio: "",
  fecha: new Date(),
  pasajeroTitular: "",
  descripcion: "",
  observaciones: "",
  moneda: "MXN",
  idAgencia: "",
  idUsuario: "",
  idCliente: null,
  idTipoVenta: null,
  perteneceA: null,
  cargoServicios: 0,
  limiteCancelacion: null,
  servicios: [],
};

export function BookingFormProvider({ children }) {
  const [booking, setBooking] = useState(initialBooking);

  const updateBooking = (field, value) =>
    setBooking((prev) => ({ ...prev, [field]: value }));

  const [draft, setDraft] = useState(null); 

  const startDraft = (tipo, editingId = null, initialData = {}) => {
    const catalogEntry = serviceCatalog.find((s) => s.id === tipo);
    setDraft({
      tipo,
      editingId,
      data: { ...catalogEntry.defaultData, ...initialData },
      errors: {},
    });
  };

  const updateDraftField = (field, value) =>
    setDraft((d) => ({ ...d, data: { ...d.data, [field]: value } }));

  const cancelDraft = () => setDraft(null);

  const confirmDraft = () => {
    const catalogEntry = serviceCatalog.find((s) => s.id === draft.tipo);
    const errors = catalogEntry.validate(draft.data);

    if (Object.keys(errors).length > 0) {
      setDraft((d) => ({ ...d, errors }));
      return false;
    }

    setBooking((prev) => {
      const servicios = draft.editingId
        ? prev.servicios.map((item) =>
            item.id === draft.editingId ? { ...item, data: draft.data } : item
          )
        : [...prev.servicios, { id: crypto.randomUUID(), tipo: draft.tipo, data: draft.data }];
      return { ...prev, servicios };
    });

    setDraft(null);
    return true;
  };

  const removeService = (id) =>
    setBooking((prev) => ({ ...prev, servicios: prev.servicios.filter((s) => s.id !== id) }));

  const resetBooking = () => {
    setBooking(initialBooking);
    setDraft(null);
  };

  return (
    <BookingFormContext.Provider
      value={{
        booking,
        updateBooking,
        draft,
        startDraft,
        updateDraftField,
        cancelDraft,
        confirmDraft,
        removeService,
        resetBooking,
      }}
    >
      {children}
    </BookingFormContext.Provider>
  );
}

export function useBookingForm() {
  const context = useContext(BookingFormContext);
  if (!context) throw new Error("useBookingForm debe usarse dentro de BookingFormProvider");
  return context;
}