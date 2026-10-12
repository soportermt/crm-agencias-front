"use client";

import BookingForm from "./BookingForm";
import BookingPriceBreakdown from "./BookingPriceBreakdown";
import { useBookingForm } from "./BookingFormContext";
import { serializeBookingToForm } from "@/utils/serializeBooking";
import { useEffect, useState } from "react";
import AlertModal from "@/components/common/AlertModal";
import { bookingService } from "@/services/booking.service";
import { useRouter } from "next/navigation";
import { configService } from "@/services/config.service";
import { enviarComprobantePorCorreo } from "@/utils/invoiceEmail";

async function enviarComprobanteAutomatico(idVenta) {
  try {
    const [ventaCompleta, terminos] = await Promise.all([
      bookingService.getSaleInfo(idVenta),
      configService.term().then((data) => data?.terminos_general ?? ""),
    ]);

    const result = await enviarComprobantePorCorreo(ventaCompleta, terminos);
    if (!result.success) {
      console.error("No se pudo enviar el comprobante automático:", result.error);
    }
  } catch (error) {
    console.error("Error al enviar comprobante automático:", error);
  }
}

export default function BookingFormContainer({ mode }) {
  const { booking, setRawVenta, validateBooking, draft } = useBookingForm();
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const router = useRouter();
  const isEditMode = mode === "edit";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    const errors = validateBooking();
    if (Object.keys(errors).length > 0) {
      setSubmitError("Completa los campos obligatorios marcados en rojo.");
      setTimeout(() => {
        document.querySelector(".is-invalid, .text-danger")
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 0);
      return;
    }

    if (draft) {
      setSubmitError("Tienes un servicio sin confirmar. Confírmalo o cancélalo antes de guardar.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = serializeBookingToForm(booking);
      
      const result = mode === "edit"
        ? await bookingService.update(payload)
        : await bookingService.create(payload);

      if (!result.success) {
        console.error("Error al guardar:", result.error, result);
        return;
      }

      if (isEditMode) {
        const ventaActualizada = await bookingService.getSaleInfo(booking.idVenta);
        setRawVenta(ventaActualizada);
      } else {
        enviarComprobanteAutomatico(result.sale.id_venta);
      }

      setShowAlert(true);

      //// console.log(mode === "edit" ? "Reserva actualizada" : "Reserva creada", result);
    } catch (error) {
      console.error("Error al crear la reserva: ", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!showAlert) return;
    if (isEditMode) return;
    const timer = setTimeout(() => {
      router.push("/reservaciones");
    }, 2000);
    return () => clearTimeout(timer);
  }, [showAlert, isEditMode, router]);

  return (
    <>
      <form
        className="row g-5 m-0 form-booking align-items-startg"
        onSubmit={handleSubmit}
        noValidate
      >
        {submitError && (
          <div className="col-12 mt-3">
            <div className="alert alert-danger mb-0 p-2" style={{fontSize: 14}}>{submitError}</div>
          </div>
        )}
        <div className="col-12 col-xl-9 my-3">
          <div
            className="bg-white shadow-premium p-1"
            style={{ borderRadius: "8px" }}
          >
            <BookingForm mode={mode} />
          </div>
        </div>

        <div className="col-12 col-xl-3 my-3">
          <div
            className="bg-white shadow-premium p-1 position-sticky"
            style={{
              borderRadius: "8px",
              top: "1rem",
              maxHeight: "calc(100vh - 2rem)",
              overflowY: "auto",
            }}
          >
            <BookingPriceBreakdown isSubmitting={isSubmitting} mode={mode} />
          </div>
        </div>
      </form>
      {showAlert && (
        <AlertModal
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} width={50} color="#0c5cc6" stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
          </svg>}
          title={isEditMode ? "Actualización lista" : "Reservación creada"}
          description={isEditMode
            ? "Los detalles han sido modificados."
            : "El registro se completó sin problemas."}
          onClose={() => {
            setShowAlert(false);
            if (!isEditMode) router.push("/reservaciones");
          }}
        />
      )}
    </>
  );
}