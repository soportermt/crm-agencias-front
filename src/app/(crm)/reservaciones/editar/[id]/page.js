"use client";

import BookingFormContainer from "@/components/booking/booking-form/BookingFormContainer";
import { BookingFormProvider } from "@/components/booking/booking-form/BookingFormContext";
import { bookingService } from "@/services/booking.service";
import { useEffect, useState, use } from "react";

export default function Editar({ params }) {
  const { id } = use(params);
  const [venta, setVenta] = useState(null);
  const [paymentsPromises, setPaymentsPromises] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      bookingService.getSaleInfo(id),
      // bookingService.paymentsPromises(id),
    ])
      .then(([ventaData, promesasData]) => {
        setVenta(ventaData);
        // setPaymentsPromises(promesasData);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (<div className="d-flex justify-content-center align-items-center vh-100 bg-light">
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Cargando...</span>
    </div>
  </div>);
  if (!venta) return <div>No se encontró la reservación.</div>;

  return (
    <BookingFormProvider initialData={venta}>
      <BookingFormContainer mode="edit" id={id} />
    </BookingFormProvider>
  );
}