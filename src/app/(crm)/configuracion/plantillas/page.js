"use client";

import React from "react";
import PlantillasTab from "@/components/configuracion/PlantillasTab";
import ConfigSidebar from "@/components/configuracion/ConfigSidebar";
import ConfiguracionHeader from "@/components/configuracion/ConfiguracionHeader";
import { useRouter } from "next/navigation";

export default function PlantillasPage() {
  const router = useRouter();

  const handleTabChange = (tabId) => {
    if (tabId === "plantillas") return;
    router.push("/configuracion");
  };

  return (
    <div className="d-flex flex-column w-100 p-2 gap-3">
      <ConfiguracionHeader activeTab="plantillas" />
      <div className="bg-white rounded-4 shadow-sm w-100 d-flex flex-column flex-md-row p-3 gap-4 mb-2" style={{ flex: 1 }}>
        <ConfigSidebar activeTab="plantillas" setActiveTab={handleTabChange} />
        <div className="flex-grow-1">
          <PlantillasTab />
        </div>
      </div>
    </div>
  );
}
