"use client";

import React, { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import RightBar from "@/components/layout/RightBar";
import Header from "@/components/layout/Header";
import ClientModal from "@/components/clients/ClientModal";

export default function CRMLayout({ children }) {
  const [showClientModal, setShowClientModal] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [leftSidebarPinned, setLeftSidebarPinned] = useState(true);
  const [rightSidebarPinned, setRightSidebarPinned] = useState(true);
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    const leftPinned = localStorage.getItem("leftSidebarPinned");
    const rightPinned = localStorage.getItem("rightSidebarPinned");
    if (leftPinned !== null) setLeftSidebarPinned(leftPinned === "true");
    if (rightPinned !== null) setRightSidebarPinned(rightPinned === "true");
    setMounted(true);
  }, []);

  const handleToggleLeftSidebar = () => {
    const nextState = !leftSidebarPinned;
    setLeftSidebarPinned(nextState);
    localStorage.setItem("leftSidebarPinned", String(nextState));
  };

  const handleToggleRightSidebar = () => {
    const nextState = !rightSidebarPinned;
    setRightSidebarPinned(nextState);
    localStorage.setItem("rightSidebarPinned", String(nextState));
  };

  const sidebarWidth = leftSidebarPinned ? "284px" : "80px";
  const rightbarWidth = rightSidebarPinned ? "284px" : "80px";

  const layoutStyle = mounted ? {
    "--sidebar-width": sidebarWidth,
    "--rightbar-width": rightbarWidth
  } : {
    "--sidebar-width": "284px",
    "--rightbar-width": "284px"
  };

  return (
    <div 
      className="d-flex min-vh-100 font-inter bg-light overflow-x-hidden position-relative"
      style={layoutStyle}
    >
      <Sidebar
        onRegisterClientClick={() => setShowClientModal(true)}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        isPinned={leftSidebarPinned}
        onTogglePin={handleToggleLeftSidebar}
      />

      <div className="flex-grow-1 d-flex flex-column vh-100 crm-content-wrapper overflow-hidden" style={{ minWidth: 0 }}>
        <Header onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />

        <main className="p-4 flex-grow-1 overflow-y-auto" style={{ backgroundColor: "var(--bg-light)" }}>
          {children}
        </main>
      </div>

      <RightBar 
        onRegisterClientClick={() => setShowClientModal(true)}
        isPinned={rightSidebarPinned}
        onTogglePin={handleToggleRightSidebar}
      />

      <ClientModal
        show={showClientModal}
        onClose={() => setShowClientModal(false)}
      />
    </div>
  );
}
