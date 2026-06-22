"use client";

import React, { use, useState } from "react";
import ClientProfileHeader from "@/components/client-profile/ClientProfileHeader";
import ClientProfileInfo from "@/components/client-profile/ClientProfileInfo";
import ClientProfileTabs from "@/components/client-profile/ClientProfileTabs";
import ClientProfileChat from "@/components/client-profile/ClientProfileChat";
import ClientProfileNotes from "@/components/client-profile/ClientProfileNotes";
import ClientProfileEmails from "@/components/client-profile/ClientProfileEmails";
import ClientProfileQuotes from "@/components/client-profile/ClientProfileQuotes";
import ClientProfilePurchases from "@/components/client-profile/ClientProfilePurchases";
import ClientProfileDocuments from "@/components/client-profile/ClientProfileDocuments";

export default function ClienteDetailPage({ params }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const [activeTab, setActiveTab] = useState("Conversaciones");

  return (
    <div className="container-fluid p-0">
      <div className="row g-4">
        {/* Columna principal (Izquierda) */}
        <div className="col-12 col-xl-9">
          <div className="bg-white p-4 p-md-5" style={{ borderRadius: "12px", boxShadow: "0 8px 16px 0 rgba(12, 12, 13, 0.1)" }}>
            <ClientProfileHeader />
            
            <hr className="my-4" style={{ borderTop: "1px solid rgba(0,0,0,0.05)" }} />
            
            <ClientProfileInfo />
            
            <hr className="my-4" style={{ borderTop: "1px solid rgba(0,0,0,0.05)" }} />
            
            <ClientProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            
            {activeTab === "Conversaciones" && <ClientProfileChat />}
            {activeTab === "Historial de correos" && <ClientProfileEmails />}
            {activeTab === "Cotizaciones" && <ClientProfileQuotes />}
            {activeTab === "Historial de compras" && <ClientProfilePurchases />}
            {activeTab === "Documentos" && <ClientProfileDocuments />}
          </div>
        </div>

        {/* Columna lateral (Derecha) */}
        <div className="col-12 col-xl-3">
          <ClientProfileNotes />
        </div>
      </div>
    </div>
  );
}
