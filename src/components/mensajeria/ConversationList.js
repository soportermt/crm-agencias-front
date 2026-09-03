"use client";

import React, { useRef, useCallback } from "react";
import { getInitials, formatTime, WA_STATUS } from "./utils";

export default function ConversationList({
  conversations,
  selectedId,
  selectedClientId,
  onSelect,
  statusFilter,
  onStatusChange,
  searchQuery,
  onSearchChange,
  onClearSearch,
  loading,
  isSearchingGlobal,
  hasMore,
  loadingMore,
  onLoadMore,
}) {
  const observer = useRef();
  
  const lastElementRef = useCallback((node) => {
    if (loading || loadingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        onLoadMore();
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasMore, onLoadMore]);

  const statuses = [
    { key: "open", label: "Nuevas", icon: "bi-stars" },
    { key: "pending", label: "En proceso", icon: "bi-hourglass-split" },
    { key: "closed", label: "Cerradas", icon: "bi-check2-circle" },
  ];

  const isSearching = searchQuery.trim().length > 0;

  return (
    <div className="d-flex flex-column h-100 bg-white" style={{ borderRadius: "12px", overflow: "hidden" }}>
      {/* Buscador */}
      <div className="p-3 border-bottom" style={{ borderColor: "#f0f0f0" }}>
        <div className="position-relative">
          <i
            className="bi bi-search position-absolute text-secondary"
            style={{ left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "13px" }}
          ></i>
          <input
            type="text"
            className="form-control input-custom ps-5 pe-5"
            placeholder="Buscar conversación o cliente..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{ height: "40px", fontSize: "13px" }}
          />
          {isSearchingGlobal && (
            <div
              className="position-absolute d-flex align-items-center justify-content-center"
              style={{
                right: isSearching ? "32px" : "12px",
                top: "50%",
                transform: "translateY(-50%)",
              }}
            >
              <div className="spinner-border text-primary" role="status" style={{ width: "14px", height: "14px", borderWidth: "2px" }}></div>
            </div>
          )}
          {isSearching && (
            <button
              type="button"
              onClick={onClearSearch}
              className="btn p-0 border-0 position-absolute d-flex align-items-center justify-content-center"
              style={{
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "20px",
                height: "20px",
                fontSize: "16px",
                lineHeight: 1,
                color: "var(--grey-text)",
              }}
              aria-label="Limpiar búsqueda"
              title="Limpiar búsqueda"
            >
              <i className="bi bi-x"></i>
            </button>
          )}
        </div>
      </div>

      {/* Filtro de estado (oculto durante la búsqueda) */}
      {!isSearching && (
        <div className="d-flex align-items-center justify-content-between px-2 py-2 border-bottom" style={{ borderColor: "#f0f0f0" }}>
          {statuses.map((st) => {
            const isActive = statusFilter === st.key;
            return (
              <button
                key={st.key}
                onClick={() => onStatusChange(st.key)}
                className="btn border-0 fw-medium d-flex align-items-center justify-content-center gap-1 transition-smooth flex-grow-1 mx-1 px-1"
                style={{
                  paddingTop: "5px",
                  paddingBottom: "5px",
                  borderRadius: "20px",
                  fontSize: "11.5px",
                  backgroundColor: isActive ? "#e7f1fe" : "transparent",
                  color: isActive ? "#0c5cc6" : "var(--grey-text)",
                  whiteSpace: "nowrap"
                }}
              >
                <i className={`bi ${st.icon}`} style={{ fontSize: "12px" }}></i>
                {st.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Lista */}
      <div className="flex-grow-1 overflow-y-auto">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status" style={{ width: "22px", height: "22px" }}></div>
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-5 px-3">
            <i className="bi bi-chat-dots text-secondary" style={{ fontSize: "28px" }}></i>
            <p className="small text-secondary mt-2 mb-0" style={{ color: "var(--grey-text)" }}>
              {isSearching
                ? `No se encontraron resultados para "${searchQuery}"`
                : `No hay conversaciones ${statusFilter !== "all" ? `en "${WA_STATUS[statusFilter]?.label || statusFilter}"` : "todavía"}`}
            </p>
          </div>
        ) : (
          conversations.map((conv, index) => {
            const isSelected = conv.id
              ? selectedId === conv.id
              : Boolean(selectedClientId && Number(selectedClientId) === Number(conv.clientId));
            const isNotOpened = conv.status === "not_opened";
            const name = conv.clientName || conv.client_name || conv.nombreCompleto || conv.nombre || conv.name || "Cliente";
            const preview = conv.lastMessagePreview || conv.last_message_preview || "Sin mensajes";
            const time = conv.lastMessageAt || conv.last_message_at;
            const unread = conv.unreadCount ?? conv.unread_count ?? 0;
            const statusMeta = WA_STATUS[conv.status] || WA_STATUS.open;
            const key = conv.id ? `conv-${conv.id}` : `client-${conv.clientId}`;
            const isLastElement = conversations.length === index + 1;

            return (
              <button
                key={key}
                ref={isLastElement ? lastElementRef : null}
                onClick={() => onSelect(conv)}
                className={`w-100 text-start border-0 bg-transparent d-flex align-items-center gap-2 px-3 py-2 mensajeria-conversation-item ${isSelected ? "active" : ""}`}
                style={{ fontSize: "13px" }}
              >
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 fw-bold"
                  style={{
                    width: "40px",
                    height: "40px",
                    backgroundColor: isSelected ? "#dbeafe" : isNotOpened ? "#f8fafc" : "#e7f1fe",
                    color: isNotOpened ? "#64748b" : "#0c5cc6",
                    fontSize: "13px",
                    border: isNotOpened ? "1px dashed #cbd5e1" : "none",
                  }}
                >
                  {getInitials(name)}
                </div>

                <div className="flex-grow-1 overflow-hidden">
                  <div className="d-flex align-items-center justify-content-between gap-2">
                    <span className="fw-semibold text-truncate" style={{ color: "#0f1901" }}>
                      {name}
                    </span>
                    <span className="flex-shrink-0 small" style={{ color: "#9ca3af", fontSize: "11px" }}>
                      {formatTime(time)}
                    </span>
                  </div>
                  <div className="d-flex align-items-center justify-content-between gap-2">
                    <span
                      className="text-truncate text-secondary"
                      style={{
                        color: isNotOpened ? "#94a3b8" : "var(--grey-text)",
                        fontSize: "12px",
                        fontStyle: isNotOpened ? "italic" : "normal",
                      }}
                    >
                      {preview}
                    </span>
                    <span className="d-flex align-items-center gap-1 flex-shrink-0">
                      <span
                        className="rounded-pill fw-medium"
                        style={{
                          fontSize: "10px",
                          padding: "2px 8px",
                          backgroundColor: statusMeta.bg,
                          color: statusMeta.color,
                        }}
                      >
                        {statusMeta.label}
                      </span>
                      {unread > 0 && (
                        <span className="badge rounded-pill bg-danger fw-bold" style={{ fontSize: "10px", padding: "3px 6px" }}>
                          {unread}
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </button>
            );
          })
        )}
        {loadingMore && (
          <div className="text-center py-3">
            <div className="spinner-border text-primary" role="status" style={{ width: "18px", height: "18px", borderWidth: "2px" }}></div>
          </div>
        )}
      </div>
    </div>
  );
}
