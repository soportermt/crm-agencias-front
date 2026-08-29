"use client";

import React, { useState, useEffect, useCallback } from "react";
import { clientsService } from "@/services/clients.service";

export default function ClientProfileNotes({ clientId }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState(null);

  const loadNotes = useCallback(async () => {
    if (!clientId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await clientsService.getClientNotes(clientId);
      setNotes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al cargar notas:", err);
      setError("No se pudieron cargar las notas.");
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    try {
      setSaving(true);
      setError(null);
      const created = await clientsService.createClientNote(clientId, newNote.trim());
      setNotes((prev) => [created, ...prev]);
      setNewNote("");
    } catch (err) {
      console.error("Error al guardar la nota:", err);
      setError("Error al guardar la nota. Intenta nuevamente.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta nota?")) {
      return;
    }

    try {
      setDeletingId(noteId);
      setError(null);
      await clientsService.deleteClientNote(noteId);
      setNotes((prev) => prev.filter((n) => (n.id_nota || n.id) !== noteId));
    } catch (err) {
      console.error("Error al eliminar nota:", err);
      setError("No se pudo eliminar la nota.");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr.replace(" ", "T"));
      if (isNaN(d.getTime())) return dateStr;
      return new Intl.DateTimeFormat("es-MX", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(d);
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="bg-white p-4 d-flex flex-column" style={{ borderRadius: "12px", boxShadow: "0 8px 16px 0 rgba(12, 12, 13, 0.1)" }}>
      <h3 className="font-poppins h6 fw-semibold mb-4" style={{ color: "var(--dark-green)" }}>
        Notas
      </h3>

      <div className="d-flex flex-column gap-4 flex-grow-1 font-inter overflow-auto pe-2" style={{ fontSize: "13px", color: "var(--grey-text)", maxHeight: "450px" }}>
        {loading ? (
          <div className="text-center py-2">
            <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
          </div>
        ) : notes.length > 0 ? (
          notes.map((note) => {
            const noteId = note.id_nota || note.id;
            const isDeleting = deletingId === noteId;

            return (
              <div key={noteId} className="d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start">
                  <p className="mb-1 lh-base text-break" style={{ whiteSpace: "pre-wrap" }}>
                    {note.text || note.nota}
                  </p>
                  <button
                    onClick={() => handleDeleteNote(noteId)}
                    disabled={isDeleting}
                    className="btn btn-link text-danger p-0 ms-2 text-decoration-none"
                    style={{ fontSize: "13px" }}
                  >
                    {isDeleting ? (
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    ) : (
                      <i className="bi bi-trash3"></i>
                    )}
                  </button>
                </div>
                <div className="text-muted" style={{ fontSize: "11px" }}>
                  {formatDate(note.fecha_creacion || note.fecha)} {note.usuario && `• ${note.usuario}`}
                </div>
              </div>
            );
          })
        ) : (
          <p className="mb-0 lh-base fst-italic">No hay notas para este cliente.</p>
        )}
      </div>

      <div className="mt-4">
        {error && <div className="text-danger small mb-2 font-inter">{error}</div>}
        <textarea
          className="form-control font-inter mb-3"
          rows="3"
          placeholder="Escribe una nueva nota..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          disabled={saving}
          style={{
            fontSize: "13px",
            borderRadius: "8px",
            resize: "none",
          }}
        ></textarea>
        
        <button
          className="btn w-100 transition-smooth fw-medium"
          onClick={handleAddNote}
          disabled={saving || !newNote.trim()}
          style={{
            backgroundColor: (saving || !newNote.trim()) ? "#dbe8f9" : "var(--primary-color, #0d6efd)",
            color: "#ffffff",
            borderRadius: "8px",
            padding: "10px 16px",
            fontSize: "13px",
          }}
        >
          {saving ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Guardando...
            </>
          ) : (
            "Agregar nota"
          )}
        </button>
      </div>
    </div>
  );
}
