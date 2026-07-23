"use client";

import React, { use, useState, useEffect } from "react";
import ClientProfileHeader from "@/components/client-profile/ClientProfileHeader";
import ClientProfileInfo from "@/components/client-profile/ClientProfileInfo";
import ClientProfileTabs from "@/components/client-profile/ClientProfileTabs";
import ClientProfileChat from "@/components/client-profile/ClientProfileChat";
import ClientProfileNotes from "@/components/client-profile/ClientProfileNotes";
import ClientProfileEmails from "@/components/client-profile/ClientProfileEmails";
import ClientProfileQuotes from "@/components/client-profile/ClientProfileQuotes";
import ClientProfilePurchases from "@/components/client-profile/ClientProfilePurchases";
import ClientProfileDocuments from "@/components/client-profile/ClientProfileDocuments";
import { clientsService } from "@/services/clients.service";

export default function ClienteDetailPage({ params }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const [activeTab, setActiveTab] = useState("Conversaciones");
  
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadClient() {
      try {
        setLoading(true);
        const data = await clientsService.getClientById(id);
        setClient(data);
      } catch (err) {
        console.error("Error al cargar detalles del cliente:", err);
        setError("No se pudo cargar la información del cliente.");
      } finally {
        setLoading(false);
      }
    }
    
    if (id) {
      loadClient();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="container-fluid p-0 d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="container-fluid p-0">
        <div className="alert alert-danger" role="alert">
          {error || "Cliente no encontrado"}
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-0">
      <div className="row g-4">
        {/* Columna principal (Izquierda) */}
        <div className="col-12 col-xl-9">
          <div className="bg-white p-4 p-md-5" style={{ borderRadius: "12px", boxShadow: "0 8px 16px 0 rgba(12, 12, 13, 0.1)" }}>
            <ClientProfileHeader client={client} />
            
            <hr className="my-4" style={{ borderTop: "1px solid rgba(0,0,0,0.05)" }} />
            
            <ClientProfileInfo client={client} />
            
            <hr className="my-4" style={{ borderTop: "1px solid rgba(0,0,0,0.05)" }} />
            
            <ClientProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            
            {activeTab === "Conversaciones" && <ClientProfileChat clientId={id} />}
            {activeTab === "Historial de correos" && <ClientProfileEmails clientId={id} />}
            {activeTab === "Cotizaciones" && <ClientProfileQuotes clientId={id} />}
            {activeTab === "Historial de compras" && <ClientProfilePurchases clientId={id} />}
            {activeTab === "Documentos" && <ClientProfileDocuments clientId={id} />}
          </div>
        </div>

        {/* Columna lateral (Derecha) */}
        <div className="col-12 col-xl-3">
          <ClientProfileNotes clientId={id} />
        </div>
      </div>
    </div>
  );
}
