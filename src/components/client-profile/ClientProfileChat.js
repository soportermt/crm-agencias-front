"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { conectividadService } from "@/services/conectividad.service";

export default function ClientProfileChat({ clientId }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadChats() {
      try {
        setLoading(true);
        if (clientId) {
          const res = await conectividadService.getClientChats(clientId);
          const allMessages = Array.isArray(res) ? res : res?.data || [];
          // Mostrar solo los últimos 5 mensajes
          setMessages(allMessages.slice(-5));
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
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h3 className="font-poppins h6 fw-semibold mb-0" style={{ color: "var(--dark-green)" }}>
          Conversaciones en WhatsApp
        </h3>
        <Link
          href={`/mensajeria?clientId=${clientId}`}
          className="btn btn-bg-style d-flex align-items-center gap-2 fw-medium"
          style={{ fontSize: "12.5px", padding: "6px 14px", borderRadius: "8px" }}
        >
          <i className="bi bi-whatsapp" style={{ fontSize: "14px", color: "#25D366" }}></i>
          Abrir en Bandeja
        </Link>
      </div>

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
                  className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 fw-bold animate-fade-in"
                  style={{ width: "32px", height: "32px", backgroundColor: "#e7f1fe", color: "#0c5cc6", fontSize: "12px" }}
                >
                  CL
                </div>
              )}

              <div
                className="d-flex align-items-end gap-2"
                style={{
                  backgroundColor: isClient ? "#ffffff" : "#5145cd",
                  color: isClient ? "#0f1901" : "#ffffff",
                  border: isClient ? "1px solid #e5e7eb" : "none",
                  boxShadow: isClient ? "0 1px 1px rgba(15,25,1,0.04)" : "0 1px 1px rgba(15,25,1,0.05)",
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
