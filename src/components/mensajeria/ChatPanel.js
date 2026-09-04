"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { WA_STATUS, formatPhone } from "./utils";

function formatMessageTime(timeStr, dateStr) {
  const dt = dateStr ? new Date(`${dateStr}T${timeStr || "00:00"}`) : new Date();
  if (isNaN(dt.getTime())) return timeStr || "";
  return dt.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", hour12: true });
}

function formatDateGroup(dateStr) {
  if (!dateStr || dateStr === "Desconocido") return "Desconocido";
  const dt = new Date(`${dateStr}T00:00:00`);
  if (isNaN(dt.getTime())) return dateStr;
  const today = new Date();
  const isToday = dt.getDate() === today.getDate() && dt.getMonth() === today.getMonth() && dt.getFullYear() === today.getFullYear();
  if (isToday) return "Hoy";
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const isYesterday = dt.getDate() === yesterday.getDate() && dt.getMonth() === yesterday.getMonth() && dt.getFullYear() === yesterday.getFullYear();
  if (isYesterday) return "Ayer";
  return dt.toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" });
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
  const [selectedFile, setSelectedFile] = useState(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [unreadToDisplay, setUnreadToDisplay] = useState(0);
  const bodyRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const isWindowOpen = Boolean(windowOpen);

  const firstUnreadMessageId = React.useMemo(() => {
    if (unreadToDisplay > 0 && messages.length >= unreadToDisplay) {
      return messages[messages.length - unreadToDisplay]?.id;
    }
    return null;
  }, [messages, unreadToDisplay]);

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
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (textareaRef.current) {
      textareaRef.current.style.height = "43px";
    }
  }, [conversation?.id]);

  const handleSend = () => {
    const trimmed = text.trim();
    if ((!trimmed && !selectedFile) || sending || !isWindowOpen) return;
    onSendMessage(trimmed, selectedFile);
    setText("");
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (textareaRef.current) {
      textareaRef.current.style.height = "43px";
    }
    setUnreadToDisplay(0);
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
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

  const clientName = clientInfo?.nombreCompleto || clientInfo?.nombre || clientInfo?.name || conversation?.clientName || conversation?.client_name || conversation?.nombreCompleto || conversation?.nombre || "Cliente";
  const clientPhone = formatPhone(clientInfo?.celular || clientInfo?.telefono || clientInfo?.phone || conversation?.clientPhone || conversation?.client_phone || "");
  const statusMeta = WA_STATUS[conversation?.status] || WA_STATUS.open;

  const renderMedia = (msg, isAgent) => {
    const mediaUrl = msg.media_url || msg.mediaUrl;
    const mediaType = msg.media_type || msg.mediaType;
    if (!mediaUrl) return null;
    
    const baseUrl = process.env.NEXT_PUBLIC_CONNECTIVITY_API_URL || "http://localhost:4000";
    const fullUrl = `${baseUrl.replace(/\/+$/, '')}/${mediaUrl.replace(/^\/+/, '')}`;

    if (mediaType === 'image') {
      return (
        <div className="mb-2">
          <a href={fullUrl} target="_blank" rel="noopener noreferrer">
            <img src={fullUrl} alt="Imagen adjunta" style={{ maxWidth: '100%', maxHeight: '250px', borderRadius: '8px', objectFit: 'cover' }} />
          </a>
        </div>
      );
    } else if (mediaType === 'video') {
      return (
        <div className="mb-2">
          <video controls style={{ maxWidth: '100%', maxHeight: '250px', borderRadius: '8px' }}>
            <source src={fullUrl} />
            Tu navegador no soporta video.
          </video>
        </div>
      );
    } else if (mediaType === 'audio') {
      return (
        <div className="mb-2">
          <audio controls style={{ maxWidth: '100%', minWidth: '200px' }}>
            <source src={fullUrl} />
            Tu navegador no soporta audio.
          </audio>
        </div>
      );
    } else {
      return (
        <div className="mb-2">
          <a href={fullUrl} target="_blank" rel="noopener noreferrer" className="d-flex align-items-center gap-2 p-2 rounded text-decoration-none" style={{ backgroundColor: isAgent ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.05)", color: isAgent ? "#fff" : "#0c5cc6" }}>
            <i className="bi bi-file-earmark-text-fill" style={{ fontSize: "24px" }}></i>
            <span style={{ fontSize: "13px", fontWeight: "500", wordBreak: "break-word" }}>
              Descargar Archivo Adjunto
            </span>
          </a>
        </div>
      );
    }
  };

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
          {Object.entries(WA_STATUS)
            .filter(([key]) => key !== "not_opened")
            .map(([key, meta]) => {
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
            {Object.entries(
              messages.reduce((acc, msg) => {
                const d = msg.date || "Desconocido";
                if (!acc[d]) acc[d] = [];
                acc[d].push(msg);
                return acc;
              }, {})
            ).map(([dateKey, msgsForDate]) => (
              <React.Fragment key={dateKey}>
                <div className="text-center my-2">
                  <span
                    className="px-3 py-1 rounded-pill small shadow-sm"
                    style={{ backgroundColor: "#fff", color: "#54656f", fontSize: "12px", fontWeight: "500", border: "1px solid #f0f0f0" }}
                  >
                    {formatDateGroup(dateKey)}
                  </span>
                </div>
                {msgsForDate.map((msg) => {
                  const isAgent = msg.sender !== "client" && msg.direction !== "inbound";
                  const isFirstUnread = firstUnreadMessageId && msg.id === firstUnreadMessageId;
                  
                  return (
                    <React.Fragment key={msg.id || `${msg.clientId}-${msg.time}`}>
                      {isFirstUnread && (
                        <div id="first-unread-divider" className="d-flex align-items-center justify-content-center my-3" style={{ width: "100%" }}>
                          <div style={{ flex: 1, height: "1px", backgroundColor: "#e2e8f0" }}></div>
                          <span className="px-3 text-muted small fw-medium py-1" style={{ fontSize: "11.5px", backgroundColor: "#f8f9fa", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                            {unreadToDisplay} {unreadToDisplay === 1 ? 'mensaje nuevo' : 'mensajes nuevos'}
                          </span>
                          <div style={{ flex: 1, height: "1px", backgroundColor: "#e2e8f0" }}></div>
                        </div>
                      )}
                      <div className={`d-flex align-items-end gap-2 ${isAgent ? "justify-content-end" : "justify-content-start"}`}>
                        <div className={`mensajeria-bubble ${isAgent ? "out" : "in"}`} style={{ display: "flex", flexDirection: "column", maxWidth: "80%" }}>
                          {(msg.media_url || msg.mediaUrl) && renderMedia(msg, isAgent)}
                          {msg.text && msg.text.startsWith('[Comprobante WhatsApp:') ? (
                            <div className="d-flex flex-column gap-1">
                              <div className="d-flex align-items-center gap-2 p-2 rounded" style={{ backgroundColor: isAgent ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.05)" }}>
                                <i className="bi bi-file-earmark-pdf-fill" style={{ fontSize: "24px", color: isAgent ? "#fff" : "#dc3545" }}></i>
                                <span style={{ fontSize: "13px", fontWeight: "500", wordBreak: "break-word" }}>
                                  Documento PDF Enviado
                                </span>
                              </div>
                              <span style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", fontSize: "12px", opacity: 0.9 }}>
                                {msg.text.replace(/\[Comprobante WhatsApp:.*?\]\s*/, '')}
                              </span>
                            </div>
                          ) : msg.text && msg.text.startsWith('[Plantilla:') ? (
                            <div className="d-flex flex-column gap-1">
                              <div className="d-flex align-items-center gap-2 p-2 rounded" style={{ backgroundColor: isAgent ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.05)" }}>
                                <i className="bi bi-layout-text-window" style={{ fontSize: "20px", color: isAgent ? "#fff" : "#0c5cc6" }}></i>
                                <span style={{ fontSize: "13px", fontWeight: "500", wordBreak: "break-word" }}>
                                  Plantilla Enviada
                                </span>
                              </div>
                              <span style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", fontSize: "12px", opacity: 0.9 }}>
                                {msg.text.replace(/\[Plantilla:.*?\]\s*/, '')}
                              </span>
                            </div>
                          ) : (
                            msg.text && !['[Imagen]', '[Video]', '[Audio]', '[Sticker]'].includes(msg.text) && !msg.text.startsWith('[Documento] ') && <span style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{msg.text}</span>
                          )}
                        <div
                          className="d-flex align-items-center justify-content-end gap-1 mt-1"
                          style={{
                            fontSize: "11px",
                            color: isAgent ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.5)",
                            minWidth: "65px",
                            alignSelf: "flex-end"
                          }}
                        >
                          <span>{msg.time || formatMessageTime(msg.time, msg.date)}</span>
                          {isAgent && <i className="bi bi-check-all" style={{ fontSize: "14px" }}></i>}
                        </div>
                      </div>
                      </div>
                    </React.Fragment>
                  );
                })}
              </React.Fragment>
            ))}
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
        
        {selectedFile && (
          <div className="mx-3 mb-2 p-2 rounded bg-light d-flex align-items-center justify-content-between border">
            <div className="d-flex align-items-center gap-2 overflow-hidden">
              <i className="bi bi-file-earmark text-secondary"></i>
              <span className="text-truncate small text-secondary fw-medium">{selectedFile.name}</span>
            </div>
            <button 
              type="button" 
              className="btn-close shadow-none" 
              style={{ fontSize: "10px" }} 
              onClick={() => {
                setSelectedFile(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
            ></button>
          </div>
        )}

        <div className="d-flex align-items-end gap-2 px-3 pb-3">
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

          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            className="d-none" 
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx" 
          />
          <button 
            type="button" 
            className="btn btn-light d-flex align-items-center justify-content-center flex-shrink-0 border"
            style={{ width: "43px", height: "43px", borderRadius: "12px", color: "var(--grey-text)" }}
            title="Adjuntar archivo"
            disabled={!isWindowOpen || sending}
            onClick={() => fileInputRef.current?.click()}
          >
            <i className="bi bi-paperclip" style={{ fontSize: "20px" }}></i>
          </button>
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
            disabled={sending || (!text.trim() && !selectedFile) || !isWindowOpen}
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
