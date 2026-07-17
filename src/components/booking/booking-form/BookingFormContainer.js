"use client";

import BookingForm from "./BookingForm";
import BookingPriceBreakdown from "./BookingPriceBreakdown";
import { useBookingForm } from "./BookingFormContext";

export default function BookingFormContainer() {
  const { booking } = useBookingForm();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Payload");
    console.log(booking);
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
          <BookingPriceBreakdown />
        </div>
      </div>
    </form>
  );
}