"use client";

import React, { useState, useEffect } from "react";
import { conectividadService } from "@/services/conectividad.service";

export default function ClientProfileEmails({ clientId, clientEmail }) {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEmails() {
      try {
        setLoading(true);
        if (clientId) {
          const data = await conectividadService.getClientEmails(clientId);
          setEmails(Array.isArray(data) ? data : data?.data || []);
        }
      } catch (error) {
        console.error("Error al cargar correos:", error);
      } finally {
        setLoading(false);
      }
    }
    loadEmails();
  }, [clientId, clientEmail]);

  if (loading) {
    return <div className="text-center py-4"><div className="spinner-border text-primary" role="status"></div></div>;
  }

  return (
    <div className="d-flex flex-column gap-3 w-100 font-inter">
      <div className="d-flex align-items-center justify-content-between">
        <p
          className="fw-medium mb-0"
          style={{
            fontSize: "18px",
            lineHeight: "28px",
            color: "#1e293b",
          }}
        >
          Historial de correos
        </p>
      </div>

      <div
        className="d-flex flex-column bg-white border"
        style={{ borderColor: "#f0f0f0" }}
      >
        {emails.map((email) => (
          <div
            key={email.id}
            className="d-flex align-items-center w-100 border-bottom position-relative"
            style={{ borderColor: "#f0f0f0", minHeight: "36px" }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: "4px",
                backgroundColor: "#316ab7",
                display: email.unread ? "block" : "none",
              }}
            ></div>

            <div
              className="d-flex align-items-center gap-3 px-3 py-2"
              style={{ width: "220px", flexShrink: 0 }}
            >
              <div
                className="d-flex align-items-center justify-content-center rounded-circle text-white"
                style={{
                  width: "28px",
                  height: "28px",
                  backgroundColor: email.avatarBg,
                  fontSize: "10px",
                  fontWeight: "600",
                  fontFamily: "Segoe UI, sans-serif",
                }}
              >
                {email.initials}
              </div>
              <span
                style={{
                  fontSize: "14px",
                  lineHeight: "16px",
                  color: "#212121",
                  fontWeight: email.unread ? 600 : 400,
                  fontFamily: "Segoe UI, sans-serif",
                }}
              >
                {email.sender}
              </span>
            </div>

            <div className="d-flex align-items-center gap-3 px-3 py-2 flex-grow-1 overflow-hidden">
              <span
                className="text-truncate"
                style={{
                  fontSize: "14px",
                  lineHeight: "16px",
                  color: email.unread ? "#316ab7" : "#000000",
                  fontWeight: email.unread ? 600 : 400,
                  width: "160px",
                  flexShrink: 0,
                  fontFamily: "Segoe UI, sans-serif",
                }}
              >
                {email.subject}
              </span>
              <span
                className="text-secondary text-truncate"
                style={{
                  fontSize: "14px",
                  lineHeight: "16px",
                  color: "#434343",
                  fontFamily: "Segoe UI, sans-serif",
                }}
              >
                {email.preview}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

