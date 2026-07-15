"use client";

import BookingForm from './BookingForm'
import BookingPriceBreakdown from './BookingPriceBreakdown'
import { useBookingForm } from './BookingFormContext'

export default function BookingFormContainer() {
  const { addedServices } = useBookingForm();

  const handleSubmit = (e) => {
    e.preventDefault();
    const generalData = Object.fromEntries(new FormData(e.target).entries());

    const payload = {
      ...generalData,
      servicios: addedServices, 
    };

    console.log(payload);
  };

  return (
    <form className="row g-3 m-0 form-booking" onSubmit={handleSubmit}>
      <div className="col-12 col-xl-9 p-0">
        <div className="bg-white shadow-premium p-1" style={{ borderRadius: "12px" }}>
          <BookingForm />
        </div>
      </div>
      <div className="col-12 col-xl-3">
        <div className="bg-white shadow-premium p-1" style={{ borderRadius: "12px" }}>
          <BookingPriceBreakdown />
        </div>
      </div>
    </form>
  );
}