import BookingFormContainer from '@/components/booking/booking-form/BookingFormContainer'
import { BookingFormProvider } from '@/components/booking/booking-form/BookingFormContext'
import React from 'react'

export default function Booking() {
  return (
    <div className="container-fluid p-0">
      <h1 className="font-inter fw-medium mb-1 mx-4" style={{ color: "#0f1901", fontSize: "24px", lineHeight: "1.2" }}>
        Nueva reservación
      </h1>
      <p className="text-secondary small mb-0 mx-4" style={{ color: "var(--black-rgba-40)", fontSize: "13px" }}>
        Completa los datos para crear una nueva reservación.
      </p>
      <BookingFormProvider>
        <BookingFormContainer />
      </BookingFormProvider>
    </div>
  )
}
