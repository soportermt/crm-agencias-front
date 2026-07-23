"use client";

import React, { useState } from "react";
import DestinosHeader from "@/components/destinos/DestinosHeader";
import DestinosFilters from "@/components/destinos/DestinosFilters";
import DestinosTable from "@/components/destinos/DestinosTable";
import { mockDestinos } from "@/mocks/destinos";

export default function DestinosPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="bg-white rounded-4 p-4 shadow-sm w-100 h-100 d-flex flex-column" style={{ minHeight: "80vh" }}>
      <DestinosHeader onAddDestinoClick={() => console.log("Agregar destino")} />
      
      <div className="border-top pt-2">
        <DestinosFilters 
          searchTerm={searchTerm} 
          onSearchChange={handleSearch} 
        />
      </div>

      <div className="flex-grow-1 overflow-auto mt-2">
        <DestinosTable destinos={mockDestinos} />
      </div>
    </div>
  );
}
