"use client";

import React from "react";
import Image from "next/image";

export default function ClientProfileChat() {
  const messages = [
    {
      id: 1,
      sender: "client",
      text: "Hola, buenas tardes.",
      time: "10:25",
    },
    {
      id: 2,
      sender: "agent",
      text: "¡Hola! Buenas tardes. Gracias por comunicarte con nosotros. ¿En qué podemos ayudarte?",
      time: "01:25",
    },
    {
      id: 3,
      sender: "client",
      text: "Estoy interesado en un tour para este fin de semana en Cancún.",
      time: "10:25",
    },
    {
      id: 4,
      sender: "agent",
      text: "Con gusto. ¿Cuántas personas viajarían y qué fecha tienen en mente?",
      time: "01:25",
    },
    {
      id: 5,
      sender: "client",
      text: "Seríamos 2 adultos para el sábado.",
      time: "10:25",
    },
  ];

  return (
    <div>
      <h3 className="font-poppins h6 fw-semibold mb-4" style={{ color: "var(--dark-green)" }}>
        Conversaciones en WhatsApp
      </h3>

      <div className="d-flex flex-column gap-3 font-inter">
        {messages.map((msg) => {
          const isClient = msg.sender === "client";
          return (
            <div
              key={msg.id}
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
                  <i className="bi bi-check-all" style={{ fontSize: "14px" }}></i>
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
                  SL
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
