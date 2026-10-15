"use client";

import React, { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import ConfigSidebar from "@/components/configuracion/ConfigSidebar";
import GeneralTab from "@/components/configuracion/GeneralTab";
import UsuariosTab from "@/components/configuracion/UsuariosTab";
import BancosTab from "@/components/configuracion/BancosTab";
import TerminosTab from "@/components/configuracion/TerminosTab";
import ConectividadTab from "@/components/configuracion/ConectividadTab";
import PlantillasTab from "@/components/configuracion/PlantillasTab";
import ConfiguracionHeader from "@/components/configuracion/ConfiguracionHeader";

const TABS_VALIDOS = ["general", "usuarios", "bancos", "terminos", "conectividad", "plantillas"];

function ConfiguracionContent() {
  const searchParams = useSearchParams();
  const tabUrl = searchParams?.get("tab");
  const initialTab = TABS_VALIDOS.includes(tabUrl) ? tabUrl : "general";

  const [activeTab, setActiveTab] = useState(initialTab);

  return (
    <div className="d-flex flex-column w-100 p-2 gap-3">
      <ConfiguracionHeader activeTab={activeTab} />
      <div className="bg-white rounded-2 shadow-sm w-100 d-flex flex-column flex-md-row p-3 gap-4 mb-2" style={{ flex: 1 }}>
        <ConfigSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-grow-1">
          {activeTab === "general" && <GeneralTab />}
          {activeTab === "usuarios" && <UsuariosTab />}
          {activeTab === "bancos" && <BancosTab />}
          {activeTab === "terminos" && <TerminosTab />}
          {activeTab === "conectividad" && <ConectividadTab />}
          {activeTab === "plantillas" && <PlantillasTab />}
        </div>
      </div>
    </div>
  );
}

export default function ConfiguracionPage() {
  return (
    <Suspense fallback={null}>
      <ConfiguracionContent />
    </Suspense>
  );
}
