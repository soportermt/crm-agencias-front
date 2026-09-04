"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { mensajeriaService } from "@/services/mensajeria.service";
import { clientsService } from "@/services/clients.service";
import { authService } from "@/services/auth.service";
import ConversationList from "@/components/mensajeria/ConversationList";
import ChatPanel from "@/components/mensajeria/ChatPanel";
import ClientContactsList from "@/components/mensajeria/ClientContactsList";
import ClientInfoPanel from "@/components/mensajeria/ClientInfoPanel";
import EmailComposerModal from "@/components/mensajeria/EmailComposerModal";
import NewWhatsAppConversationModal from "@/components/mensajeria/NewWhatsAppConversationModal";
import { WA_STATUS } from "@/components/mensajeria/utils";
import { useSocket } from "@/hooks/useSocket";

function normalizeConversation(raw) {
  return {
    id: raw.id ?? null,
    clientId: raw.clientId ?? raw.client_id ?? raw.id_cliente ?? null,
    channel: raw.channel || "whatsapp",
    clientName: raw.clientName || raw.client_name || raw.nombreCompleto || raw.nombre || raw.name || raw.text || "Cliente",
    clientPhone: raw.clientPhone || raw.client_phone || raw.celular || raw.telefono || raw.phone || "",
    clientEmail: raw.clientEmail || raw.client_email || raw.correo || raw.email || raw.mail || "",
    status: raw.status || "open",
    unreadCount: raw.unreadCount ?? raw.unread_count ?? 0,
    lastMessageAt: raw.lastMessageAt || raw.last_message_at || raw.createdAt || raw.created_at || null,
    lastMessagePreview: raw.lastMessagePreview || raw.last_message_preview || raw.text || raw.message || "",
    assignedUserId: raw.assignedUserId ?? raw.assigned_user_id ?? null,
    assignedUserName: raw.assignedUserName || raw.assigned_user_name || null,
  };
}

