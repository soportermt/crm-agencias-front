"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { WA_STATUS, formatPhone } from "./utils";

function formatMessageTime(timeStr, dateStr) {
  const dt = dateStr ? new Date(`${dateStr}T${timeStr || "00:00"}`) : new Date();
  if (isNaN(dt.getTime())) return timeStr || "";
  return dt.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", hour12: true });
}

export default function ChatPanel({
  conversation,
  clientInfo,
  messages,
  loadingMessages,
  sending,
  channel,
  onSendMessage,
  onComposeEmail,
  onStatusChange,
  hasEmailAccount,
  onOpenConversation,
  windowOpen = false,
  onClose,
}) {
  const [text, setText] = useState("");
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [unreadToDisplay, setUnreadToDisplay] = useState(0);
  const bodyRef = useRef(null);
  const textareaRef = useRef(null);
  const isWindowOpen = Boolean(windowOpen);

  // Guardar unreadCount inicial al cambiar de conversación
  useEffect(() => {
    if (conversation) {
      setUnreadToDisplay(conversation.unreadCount || 0);
    }
  }, [conversation?.id]);

  // Auto-scroll inicial o cuando cargan mensajes
  useEffect(() => {
    if (loadingMessages) return; // Esperar a que carguen los mensajes

    const timer = setTimeout(() => {
      if (bodyRef.current) {
        if (unreadToDisplay > 0) {
          const unreadEl = document.getElementById("first-unread-divider");
          if (unreadEl) {
            unreadEl.scrollIntoView({ behavior: "auto", block: "center" });
          } else {
            bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
          }
        } else {
          bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
        }
        
        const { scrollTop, scrollHeight, clientHeight } = bodyRef.current;
        const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
        
        if (isAtBottom && unreadToDisplay === 0) {
          setShowScrollButton(false);
        } else if (!isAtBottom) {
          setShowScrollButton(true);
        }
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [conversation?.id, loadingMessages]);

  // Manejo de scroll para el indicador "Nuevo mensaje" (solo botón)
  const handleScroll = useCallback(() => {
    if (!bodyRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = bodyRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50; // Margen de 50px
    
    if (isAtBottom) {
      setShowScrollButton(false);
    } else {
      setShowScrollButton(true);
    }
  }, []);

  const prevMessagesLengthRef = useRef(0);

  // Efecto cuando llegan nuevos mensajes
  useEffect(() => {
    if (!bodyRef.current) {
      prevMessagesLengthRef.current = messages.length;
      return;
    }
    
    const prevLength = prevMessagesLengthRef.current;
    prevMessagesLengthRef.current = messages.length;

    if (prevLength === 0 || messages.length <= prevLength) {
      return;
    }

    const { scrollTop, scrollHeight, clientHeight } = bodyRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 150; // Tolerancia
    
    // Contamos los nuevos mensajes inbound para mantener el divisor hasta que conteste
    let newInboundCount = 0;
    for (let i = prevLength; i < messages.length; i++) {
      if (messages[i].direction === "inbound") {
         newInboundCount++;
      }
    }
    if (newInboundCount > 0) {
      setUnreadToDisplay(prev => prev + newInboundCount);
    }

    if (isAtBottom) {
      // Si está abajo, auto-scroll sin limpiar divisor
      setTimeout(() => {
        if (bodyRef.current) {
          bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
        }
      }, 50);
    }
  }, [messages.length]);

  const scrollToBottom = () => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
      setShowScrollButton(false);
    }
  };

  useEffect(() => {
    setText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "43px";
    }
  }, [conversation?.id]);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || sending || !isWindowOpen) return;
    onSendMessage(trimmed);
    setText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "43px";
    }
    setUnreadToDisplay(0);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e) => {
    setText(e.target.value);
    const el = e.target;
    el.style.height = "43px";
    el.style.height = `${Math.min(Math.max(el.scrollHeight, 43), 120)}px`;
  };

  if (!conversation) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center h-100 bg-white" style={{ borderRadius: "12px" }}>
        <i className="bi bi-chat-left-text text-secondary" style={{ fontSize: "44px", color: "#cbd5e1" }}></i>
        <p className="mt-3 mb-1 fw-medium" style={{ color: "#0f1901", fontSize: "14px" }}>
          Selecciona una conversación
        </p>
        <p className="small mb-0" style={{ color: "var(--grey-text)" }}>
          Elige un cliente para ver su historial de mensajes
        </p>
        <button
          onClick={onOpenConversation}
          className="btn btn-primary-custom d-flex align-items-center gap-2 mt-3"
          style={{ fontSize: "13px", padding: "10px 16px", borderRadius: "12px" }}
        >
          <i className="bi bi-whatsapp" style={{ fontSize: "15px" }}></i>
          Nueva conversación
        </button>
      </div>
    );
  }

  const clientName = clientInfo?.nombreCompleto || clientInfo?.name || conversation.clientName || conversation.client_name || "Cliente";
  const clientPhone = formatPhone(clientInfo?.celular || conversation.clientPhone || conversation.client_phone || "");
  const statusMeta = WA_STATUS[conversation?.status] || WA_STATUS.open;

  return (
    <div className="d-flex flex-column h-100 bg-white" style={{ borderRadius: "12px", overflow: "hidden" }}>
      {/* Header del chat */}
      <div className="d-flex align-items-center gap-2 px-3 py-2 border-bottom" style={{ borderColor: "#f0f0f0", minHeight: "64px" }}>
        <div
          className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 fw-bold"
          style={{
            width: "38px",
            height: "38px",
            backgroundColor: "#e7f1fe",
            color: "#0c5cc6",
            fontSize: "13px",
          }}
        >
          {(clientName || "CL").substring(0, 2).toUpperCase()}
        </div>
        <div className="flex-grow-1 overflow-hidden">
          <div className="d-flex align-items-center gap-2">
            <span className="fw-semibold text-truncate" style={{ color: "#0f1901", fontSize: "14px" }}>
              {clientName}
            </span>
            <span
              className="rounded-pill fw-medium flex-shrink-0"
              style={{ fontSize: "10px", padding: "2px 8px", backgroundColor: statusMeta.bg, color: statusMeta.color }}
            >
              {statusMeta.label}
            </span>
          </div>
          <div className="text-truncate small" style={{ color: "var(--grey-text)", fontSize: "12px" }}>
            <i className="bi bi-whatsapp me-1" style={{ color: "#25D366" }}></i>
            {clientPhone}
          </div>
        </div>
        {clientInfo?.id && (
          <Link
            href={`/clientes/${clientInfo.id}`}
            className="btn btn-bg-style d-flex align-items-center gap-1 flex-shrink-0 fw-medium"
            style={{ fontSize: "12px", padding: "6px 12px", borderRadius: "8px" }}
          >
            <i className="bi bi-person-lines-fill" style={{ fontSize: "13px" }}></i>
            Ver perfil
          </Link>
        )}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="btn btn-bg-style d-flex align-items-center justify-content-center flex-shrink-0"
            style={{ width: "32px", height: "32px", padding: 0, borderRadius: "8px", color: "var(--grey-text)" }}
            title="Cerrar chat"
          >
            <i className="bi bi-x-lg" style={{ fontSize: "13px" }}></i>
          </button>
        )}
      </div>

      {/* Barra de seguimiento de estado */}
      {onStatusChange && (
        <div className="d-flex align-items-center gap-2 px-3 py-2 border-bottom" style={{ borderColor: "#f0f0f0", backgroundColor: "#fafafa" }}>
          <span className="small fw-medium flex-shrink-0" style={{ color: "var(--grey-text)", fontSize: "12px" }}>
            Seguimiento:
          </span>
          {Object.entries(WA_STATUS).map(([key, meta]) => {
            const isActive = conversation?.status === key;
            return (
              <button
                key={key}
                onClick={() => onStatusChange(key)}
                className="btn border-0 d-flex align-items-center gap-1 fw-medium transition-smooth"
                style={{
                  padding: "4px 12px",
                  borderRadius: "16px",
                  fontSize: "12px",
                  backgroundColor: isActive ? meta.bg : "transparent",
                  color: isActive ? meta.color : "var(--grey-text)",
                }}
              >
                <span className="rounded-circle" style={{ width: "6px", height: "6px", backgroundColor: meta.color }}></span>
                {meta.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Cuerpo del chat */}
      <div 
        className="mensajeria-chat-body flex-grow-1 px-3 py-3 position-relative" 
        ref={bodyRef} 
        onScroll={handleScroll}
        style={{ overflowY: 'auto' }}
      >
        {/* Botón flotante para hacer scroll al final */}
        {showScrollButton && (
          <button
            onClick={scrollToBottom}
            className="btn btn-light rounded-circle shadow position-sticky d-flex align-items-center justify-content-center"
            style={{
              bottom: "16px",
              left: "calc(100% - 48px)",
              width: "40px",
              height: "40px",
              zIndex: 10,
              backgroundColor: "white",
              border: "1px solid #e2e8f0"
            }}
          >
            <i className="bi bi-chevron-down text-secondary" style={{ fontSize: "18px", WebkitTextStroke: "1px" }}></i>
            {unreadToDisplay > 0 && (
              <span 
                className="position-absolute translate-middle badge rounded-pill bg-success"
                style={{ top: "0", left: "0", fontSize: "10px", padding: "4px 6px" }}
              >
                {unreadToDisplay}
              </span>
            )}
          </button>
        )}
        {loadingMessages ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status" style={{ width: "22px", height: "22px" }}></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-bubbles text-secondary" style={{ fontSize: "30px", color: "#cbd5e1" }}></i>
            <p className="small mt-2 mb-0" style={{ color: "var(--grey-text)" }}>
              Sin mensajes todavía. Inicia la conversación.
            </p>
          </div>
        ) : (
          <div className="d-flex flex-column gap-2">
            {(() => {
              // Calcular índice del divisor de mensajes no leídos
              let unreadDividerIndex = -1;
              if (unreadToDisplay > 0 && messages.length > 0) {
                let inboundCount = 0;
                for (let i = messages.length - 1; i >= 0; i--) {
                  const msg = messages[i];
                  const isAgent = msg.sender !== "client" && msg.direction !== "inbound";
                  if (!isAgent) {
                    inboundCount++;
                    if (inboundCount === unreadToDisplay) {
                      unreadDividerIndex = i;
                      break;
                    }
                  }
                }
              }

              return messages.map((msg, index) => {
                const isAgent = msg.sender !== "client" && msg.direction !== "inbound";
                const isDivider = index === unreadDividerIndex;
                
                return (
                  <React.Fragment key={msg.id || `${msg.clientId}-${msg.time}`}>
                    {isDivider && (
                      <div className="d-flex align-items-center my-3" id="first-unread-divider">
                        <div className="flex-grow-1 border-bottom" style={{ borderColor: "#e2e8f0" }}></div>
                        <span className="mx-3 fw-medium" style={{ fontSize: "12px", color: "#0c5cc6", backgroundColor: "#e7f1fe", padding: "2px 10px", borderRadius: "12px" }}>
                          {unreadToDisplay} mensaje{unreadToDisplay !== 1 ? 's' : ''} nuevo{unreadToDisplay !== 1 ? 's' : ''}
                        </span>
                        <div className="flex-grow-1 border-bottom" style={{ borderColor: "#e2e8f0" }}></div>
                      </div>
                    )}
                    <div className={`d-flex align-items-end gap-2 ${isAgent ? "justify-content-end" : "justify-content-start"}`}>
                      <div className={`mensajeria-bubble ${isAgent ? "out" : "in"}`}>
                        <span>{msg.text}</span>
                        <span
                          className="d-flex align-items-center gap-1 flex-shrink-0"
                          style={{
                            fontSize: "11px",
                            color: isAgent ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.5)",
                            marginLeft: "8px",
                            marginTop: "2px",
                          }}
                        >
                          {msg.time || formatMessageTime(msg.time, msg.date)}
                          {isAgent && <i className="bi bi-check-all" style={{ fontSize: "13px" }}></i>}
                        </span>
                      </div>
                    </div>
                  </React.Fragment>
                );
              });
            })()}
          </div>
        )}
      </div>

      {/* Composer WhatsApp */}
      <div className="mensajeria-composer bg-white" style={{ borderColor: "#f0f0f0" }}>
        {!isWindowOpen && (
          <div
            className="d-flex align-items-center gap-2 mb-2 px-3 py-2 rounded-3"
            style={{
              backgroundColor: "#fef9ee",
              border: "1px solid #f9e6b3",
              color: "#8a6100",
              fontSize: "12px",
            }}
          >
            <i className="bi bi-info-circle flex-shrink-0" style={{ color: "#d97706", fontSize: "14px" }}></i>
            <span className="flex-grow-1">La ventana de 24 horas está cerrada. Abre la conversación con una plantilla.</span>
          </div>
        )}
        <div className="d-flex align-items-end gap-2">
          {!isWindowOpen && (
            <button
              type="button"
              onClick={onOpenConversation}
              className="btn btn-bg-style d-flex align-items-center gap-1 flex-shrink-0 fw-medium"
              style={{
                fontSize: "12px",
                padding: "0 12px",
                borderRadius: "12px",
                height: "43px",
                whiteSpace: "nowrap",
              }}
              title="Abrir conversación"
            >
              <i className="bi bi-whatsapp" style={{ fontSize: "14px", color: "#25D366" }}></i>
              <span className="d-none d-md-inline">Abrir conversación</span>
            </button>
          )}
          <textarea
            ref={textareaRef}
            className="form-control input-custom flex-grow-1"
            placeholder={isWindowOpen ? "Escribe un mensaje..." : "Ventana de 24 horas cerrada"}
            value={text}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={!isWindowOpen}
            style={{
              resize: "none",
              maxHeight: "120px",
              minHeight: "43px",
              height: "43px",
              padding: "10px 16px",
              lineHeight: "21px",
              fontSize: "13.5px",
            }}
          />
          <button
            type="button"
            onClick={handleSend}
            className="btn btn-primary-custom d-flex align-items-center justify-content-center flex-shrink-0"
            style={{
              width: "43px",
              height: "43px",
              padding: 0,
              borderRadius: "12px",
            }}
            disabled={sending || !text.trim() || !isWindowOpen}
            title="Enviar mensaje"
          >
            {sending ? (
              <span className="spinner-border spinner-border-sm" role="status"></span>
            ) : (
              <i className="bi bi-send" style={{ fontSize: "15px" }}></i>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
