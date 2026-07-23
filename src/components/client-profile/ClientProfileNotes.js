"use client";

import React, { useState, useEffect } from "react";
import { clientsService } from "@/services/clients.service";

export default function ClientProfileNotes({ clientId }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNotes() {
      try {
        setLoading(true);
        if (clientId) {
          const data = await clientsService.getClientNotes(clientId);
          setNotes(data);
        }
      } catch (error) {
        console.error("Error al cargar notas:", error);
      } finally {
        setLoading(false);
      }
    }
    loadNotes();
  }, [clientId]);

  return (
    <div className="bg-white p-4 d-flex flex-column" style={{ borderRadius: "12px", boxShadow: "0 8px 16px 0 rgba(12, 12, 13, 0.1)" }}>
      <h3 className="font-poppins h6 fw-semibold mb-4" style={{ color: "var(--dark-green)" }}>
        Notas
      </h3>

      <div className="d-flex flex-column gap-4 flex-grow-1 font-inter" style={{ fontSize: "13px", color: "var(--grey-text)" }}>
        {loading ? (
          <div className="text-center py-2"><div className="spinner-border spinner-border-sm text-success" role="status"></div></div>
        ) : notes.length > 0 ? (
          notes.map((note) => (
            <p key={note.id} className="mb-0 lh-base">
              {note.text}
            </p>
          ))
        ) : (
          <p className="mb-0 lh-base fst-italic">No hay notas para este cliente.</p>
        )}
      </div>

      <button
        className="btn w-100 transition-smooth fw-medium mt-4"
        style={{
          backgroundColor: "#dbe8f9",
          color: "#ffffff",
          borderRadius: "8px",
          padding: "10px 16px",
          fontSize: "13px",
        }}
      >
        Confirmar cambios
      </button>
    </div>
  );
}
