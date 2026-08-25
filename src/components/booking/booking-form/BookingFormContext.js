"use client";

import { createContext, useContext, useState } from "react";
import { serviceCatalog } from "@/mocks/serviceCatalog";
import { mapVentaToBooking } from "@/utils/mapVentaToBooking";
import { getPassengersPool } from "@/utils/passengersPool";

const BookingFormContext = createContext(null);

const initialBooking = {
  idVenta: null,
  folio: "",
  fecha: new Date(),
  pasajeroTitular: "",
  descripcion: "",
  observaciones: "",
  moneda: "MXN",
  idAgencia: 2,
  idVendedor: "",
  idCliente: null,
  idTipoVenta: null,
  perteneceA: null,
  cargoServicios: 0,
  limiteCancelacion: null,
  servicios: [],
};

export function BookingFormProvider({ children, initialData = null }) {
  // const [booking, setBooking] = useState(initialBooking);
  const [booking, setBooking] = useState(() =>
    initialData ? mapVentaToBooking(initialData) : initialBooking
  );
  const [rawVenta, setRawVenta] = useState(initialData);
  const updateBooking = (field, value) =>
    setBooking((prev) => ({ ...prev, [field]: value }));

  const [draft, setDraft] = useState(null);

  // const startDraft = (tipo, editingId = null, initialData = {}) => {
  //   const catalogEntry = serviceCatalog.find((s) => s.id === tipo);
  //   setDraft({
  //     tipo,
  //     editingId,
  //     data: { ...catalogEntry.defaultData, ...initialData },
  //     errors: {},
  //   });
  // };

  const startDraft = (tipo, editingId = null, initialData = {}) => {
    const catalogEntry = serviceCatalog.find((s) => s.id === tipo);
    let baseData = { ...catalogEntry.defaultData, ...initialData };

    if (!editingId && booking.servicios.length > 0) {
      const pool = getPassengersPool(booking.servicios);
    
      if (tipo === "traslado" || tipo === "tour") {
        const adultos = pool.adultos.length > 0 ? pool.adultos : baseData.pasajeros.adultos;
        const menores = pool.menores.length > 0 ? pool.menores : baseData.pasajeros.menores;
      
        baseData = {
          ...baseData,
          adultos: adultos.length,
          menores: menores.length,
          pasajeros: {
            adultos: adultos.map((p) => ({ nombre: p.nombre, apellidos: p.apellidos })),
            menores: menores.map((p) => ({ nombre: p.nombre, apellidos: p.apellidos, edad: p.edad ?? "" })),
          },
        };
      }
    
      if (tipo === "hospedaje" && (pool.adultos.length > 0 || pool.menores.length > 0)) {
        baseData = {
          ...baseData,
          habitaciones: [
            {
              adultos: pool.adultos.length || 2,
              menores: pool.menores.length,
              tipo_cama: "",
              tipo_habitacion: "",
              plan: "",
              total_publico: "",
              total_neto: "",
              pasajeros: [
                ...pool.adultos.map((p) => ({ tipo: "adult", nombre: p.nombre, apellidos: p.apellidos })),
                ...pool.menores.map((p) => ({ tipo: "child", nombre: p.nombre, apellidos: p.apellidos, edad: p.edad ?? "" })),
              ],
            },
          ],
        };
      }
    }

    setDraft({ tipo, editingId, data: baseData, errors: {} });
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
        rawVenta,
        setRawVenta
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