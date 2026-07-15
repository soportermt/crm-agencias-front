"use client";

import { createContext, useContext, useState } from "react";

const BookingFormContext = createContext(null);

export function BookingFormProvider({ children }) {
  const [addedServices, setAddedServices] = useState([]);
  return (
    <BookingFormContext.Provider value={{ addedServices, setAddedServices }}>
      {children}
    </BookingFormContext.Provider>
  );
}

export function useBookingForm() {
  const ctx = useContext(BookingFormContext);
  if (!ctx) throw new Error("useBookingForm debe usarse dentro de BookingFormProvider");
  return ctx;
}