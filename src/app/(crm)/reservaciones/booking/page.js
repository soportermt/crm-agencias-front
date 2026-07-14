import BookingForm from '@/components/booking/booking-form/BookingForm'
import BookingPriceBreakdown from '@/components/booking/booking-form/BookingPriceBreakdown'
import React from 'react'

export default function Booking() {
  return (
    <div className="container-fluid p-0">
      <h1 className="font-inter fw-medium mb-1" style={{ color: "#0f1901", fontSize: "24px", lineHeight: "1.2" }}>
        Nueva reservación
      </h1>
      <p className="text-secondary small mb-0" style={{ color: "var(--black-rgba-40)", fontSize: "13px" }}>
        Completa los datos para crear una nueva reservación.
      </p>
      <form className="row g-3 m-0 form-booking">
        <div className="col-12 col-xl-9">
          <div
            className="bg-white shadow-premium p-1"
            style={{ borderRadius: "12px" }}
          >
            <BookingForm />
          </div>
        </div>

        <div className="col-12 col-xl-3">
          <div
            className="bg-white shadow-premium p-1"
            style={{ borderRadius: "12px" }}
          >
            <BookingPriceBreakdown />
          </div>
        </div>
      </form>
    </div>
  )
}
