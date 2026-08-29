"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { conectividadService } from "@/services/conectividad.service";

export default function ClientProfileChat({ clientId }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadChats() {
      try {
        setLoading(true);
        if (clientId) {
          const responseData = await conectividadService.getClientChats(clientId);
          setMessages(responseData.data || []);
        }
      } catch (error) {
        console.error("Error al cargar chats:", error);
      } finally {
        setLoading(false);
      }
    }
    loadChats();
  }, [clientId]);

  if (loading) {
    return <div className="text-center py-4"><div className="spinner-border text-primary" role="status"></div></div>;
  }

  return (
    <div>
      <h3 className="font-poppins h6 fw-semibold mb-4" style={{ color: "var(--dark-green)" }}>
        Conversaciones en WhatsApp
      </h3>

      <div className="d-flex flex-column gap-3 font-inter">
        {messages.map((msg, index) => {
          const isClient = msg.sender === "client";
          const showDateSeparator = index === 0 || msg.date !== messages[index - 1].date;
          return (
            <React.Fragment key={msg.id}>
              {showDateSeparator && msg.date && (
                <div className="text-center my-2">
                  <span className="badge text-muted fw-normal px-3 py-1 rounded-pill" style={{ backgroundColor: "#f1f5f9", fontSize: "11px" }}>
                    {msg.date}
                  </span>
                </div>
              )}
              <div
                className={`d-flex align-items-end gap-2 ${isClient ? "justify-content-start" : "justify-content-end"}`}
              >
              {isClient && (
                <div
                  className="rounded-circle overflow-hidden position-relative flex-shrink-0"
                  style={{ width: "32px", height: "32px" }}
                >
                  <Image
                    src="/avatar-placeholder.jpg"
                    alt="Avatar"
                    fill
                    className="object-fit-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.parentElement.style.backgroundColor = "#e1e1e1";
                    }}
                  />
                </div>
              )}

              <div
                className="d-flex align-items-end gap-2"
                style={{
                  backgroundColor: isClient ? "#f1f5f9" : "#5145cd",
                  color: isClient ? "#0f1901" : "#ffffff",
                  padding: "10px 16px",
                  borderRadius: "16px",
                  borderBottomLeftRadius: isClient ? "4px" : "16px",
                  borderBottomRightRadius: !isClient ? "4px" : "16px",
                  maxWidth: "70%",
                }}
              >
                <span style={{ fontSize: "13px", lineHeight: "1.4" }}>{msg.text}</span>
                <span
                  className="d-flex align-items-center gap-1 flex-shrink-0"
                  style={{
                    fontSize: "11px",
                    color: isClient ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.7)",
                    marginLeft: "8px",
                  }}
                >
                  {msg.time}
                  {!isClient && <i className="bi bi-check-all" style={{ fontSize: "14px" }}></i>}
                </span>
              </div>

              {!isClient && (
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 fw-bold"
                  style={{
                    width: "32px",
                    height: "32px",
                    backgroundColor: "#e7f1fe",
                    color: "#0c5cc6",
                    fontSize: "12px",
                  }}
                >
                  {msg.sender ? msg.sender.charAt(0).toUpperCase() : "A"}
                </div>
              )}
            </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
