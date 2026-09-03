"use client";

import React, { useState } from "react";
import {
  UserIcon,
  ShoppingCartIcon,
  CalendarDaysIcon,
  ChartBarIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useEffect } from "react";
import { clientsService } from "@/services/clients.service";
import { notificationsService } from "@/services/notifications.service";
import { useSocket } from "@/hooks/useSocket";
import { formatRelativeTime } from "@/utils/date";

export default function RightBar({ onRegisterClientClick, isPinned, onTogglePin }) {
  const [isHovered, setIsHovered] = useState(false);
  const isExpanded = isPinned || isHovered;

  const [notifications, setNotifications] = useState([]);
  const [chatContacts, setChatContacts] = useState([]);
  const socket = useSocket();
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let isMounted = true;
    
    // 1. Cargar notificaciones históricas
    const fetchNotifications = async () => {
      try {
        const data = await notificationsService.getRecentNotifications(5);
        if (isMounted && Array.isArray(data)) {
          setNotifications(data);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    
    fetchNotifications();

    // 2. Escuchar nuevas notificaciones por WebSocket
    if (socket) {
      socket.on('new_notification', (newNotif) => {
        setNotifications((prev) => [newNotif, ...prev].slice(0, 5));
      });
    }

    return () => {
      isMounted = false;
      if (socket) {
        socket.off('new_notification');
      }
    };
  }, [socket]);

  useEffect(() => {
    let isMounted = true;

    const fetchContacts = async () => {
      try {
        const data = await clientsService.getRecentChatContacts();
        if (isMounted && Array.isArray(data)) {
          const formatted = data.map((c, i) => ({
            id: c.id_cliente,
            name: c.nombre,
            preview: c.last_message_preview,
            avatar: `/avatars/avatar-${i % 2 === 0 ? 'male' : 'female'}-0${(i % 5) + 1}.png`
          }));
          setChatContacts(formatted);
        }
      } catch (error) {
        console.error("Error fetching chat contacts:", error);
      }
    };

    fetchContacts();

    if (socket) {
      socket.on('new_message', fetchContacts);
    }

    return () => {
      isMounted = false;
      if (socket) {
        socket.off('new_message', fetchContacts);
      }
    };
  }, [socket]);

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-white border-start d-none d-xl-flex flex-column gap-4 font-jakarta shadow-premium overflow-y-auto hide-scrollbar"
      style={{
        width: isExpanded ? "284px" : "80px",
        minWidth: isExpanded ? "284px" : "80px",
        height: "100vh",
        position: "fixed",
        right: 0,
        top: 0,
        bottom: 0,
        zIndex: 1040,
        overflowX: "hidden",
        transition: "width 0.25s ease-in-out, min-width 0.25s ease-in-out, padding 0.25s ease-in-out",
        padding: isExpanded ? "24px 16px" : "24px 8px",
      }}
    >
      <div>
        <div className="d-flex align-items-center justify-content-between mb-2" style={{ height: "24px" }}>
          {isExpanded ? (
            <>
              <h3 className="text-dark fw-normal px-2 py-2 mb-0 font-poppins" style={{ fontSize: "14px" }}>
                Accesos rápidos
              </h3>
              <button
                onClick={onTogglePin}
                className="btn btn-link text-secondary p-0 border-0 ms-auto me-2"
                style={{ textDecoration: "none" }}
              >
                <i className={`bi ${isPinned ? "bi-circle-fill text-primary" : "bi-circle"}`} style={{ fontSize: "14px" }}></i>
              </button>
            </>
          ) : (
            <button
              onClick={onTogglePin}
              className="btn btn-link p-0 border-0 mx-auto mb-2"
              title="Expandir y fijar accesos"
            >
              <i className="bi bi-circle" style={{ fontSize: "14px" }}></i>
            </button>
          )}
        </div>
        <div className="d-flex flex-column gap-2">
          <button
            onClick={onRegisterClientClick}
            className={`btn btn-light w-100 text-start p-2 border-radius-12 d-flex align-items-center transition-smooth hover-light border-0 ${!isExpanded ? "justify-content-center" : "gap-3"
              }`}
            style={{ backgroundColor: "transparent" }}
            title={!isExpanded ? "Registrar cliente" : undefined}
          >
            <div className="text-white d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: "24px", height: "24px", backgroundColor: "#75bf06", borderRadius: "8px" }}>
              <UserIcon style={{ width: "14px", height: "14px" }} />
            </div>
            {isExpanded && <span className="small text-dark fw-normal font-inter">Registrar cliente</span>}
          </button>

          <Link href="/reservaciones/crear" className="text-decoration-none">
            <button
              className={`btn btn-light w-100 text-start p-2 border-radius-12 d-flex align-items-center transition-smooth hover-light border-0 ${!isExpanded ? "justify-content-center" : "gap-3"
                }`}
              style={{ backgroundColor: "transparent" }}
              title={!isExpanded ? "Crear una reserva" : undefined}
            >
              <div className="text-white d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: "24px", height: "24px", backgroundColor: "#227cf2", borderRadius: "8px" }}>
                <ShoppingCartIcon style={{ width: "14px", height: "14px" }} />
              </div>
              {isExpanded && <span className="small text-dark fw-normal font-inter">Crear una reserva</span>}
            </button>
          </Link>

          <Link href="/calendario" className="text-decoration-none">
            <button
              className={`btn btn-light w-100 text-start p-2 border-radius-12 d-flex align-items-center transition-smooth hover-light border-0 ${!isExpanded ? "justify-content-center" : "gap-3"
                }`}
              style={{ backgroundColor: "transparent" }}
              title={!isExpanded ? "Calendario" : undefined}
            >
              <div className="text-white d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: "24px", height: "24px", backgroundColor: "#75bf06", borderRadius: "8px" }}>
                <CalendarDaysIcon style={{ width: "14px", height: "14px" }} />
              </div>
              {isExpanded && <span className="small text-dark fw-normal font-inter">Calendario</span>}
            </button>
          </Link>
        </div>
      </div>

      <div>
        {isExpanded ? (
          <h3 className="text-dark fw-normal px-2 py-2 mb-2 font-poppins" style={{ fontSize: "14px" }}>
            Notificaciones
          </h3>
        ) : (
          <hr className="my-2" style={{ opacity: 0.1 }} />
        )}
        <div className="d-flex flex-column gap-3">
          {notifications.map((notif, idx) => {
            const IconComponent = notif.icon_name === 'ChartBarIcon' ? ChartBarIcon : UserIcon;
            return (
            <div
              key={idx}
              className={`d-flex align-items-start px-2 py-1 transition-smooth hover-light rounded-3 ${!isExpanded ? "justify-content-center" : "gap-3"
                }`}
              title={notif.title}
              style={{ minWidth: 0, maxWidth: "100%", overflow: "hidden" }}
            >
              <div
                className="d-flex align-items-center justify-content-center flex-shrink-0"
                style={{ width: "24px", height: "24px", minWidth: "24px", backgroundColor: notif.icon_bg || notif.bgIcon, borderRadius: "8px" }}
              >
                <IconComponent style={{ width: "14px", height: "14px", color: notif.icon_color || notif.iconColor }} />
              </div>
              {isExpanded && (
                <div className="flex-grow-1" style={{ minWidth: 0, overflow: "hidden" }}>
                  <p className="mb-0 fw-medium text-dark text-truncate font-inter" style={{ fontSize: "13px" }}>
                    {notif.title}
                  </p>
                  <p className="mb-0 text-muted font-inter text-truncate" style={{ fontSize: "11px" }}>
                    {formatRelativeTime(notif.created_at || notif.createdAt || notif.time || notif.fecha)}
                  </p>
                </div>
              )}
            </div>
            );
          })}
        </div>
      </div>

      <div>
        {isExpanded ? (
          <h3 className="text-dark fw-normal px-2 py-2 mb-2 font-poppins" style={{ fontSize: "14px" }}>
            Contactos
          </h3>
        ) : (
          <hr className="my-2" style={{ opacity: 0.1 }} />
        )}
        <div className="d-flex flex-column gap-2">
          {chatContacts.map((contact, idx) => {
            const initials = contact.name 
              ? (contact.name.split(" ").filter(p => p.trim()).length >= 2 
                  ? (contact.name.split(" ").filter(p => p.trim())[0][0] + contact.name.split(" ").filter(p => p.trim())[1][0]) 
                  : contact.name.substring(0, 2)).toUpperCase()
              : "CL";

            return (
            <Link 
              href={`/mensajeria?clientId=${contact.id}`} 
              key={idx} 
              className="text-decoration-none"
            >
              <div
                className={`d-flex align-items-center rounded-3 hover-light transition-smooth ${!isExpanded ? "justify-content-center p-1" : "gap-3 p-2"
                  }`}
                title={!isExpanded ? contact.name : undefined}
                style={{ cursor: "pointer" }}
              >
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 fw-bold animate-fade-in"
                  style={{
                    width: "24px",
                    height: "24px",
                    minWidth: "24px",
                    backgroundColor: "#e7f1fe",
                    color: "#0c5cc6",
                    fontSize: "10px",
                  }}
                >
                  {initials}
                </div>
                {isExpanded && (
                  <div className="flex-grow-1" style={{ minWidth: 0, overflow: "hidden" }}>
                    <p className="mb-0 fw-normal text-dark text-truncate font-inter" style={{ fontSize: "13px" }}>{contact.name}</p>
                    {contact.preview && (
                      <p className="mb-0 text-muted text-truncate font-inter" style={{ fontSize: "11px" }}>{contact.preview}</p>
                    )}
                  </div>
                )}
              </div>
            </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