function MensajeriaContent() {
  const searchParams = useSearchParams();
  const targetClientId = searchParams?.get("clientId");
  const initialClientHandledRef = useRef(false);

  // Vista: "whatsapp" | "email"
  const [view, setView] = useState("whatsapp");
  // WhatsApp: filtro de estado
  const [waStatus, setWaStatus] = useState("open"); // open | pending | closed
  const [allConversations, setAllConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  // Correo: contactos + emails
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [emails, setEmails] = useState([]);

  const [messages, setMessages] = useState([]);
  const [clientInfo, setClientInfo] = useState(null);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [emailsLoading, setEmailsLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [waWindow, setWaWindow] = useState({ open: false, lastInboundAt: null, expiresInSeconds: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [globalSearchResults, setGlobalSearchResults] = useState([]);
  const [isSearchingGlobal, setIsSearchingGlobal] = useState(false);
  const [error, setError] = useState(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showNewConversationModal, setShowNewConversationModal] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;
    
    const handleNewMessage = (newMsg) => {
      console.log("WebSocket [new_message] recibido:", newMsg);
      // 1. Si la conversación actual es la del mensaje nuevo, actualizamos la lista de mensajes
      if (
        (selectedConv?.id && Number(selectedConv.id) === Number(newMsg.conversationId)) || 
        (selectedConv?.clientId && Number(selectedConv.clientId) === Number(newMsg.clientId))
      ) {
        setMessages((prev) => {
          // Evitar duplicados si ya existe
          if (prev.some(m => Number(m.id) === Number(newMsg.id))) return prev;
          
          const dt = newMsg.createdAt ? new Date(newMsg.createdAt) : new Date();
          const d = dt.toISOString().split("T")[0];
          const t = dt.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", hour12: true });
          const formattedMsg = { ...newMsg, date: d, time: t };
          
          return [...(prev || []), formattedMsg];
        });
        if (newMsg.conversationId) {
          mensajeriaService.markConversationRead(newMsg.conversationId).catch(() => {});
        }
      }
      
      // 2. Actualizamos el preview o unread count en la lista de conversaciones
      setAllConversations((prev) => {
        // Verificar si la conversación ya existe en la lista
        const exists = prev.some(c => 
          (c.id && Number(c.id) === Number(newMsg.conversationId)) || 
          (c.clientId && Number(c.clientId) === Number(newMsg.clientId))
        );
        
        if (exists) {
          const updatedList = prev.map(c => {
            if (
              (c.id && Number(c.id) === Number(newMsg.conversationId)) || 
              (c.clientId && Number(c.clientId) === Number(newMsg.clientId))
            ) {
              const isSelected = 
                (selectedConv?.id && Number(selectedConv.id) === Number(c.id)) || 
                (selectedConv?.clientId && Number(selectedConv.clientId) === Number(c.clientId));
              return {
                ...c,
                lastMessagePreview: newMsg.text,
                lastMessageAt: newMsg.createdAt || new Date().toISOString(),
                unreadCount: isSelected ? 0 : (c.unreadCount || 0) + 1,
                status: c.status === 'closed' ? 'open' : c.status
              };
            }
            return c;
          });
          
          // Ordenar descendente por fecha del último mensaje
          return updatedList.sort((a, b) => {
            const timeA = new Date(a.lastMessageAt || 0).getTime();
            const timeB = new Date(b.lastMessageAt || 0).getTime();
            return timeB - timeA;
          });
        } else {
          // Si es una conversación que no está cargada actualmente (ej. página anterior),
          // obtenemos los detalles del cliente e insertamos el bloque al inicio para no romper el infinite scroll.
          if (newMsg.clientId) {
            clientsService.getClientById(newMsg.clientId).then(res => {
               const client = res?.data || res;
               if (client) {
                 const fullName =
                   client.nombreCompleto ||
                   [client.nombre, client.apellidoPaterno, client.apellidoMaterno].filter(Boolean).join(" ") ||
                   client.nombre ||
                   client.name ||
                   "Cliente";
                   
                 const newConv = {
                   id: newMsg.conversationId,
                   clientId: newMsg.clientId,
                   channel: newMsg.channel || "whatsapp",
                   clientName: fullName,
                   clientPhone: client.celular || client.telefono || client.phone || "",
                   clientEmail: client.correo || client.email || client.mail || "",
                   status: "open",
                   unreadCount: 1,
                   lastMessageAt: newMsg.createdAt || new Date().toISOString(),
                   lastMessagePreview: newMsg.text,
                 };
                 setAllConversations(current => {
                   // Verificar nuevamente si ya existe (para evitar duplicados por asincronía)
                   const alreadyExists = current.some(c => 
                     (c.id && Number(c.id) === Number(newMsg.conversationId)) || 
                     (c.clientId && Number(c.clientId) === Number(newMsg.clientId))
                   );
                   
                   if (alreadyExists) {
                     return current.map(c => {
                       if (
                         (c.id && Number(c.id) === Number(newMsg.conversationId)) || 
                         (c.clientId && Number(c.clientId) === Number(newMsg.clientId))
                       ) {
                         const isSelected = 
                           (selectedConv?.id && Number(selectedConv.id) === Number(c.id)) || 
                           (selectedConv?.clientId && Number(selectedConv.clientId) === Number(c.clientId));
                         return {
                           ...c,
                           id: c.id || newMsg.conversationId, // Update ID if it was null
                           lastMessagePreview: newMsg.text,
                           lastMessageAt: newMsg.createdAt || new Date().toISOString(),
                           unreadCount: isSelected ? 0 : (c.unreadCount || 0) + 1,
                           status: c.status === 'closed' ? 'open' : c.status
                         };
                       }
                       return c;
                     }).sort((a, b) => new Date(b.lastMessageAt || 0).getTime() - new Date(a.lastMessageAt || 0).getTime());
                   }
                   
                   return [newConv, ...current];
                 });
               }
            }).catch(console.error);
          }
          return prev;
        }
      });
    };

    socket.on('new_message', handleNewMessage);

    return () => {
      socket.off('new_message', handleNewMessage);
    };
  }, [socket, selectedConv]);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  }, []);

  // Debounce de búsqueda para autocompletado/autobúsqueda
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Limpia la búsqueda de forma inmediata (input + debounced + resultados globales)
  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    setDebouncedSearch("");
    setGlobalSearchResults([]);
  }, []);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // Fetch paginado de conversaciones unificado con búsqueda
  const loadConversations = useCallback(async (isLoadMore = false) => {
    if (view !== "whatsapp") return;
    
    try {
      if (!isLoadMore) {
        setLoadingList(true);
        setPage(1);
      } else {
        setLoadingMore(true);
      }
      
      setError(null);
      const currentPage = isLoadMore ? page + 1 : 1;
      
      // Enviamos el search y status al backend
      const response = await mensajeriaService.getConversations(
        "whatsapp", 
        waStatus !== "all" ? waStatus : undefined,
        debouncedSearch.trim(),
        currentPage,
        20
      );
      
      const newConvs = (response.data || []).map(normalizeConversation);
      
      if (isLoadMore) {
        setAllConversations(prev => [...prev, ...newConvs]);
      } else {
        setAllConversations(newConvs);
      }
      
      setPage(currentPage);
      setHasMore(response.meta?.hasMore || false);
    } catch (err) {
      console.error("Error al cargar conversaciones:", err);
      setError("No se pudieron cargar las conversaciones de WhatsApp.");
    } finally {
      setLoadingList(false);
      setLoadingMore(false);
    }
  }, [view, waStatus, debouncedSearch, page]);

  useEffect(() => {
    loadConversations(false);
  }, [view, waStatus, debouncedSearch]);

  const handleLoadMoreConversations = () => {
    if (hasMore && !loadingMore) {
      loadConversations(true);
    }
  };

  // Cargar contactos con correos
  useEffect(() => {
    async function load() {
      try {
        setLoadingList(true);
        const threads = await mensajeriaService.getEmailThreads();
        const grouped = (threads || []).map((t) => ({
          clientId: t.clientId ?? t.client_id,
          name: t.clientName || t.client_name || "Cliente",
          email: t.clientEmail || t.client_email || "",
          emails: [],
        }));
        setContacts(grouped);
      } catch (err) {
        console.error("Error al cargar contactos:", err);
        setContacts([]);
      } finally {
        setLoadingList(false);
      }
    }
    load();
  }, []);

  // Cargar mensajes del chat WhatsApp
  const loadSelectedConversation = useCallback(async (conv) => {
    if (!conv) return;
    try {
      setLoadingMessages(true);
      setMessages([]);
      setClientInfo(null);
      setWaWindow({ open: false, lastInboundAt: null, expiresInSeconds: 0 });
      if (conv.id) {
        const res = await mensajeriaService.getConversationMessages(conv.id, 1, 20);
        setMessages(res.data || []);
        const expiresInSeconds = Math.max(0, Number(res.window?.expiresInSeconds || 0));
        setWaWindow({
          open: Boolean(res.window?.open) && expiresInSeconds > 0,
          lastInboundAt: res.window?.lastInboundAt || null,
          expiresInSeconds,
        });
        mensajeriaService.markConversationRead(conv.id).catch(() => {});
      } else if (conv.clientId) {
        const res = await mensajeriaService.getClientMessages(conv.clientId, 1, 20);
        setMessages(res.data || (Array.isArray(res) ? res : []));
      }
      setSelectedConv(conv);
      if (conv.clientId) {
        clientsService
          .getClientById(conv.clientId)
          .then((data) => setClientInfo(data))
          .catch((err) => {
            console.error("Error al cargar info del cliente:", err);
            setClientInfo({ id: conv.clientId, nombreCompleto: conv.clientName || "Cliente" });
          });
      }
    } catch (err) {
      console.error("Error al cargar mensajes:", err);
      setError("No se pudieron cargar los mensajes de esta conversación.");
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  // Auto-selección cuando se navega con ?clientId=... desde el perfil del cliente
  useEffect(() => {
    if (!targetClientId || loadingList || initialClientHandledRef.current) return;
    const cid = Number(targetClientId);
    if (!cid) return;

    initialClientHandledRef.current = true;
    setView("whatsapp");

    const existing = allConversations.find(
      (c) => Number(c.clientId) === cid || Number(c.client_id) === cid
    );

    if (existing) {
      loadSelectedConversation(existing);
    } else {
      clientsService
        .getClientById(cid)
        .then((client) => {
          if (client) {
            const pseudoConv = {
              id: null,
              clientId: client.id || client.id_cliente || cid,
              clientName: client.nombreCompleto || client.nombre || client.name || "Cliente",
              clientPhone: client.celular || client.telefono || client.phone || "",
              clientEmail: client.correo || client.email || "",
              status: "open",
              channel: "whatsapp",
            };
            setSelectedConv(pseudoConv);
            setClientInfo(client);
            mensajeriaService
              .getClientMessages(cid, 1, 100)
              .then((res) => {
                const msgs = res.data || (Array.isArray(res) ? res : []);
                setMessages(msgs);
              })
              .catch(() => setMessages([]));
          }
        })
        .catch((err) => {
          console.error("Error al buscar cliente por query param:", err);
        });
    }
  }, [targetClientId, loadingList, allConversations, loadSelectedConversation]);

  // Cierra la ventana localmente cuando se cumplen las 24 horas, sin polling.
  useEffect(() => {
    if (!waWindow.open || waWindow.expiresInSeconds <= 0) return undefined;

    const timer = setTimeout(() => {
      setWaWindow((current) => ({ ...current, open: false, expiresInSeconds: 0 }));
    }, waWindow.expiresInSeconds * 1000);

    return () => clearTimeout(timer);
  }, [waWindow.open, waWindow.expiresInSeconds]);

  // Cargar correos de un contacto
  const loadContactEmails = useCallback(async (contact) => {
    if (!contact) return;
    try {
      setLoadingMessages(true);
      setEmails([]);
      setClientInfo(null);
      setSelectedContact(contact);
      const data = await mensajeriaService.getClientEmails(contact.clientId);
      setEmails(data || []);
      // Actualizar preview del contacto en la lista
      setContacts((prev) =>
        prev.map((c) =>
          c.clientId === contact.clientId
            ? { ...c, emails: data && data.length ? [data[0]] : c.emails }
            : c
        )
      );
      clientsService
        .getClientById(contact.clientId)
        .then((info) => setClientInfo(info))
        .catch((err) => {
          console.error("Error al cargar info del cliente:", err);
          setClientInfo({ id: contact.clientId, nombreCompleto: contact.name || "Cliente" });
        });
    } catch (err) {
      console.error("Error al cargar correos:", err);
      setEmails([]);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  const handleSelectConversation = (conv) => {
    loadSelectedConversation(conv);
    if (conv?.id) {
      setAllConversations((prev) => prev.map((c) => (c.id === conv.id ? { ...c, unreadCount: 0 } : c)));
    }
  };

  const handleCloseConversation = () => {
    setSelectedConv(null);
    setMessages([]);
    setClientInfo(null);
    setWaWindow({ open: false, lastInboundAt: null, expiresInSeconds: 0 });
  };

  const handleSelectContact = (contact) => {
    loadContactEmails(contact);
  };

  const handleCloseContact = () => {
    setSelectedContact(null);
    setEmails([]);
    setClientInfo(null);
  };

  // Enviar mensaje WhatsApp
  const handleSendMessage = async (text, file) => {
    if (!selectedConv || !waWindow.open) {
      if (selectedConv && !waWindow.open) {
        showToast("La ventana de 24 horas está cerrada. Usa una plantilla para abrir la conversación.", "warning");
      }
      return;
    }
    let user = null;
    try {
      user = authService.getUser();
    } catch (e) {
      user = null;
    }
    const payload = {
      text,
      clientId: selectedConv.clientId,
      conversationId: selectedConv.id,
      agenciaId: user?.id_agencia || undefined,
      userId: user?.id || undefined,
      channel: "whatsapp",
    };

    try {
      setSending(true);
      
      let uploadedMediaUrl = null;
      let uploadedMediaType = null;
      
      if (file) {
        const uploadRes = await mensajeriaService.uploadMedia(file, user?.id_agencia, selectedConv.clientId);
        if (uploadRes && uploadRes.file && uploadRes.file.path) {
           uploadedMediaUrl = uploadRes.file.path;
           
           if (file.type.startsWith('image/')) uploadedMediaType = 'image';
           else if (file.type.startsWith('video/')) uploadedMediaType = 'video';
           else if (file.type.startsWith('audio/')) uploadedMediaType = 'audio';
           else uploadedMediaType = 'document';
           
           payload.mediaUrl = uploadedMediaUrl;
           payload.mediaType = uploadedMediaType;
        }
      }

      const res = await mensajeriaService.sendMessage(payload);
      const dt = new Date();
      const msg = {
        id: res.messageId,
        text,
        date: dt.toISOString().split("T")[0],
        time: dt.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", hour12: true }),
        sender: "agent",
        direction: "outbound",
        channel: "whatsapp",
        media_url: uploadedMediaUrl,
        media_type: uploadedMediaType
      };
      setMessages((prev) => [...(prev || []), msg]);
      if (res.delivered === false) {
        const reason =
          res.apiError === "no_credentials"
            ? "No hay credenciales de WhatsApp configuradas; el mensaje se guardó pero no se envió."
            : "El mensaje se guardó, pero WhatsApp no pudo enviarlo.";
        showToast(reason, "warning");
      } else {
        showToast("Mensaje enviado");
      }
      
      setAllConversations((prev) =>
        (prev || []).map((c) => (c.id === selectedConv.id ? { ...c, status: "pending" } : c))
      );
      setSelectedConv((prev) => ({ ...prev, status: "pending" }));

    } catch (err) {
      console.error("Error al enviar mensaje:", err);
      showToast("No se pudo enviar el mensaje. Intenta de nuevo.", "error");
    } finally {
      setSending(false);
    }
  };

  // Enviar correo
  const handleSendEmail = async ({ subject, body }) => {
    if (!selectedContact?.clientId || !clientInfo?.correo) return;
    let user = null;
    try {
      user = authService.getUser();
    } catch (e) {
      user = null;
    }
    try {
      setSending(true);
      await mensajeriaService.sendEmail({
        account_id: user?.id_cuenta_email || 0,
        to: clientInfo.correo,
        subject,
        body,
      });
      setShowEmailModal(false);
      showToast("Correo enviado");
      const data = await mensajeriaService.getClientEmails(selectedContact.clientId);
       setEmails(data || []);
       // Actualizar preview en la lista de contactos
       setContacts((prev) =>
        prev.map((c) =>
          c.clientId === selectedContact.clientId
            ? { ...c, email: clientInfo.correo, emails: [{ subject, date: new Date().toISOString() }] }
            : c
        )
      );
    } catch (err) {
      console.error("Error al enviar correo:", err);
      showToast("No se pudo enviar el correo. Revisa la configuración de SMTP.", "error");
    } finally {
      setEmailsLoading(false);
      setSending(false);
    }
  };

  // Abrir conversación WhatsApp (por ahora sin funcionalidad real)
  const handleOpenConversation = () => {
    showToast("La apertura de conversaciones estará disponible próximamente.", "warning");
  };

  // Cambiar estado de conversación WhatsApp
  const handleStatusChange = async (status) => {
    if (!selectedConv) return;
    try {
      if (selectedConv.id) {
        await mensajeriaService.updateConversationStatus(selectedConv.id, status);
      }
      setSelectedConv((prev) => ({ ...prev, status }));
      showToast(`Conversación marcada como ${WA_STATUS[status]?.label || status}`);
       // Actualizar localmente la conversación para que el filtro/estado refleje el cambio
       setAllConversations((prev) =>
        (prev || []).map((c) => (c.id === selectedConv.id ? { ...c, status } : c))
      );
    } catch (err) {
      console.error("Error al cambiar estado:", err);
      showToast("No se pudo cambiar el estado.", "error");
    }
  };

  // Filtrar contactos por búsqueda
  const filteredContacts = contacts.filter((c) => {
    if (!debouncedSearch.trim()) return true;
    const q = debouncedSearch.toLowerCase();
    return (c.name || "").toLowerCase().includes(q) || (c.email || "").toLowerCase().includes(q);
  });

  // Conversaciones visibles: con búsqueda se buscan TODOS los clientes y se combinan con clientes del CRM;
  // sin búsqueda se respeta el filtro de estado activo.
  // Las conversaciones y búsqueda se manejan 100% desde el servidor.
  const visibleConversations = allConversations;

  return (
    <div className="container-fluid p-0 font-inter">
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-3">
        <div>
          <h1 className="h4 font-poppins fw-bold mb-1" style={{ color: "var(--dark-green)" }}>
            Bandeja
          </h1>
          <p className="small mb-0" style={{ color: "var(--grey-text)" }}>
            Conversaciones de WhatsApp y correos de tus clientes en un solo lugar
          </p>
        </div>
       {/* Toggle de vista */}
       <div className="d-flex align-items-center gap-2 bg-white p-1" style={{ borderRadius: "20px", border: "1px solid #e1e1e1" }}>
          <button
            onClick={() => setView("whatsapp")}
            className={`btn border-0 d-flex align-items-center gap-1 fw-medium transition-smooth ${view === "whatsapp" ? "" : ""}`}
            style={{
              padding: "6px 16px",
              borderRadius: "16px",
              fontSize: "13px",
              backgroundColor: view === "whatsapp" ? "#e7f1fe" : "transparent",
              color: view === "whatsapp" ? "#0c5cc6" : "var(--grey-text)",
            }}
          >
            <i className="bi bi-whatsapp" style={{ fontSize: "14px", color: "#25D366" }}></i>
            WhatsApp
          </button>
          <button
            onClick={() => setView("email")}
            className={`btn border-0 d-flex align-items-center gap-1 fw-medium transition-smooth`}
            style={{
              padding: "6px 16px",
              borderRadius: "16px",
              fontSize: "13px",
              backgroundColor: view === "email" ? "#e7f1fe" : "transparent",
              color: view === "email" ? "#0c5cc6" : "var(--grey-text)",
            }}
          >
            <i className="bi bi-envelope" style={{ fontSize: "14px", color: "#0c5cc6" }}></i>
            Correo
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2" role="alert" style={{ fontSize: "13px" }}>
          <i className="bi bi-exclamation-triangle"></i>
          {error}
        </div>
      )}

      <div className="mensajeria-layout">
        <div className="row g-3 h-100">
          {/* Columna izquierda */}
          <div className={`col-12 col-md-4 col-xl-3 h-100 ${selectedConv || selectedContact ? 'd-none d-md-block' : ''}`}>
            {view === "whatsapp" ? (
              <ConversationList
                conversations={visibleConversations}
                selectedId={selectedConv?.id}
                selectedClientId={selectedConv?.clientId}
                onSelect={handleSelectConversation}
                statusFilter={waStatus}
                onStatusChange={setWaStatus}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onClearSearch={handleClearSearch}
                loading={loadingList}
                isSearchingGlobal={isSearchingGlobal}
                hasMore={hasMore}
                loadingMore={loadingMore}
                onLoadMore={handleLoadMoreConversations}
              />
            ) : (
              <ClientContactsList
                contacts={filteredContacts}
                selectedClientId={selectedContact?.clientId}
                onSelect={handleSelectContact}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                loading={loadingList}
              />
            )}
          </div>

          {/* Panel central */}
          <div className={`col-12 col-md-8 col-xl-6 h-100 ${(selectedConv || selectedContact) ? '' : 'd-none d-md-block'}`}>
            {view === "whatsapp" ? (
              <ChatPanel
                conversation={selectedConv}
                clientInfo={clientInfo}
                messages={messages}
                loadingMessages={loadingMessages}
                sending={sending}
                windowOpen={waWindow.open}
                channel="whatsapp"
                onSendMessage={handleSendMessage}
                onComposeEmail={() => setShowEmailModal(true)}
                onStatusChange={handleStatusChange}
                onOpenConversation={() => setShowNewConversationModal(true)}
                onClose={handleCloseConversation}
              />
            ) : (
              <EmailPanel
                contact={selectedContact}
                clientInfo={clientInfo}
                emails={emails}
                loadingEmails={loadingMessages}
                onComposeEmail={() => setShowEmailModal(true)}
                onClose={handleCloseContact}
              />
            )}
          </div>

          {/* Columna derecha (info cliente) - Oculta en móviles, visible desde xl */}
          <div className="col-12 col-xl-3 h-100 overflow-y-auto d-none d-xl-block">
            <ClientInfoPanel
              clientInfo={clientInfo}
              emails={emails}
              emailsLoading={emailsLoading}
              onRefreshEmails={async () => {
                if (!selectedContact?.clientId) return;
                setEmailsLoading(true);
                try {
                  const data = await mensajeriaService.getClientEmails(selectedContact.clientId);
                  setEmails(data || []);
                } finally {
                  setEmailsLoading(false);
                }
              }}
              showEmails={view === "email"}
            />
          </div>
        </div>
      </div>

      <EmailComposerModal
        show={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        clientInfo={clientInfo}
        onSend={handleSendEmail}
        sending={sending}
      />

      <NewWhatsAppConversationModal
        show={showNewConversationModal}
        onClose={() => setShowNewConversationModal(false)}
        onSendTemplate={handleOpenConversation}
      />

      {toast && (
        <div
          className={`position-fixed bottom-0 end-0 m-3 p-3 text-white shadow-premium ${toast.type === "error" ? "bg-danger" : toast.type === "warning" ? "bg-warning" : "bg-success"}`}
          style={{ borderRadius: "12px", fontSize: "13px", zIndex: 2000, maxWidth: "340px" }}
          role="alert"
        >
          <div className="d-flex align-items-center gap-2">
            <i className={`bi ${toast.type === "error" ? "bi-x-circle" : toast.type === "warning" ? "bi-exclamation-triangle" : "bi-check-circle"}`}></i>
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MensajeriaPage() {
  return (
    <Suspense fallback={<div className="container-fluid p-0 d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}><div className="spinner-border text-primary" role="status"></div></div>}>
      <MensajeriaContent />
    </Suspense>
  );
}

// Panel de correos: historial de emails enviados y recibidos con el contacto
function EmailPanel({ contact, clientInfo, emails, loadingEmails, onComposeEmail, onClose }) {
  if (!contact) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center h-100 bg-white" style={{ borderRadius: "12px" }}>
        <i className="bi bi-envelope-paper text-secondary" style={{ fontSize: "44px", color: "#cbd5e1" }}></i>
        <p className="mt-3 mb-1 fw-medium" style={{ color: "#0f1901", fontSize: "14px" }}>
          Selecciona un contacto
        </p>
        <p className="small mb-0" style={{ color: "var(--grey-text)" }}>
          Elige un cliente para ver sus correos enviados y recibidos
        </p>
      </div>
    );
  }

  const name = clientInfo?.nombreCompleto || clientInfo?.name || contact.name || "Cliente";
  const email = clientInfo?.correo || contact.email || "";

  return (
    <div className="d-flex flex-column h-100 bg-white" style={{ borderRadius: "12px", overflow: "hidden" }}>
      {/* Header */}
      <div className="d-flex align-items-center gap-2 px-3 py-2 border-bottom" style={{ borderColor: "#f0f0f0", minHeight: "64px" }}>
        <div
          className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 fw-bold"
          style={{ width: "38px", height: "38px", backgroundColor: "#e7f1fe", color: "#0c5cc6", fontSize: "13px" }}
        >
          {name.substring(0, 2).toUpperCase()}
        </div>
        <div className="flex-grow-1 overflow-hidden">
          <span className="fw-semibold text-truncate d-block" style={{ color: "#0f1901", fontSize: "14px" }}>
            {name}
          </span>
          <span className="text-truncate d-block small" style={{ color: "var(--grey-text)", fontSize: "12px" }}>
            {email}
          </span>
        </div>
        <button
          onClick={onComposeEmail}
          className="btn btn-bg-style d-flex align-items-center gap-1 flex-shrink-0 fw-medium"
          style={{ fontSize: "12px", padding: "6px 12px", borderRadius: "8px" }}
          disabled={!email}
        >
          <i className="bi bi-envelope-plus" style={{ fontSize: "13px" }}></i>
          Redactar
        </button>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="btn btn-bg-style d-flex align-items-center justify-content-center flex-shrink-0"
            style={{ width: "32px", height: "32px", padding: 0, borderRadius: "8px", color: "var(--grey-text)" }}
            title="Cerrar panel de correos"
          >
            <i className="bi bi-x-lg" style={{ fontSize: "13px" }}></i>
          </button>
        )}
      </div>

      {/* Lista de correos */}
      <div className="flex-grow-1 overflow-y-auto p-2">
        {loadingEmails ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status" style={{ width: "22px", height: "22px" }}></div>
          </div>
        ) : emails.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-envelope-dash text-secondary" style={{ fontSize: "30px", color: "#cbd5e1" }}></i>
            <p className="small mt-2 mb-0" style={{ color: "var(--grey-text)" }}>
              Sin correos con este contacto
            </p>
          </div>
        ) : (
          <div className="d-flex flex-column gap-1 p-2">
            {emails.map((emailItem) => {
              const isOutbound = emailItem.sender === "Agente" || emailItem.direction === "outbound";
              return (
                <div
                  key={emailItem.id}
                  className="d-flex align-items-start gap-2 rounded p-2"
                  style={{ backgroundColor: isOutbound ? "#f1f5f9" : "#f4faeb", border: "1px solid #f0f0f0" }}
                >
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center text-white flex-shrink-0"
                    style={{
                      width: "28px",
                      height: "28px",
                      backgroundColor: emailItem.avatarBg || (isOutbound ? "#0c5cc6" : "#d02c89"),
                      fontSize: "10px",
                      fontWeight: "600",
                    }}
                  >
                    {emailItem.initials || (isOutbound ? "AG" : "CL")}
                  </div>
                  <div className="flex-grow-1 overflow-hidden">
                    <div className="d-flex align-items-center justify-content-between gap-2">
                      <span className={`text-truncate ${emailItem.unread ? "fw-semibold" : ""}`} style={{ fontSize: "13px", color: emailItem.unread ? "#316ab7" : "#212121" }}>
                        {emailItem.subject || "Sin asunto"}
                      </span>
                      <span className="flex-shrink-0" style={{ fontSize: "11px", color: "#9ca3af" }}>
                        {emailItem.date || emailItem.created_at}
                      </span>
                    </div>
                    <p className="text-truncate mb-0" style={{ fontSize: "12px", color: "#434343" }}>
                      {emailItem.preview || (emailItem.body_text || "").substring(0, 120)}
                    </p>
                    <span className="d-flex align-items-center gap-1" style={{ fontSize: "11px", color: isOutbound ? "#0c5cc6" : "#16a34a" }}>
                      <i className={`bi ${isOutbound ? "bi-send" : "bi-reply"}`} style={{ fontSize: "10px" }}></i>
                      {isOutbound ? "Enviado" : "Recibido"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
