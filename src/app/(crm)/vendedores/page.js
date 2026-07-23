"use client";

import React, { useState } from "react";
import VendedoresHeader from "@/components/vendedores/VendedoresHeader";
import VendedoresFilters from "@/components/vendedores/VendedoresFilters";
import VendedoresTable from "@/components/vendedores/VendedoresTable";
import VendedoresModal from "@/components/vendedores/VendedoresModal";
import { MOCK_VENDEDORES } from "@/mocks/vendedores";

export default function VendedoresPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);

  const filteredVendedores = MOCK_VENDEDORES.filter(v => 
    v.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.nivel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-fluid p-0">
      <div className="bg-white p-4 border shadow-premium" style={{ borderRadius: "12px" }}>
        <VendedoresHeader onAddVendedorClick={() => setShowModal(true)} />
        
        <VendedoresFilters 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        
        <VendedoresTable vendedores={filteredVendedores} />
      </div>

      <VendedoresModal 
        show={showModal} 
        onClose={() => setShowModal(false)} 
      />
    </div>
  );
}
