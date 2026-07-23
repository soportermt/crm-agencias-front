"use client";

import React, { useState } from "react";
import HotelesHeader from "@/components/hoteles/HotelesHeader";
import HotelesFilters from "@/components/hoteles/HotelesFilters";
import HotelesTable from "@/components/hoteles/HotelesTable";
import { mockHoteles } from "@/mocks/hoteles";

export default function HotelesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="bg-white rounded-4 p-4 shadow-sm w-100 h-100 d-flex flex-column" style={{ minHeight: "80vh" }}>
      <HotelesHeader onAddHotelClick={() => console.log("Agregar hotel")} />
      
      <div className="border-top pt-2">
        <HotelesFilters 
          searchTerm={searchTerm} 
          onSearchChange={handleSearch} 
        />
      </div>

      <div className="flex-grow-1 overflow-auto mt-2">
        <HotelesTable hoteles={mockHoteles} />
      </div>
    </div>
  );
}
