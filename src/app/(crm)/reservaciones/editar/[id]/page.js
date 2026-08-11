"use client";

import BookingFormContainer from "@/components/booking/booking-form/BookingFormContainer"; 
import { BookingFormProvider } from "@/components/booking/booking-form/BookingFormContext"; 
import { bookingService } from "@/services/booking.service"; 
import { useEffect, useState, use } from "react";

export default function Editar({ params }) {
  const { id } = use(params);
  const [venta, setVenta] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingService.getSaleInfo(id)
      .then(setVenta)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Cargando...</div>;
  if (!venta) return <div>No se encontró la reservación.</div>;

  return (
    <BookingFormProvider initialData={venta}>
      <BookingFormContainer mode="edit" id={id} />
    </BookingFormProvider>
  );
}