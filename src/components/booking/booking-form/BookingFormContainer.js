"use client";

import BookingForm from "./BookingForm";
import BookingPriceBreakdown from "./BookingPriceBreakdown";
import { useBookingForm } from "./BookingFormContext";
import { serializeBookingToForm } from "@/utils/serializeBooking";
import { useEffect, useState } from "react";
import AlertModal from "@/components/common/AlertModal";
import { bookingService } from "@/services/booking.service";
import { useRouter } from "next/navigation";

export default function BookingFormContainer() {
  const { booking } = useBookingForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setIsSubmitting(true);

    try {
      const payload = serializeBookingToForm(booking);
      const result = await bookingService.create(payload);
      console.log("Reserva creada en prueba", result);
      // setShowAlert(true);
    } catch (error) {
      console.error("Error al crear la reserva: ", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!showAlert) return;
    const timer = setTimeout(() => {
      router.push("/reservaciones");
    }, 2000); 
    return () => clearTimeout(timer);
  }, [showAlert, router]);

  return (
    <>
      <form
        className="row g-5 m-0 form-booking align-items-startg"
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
            className="bg-white shadow-premium p-1 position-sticky"
            style={{
              borderRadius: "12px",
              top: "1rem",
              maxHeight: "calc(100vh - 2rem)",
              overflowY: "auto",
            }}
          >
            <BookingPriceBreakdown isSubmitting={isSubmitting} />
          </div>
        </div>
      </form>
      {showAlert && (
        <AlertModal
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} width={50} color="#0c5cc6" stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
          </svg>}
          title="¡Reservación exitosa!"
          description="Tu reservación se ha realizado correctamente"
          onClose={() => router.push("/reservaciones")}
        />
      )}
    </>
  );
}