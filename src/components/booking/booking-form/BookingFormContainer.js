"use client";

import BookingForm from "./BookingForm";
import BookingPriceBreakdown from "./BookingPriceBreakdown";
import { useBookingForm } from "./BookingFormContext";
import { serializeBookingToForm } from "@/utils/serializeBooking";
import { catalogosService } from "@/services/catalogos.service";
import { useState } from "react";

export default function BookingFormContainer() {
  const { booking } = useBookingForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = serializeBookingToForm(booking);
      const result = await catalogosService.create(payload);
      console.log("Reserva creada en prueba", result);
    } catch (error) {
      console.error("Error al crear la reserva: ", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className="row g-5 m-0 form-booking"
      onSubmit={handleSubmit}
    >
      <div className="col-12 col-xl-9 my-3">
        <div
          className="bg-white shadow-premium p-1"
          style={{ borderRadius: "12px" }}
        >
          <BookingForm />
        </div>
      </div>

      <div className="col-12 col-xl-3 my-3">
        <div
          className="bg-white shadow-premium p-1"
          style={{ borderRadius: "12px" }}
        >
          <BookingPriceBreakdown isSubmitting={isSubmitting} />
        </div>
      </div>
    </form>
  );
}