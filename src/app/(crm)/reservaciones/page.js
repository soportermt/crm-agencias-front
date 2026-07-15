"use client";

import React, { useState, useEffect } from "react";
import BookingMetrics from "@/components/booking/BookingMetrics";
import BookingTable from "@/components/booking/BookingTable";
import BookingTableHeader from "@/components/booking/BookingTableHeader";

export default function ReservacionesPage() {
  const [activeTab, setActiveTab] = useState("lista");
  return (
    <div className="container-fluid p-0">
      <div className="bg-white p-4 shadow-premium" style={{ borderRadius: "12px" }}>
        <BookingTableHeader />

        <BookingMetrics />

        <BookingTable
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>
    </div>
  );
}
