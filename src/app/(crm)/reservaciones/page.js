"use client";

import React, { useState, useEffect } from "react";
import BookingMetrics from "@/components/booking/BookingMetrics";
import BookingTable from "@/components/booking/BookingTable";
import BookingTableHeader from "@/components/booking/BookingTableHeader";
import { bookingService } from "@/services/booking.service";

export default function ReservacionesPage() {
  const [activeTab, setActiveTab] = useState("lista");

  const [metrics, setMetrics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function metricas() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await bookingService.metrics();
        setMetrics(data);
      } catch (err) {
        console.error("Error al cargar métricas:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }

    metricas();
  }, []);
  return (
    <div className="container-fluid p-0">
      <div className="bg-white p-4 shadow-premium" style={{ borderRadius: "12px" }}>
        <BookingTableHeader />

        <BookingMetrics metrics={metrics} loading={isLoading}/>

        <BookingTable
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>
    </div>
  );
}
