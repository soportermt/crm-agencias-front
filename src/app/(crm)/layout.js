"use client";

import React, { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import RightBar from "@/components/layout/RightBar";
import Header from "@/components/layout/Header";
import ClientModal from "@/components/clients/ClientModal";

export default function CRMLayout({ children }) {
  const [showClientModal, setShowClientModal] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="d-flex min-vh-100 font-inter bg-light overflow-x-hidden position-relative">
      <Sidebar
        onRegisterClientClick={() => setShowClientModal(true)}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      <div className="flex-grow-1 d-flex flex-column vh-100 crm-content-wrapper overflow-hidden" style={{ minWidth: 0 }}>
        <Header onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />

        <main className="p-4 flex-grow-1 overflow-y-auto" style={{ backgroundColor: "var(--bg-light)" }}>
          {children}
        </main>
      </div>

      <RightBar onRegisterClientClick={() => setShowClientModal(true)} />

      <ClientModal
        show={showClientModal}
        onClose={() => setShowClientModal(false)}
      />
    </div>
  );
}
