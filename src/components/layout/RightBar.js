"use client";

import React, { useState } from "react";

export default function RightBar({ onRegisterClientClick, isPinned, onTogglePin }) {
  const [isHovered, setIsHovered] = useState(false);

  const isExpanded = isPinned || isHovered;

  const notifications = [
    { title: "Mensaje de Vanessa Fuentes", time: "Justo ahora", bgIcon: "#f4faeb", iconColor: "#75bf06", icon: "bi-chat-text" },
    { title: "Nuevo usuario registrado", time: "Hace 59 minutos", bgIcon: "#e7f1fe", iconColor: "#227cf2", icon: "bi-person-plus" },
    { title: "Atraso de pago", time: "Hace 12 horas", bgIcon: "#f4faeb", iconColor: "#75bf06", icon: "bi-graph-down" },
    { title: "Próximo pago pendiente", time: "Hoy, a las 11:59 am", bgIcon: "#e6f1fd", iconColor: "#227cf2", icon: "bi-calendar-event" },
  ];

  const contacts = [
    { name: "Vanessa Fuentes", initials: "VF" },
    { name: "Orlando Paz", initials: "OP" },
    { name: "Lorena Figueroa", initials: "LF" },
    { name: "Jonathan Neri", initials: "JN" },
    { name: "María Cervantes", initials: "MC" },
    { name: "Daniela López", initials: "DL" },
  ];

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-white border-start d-none d-xl-flex flex-column gap-4 font-jakarta shadow-premium"
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
              <h3 className="text-dark fw-semibold px-2 py-2 mb-0 font-poppins" style={{ fontSize: "14px" }}>
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
            className={`btn btn-light w-100 text-start p-2 border-radius-12 d-flex align-items-center transition-smooth hover-light border-0 ${
              !isExpanded ? "justify-content-center" : "gap-3"
            }`}
            style={{ backgroundColor: "transparent" }}
            title={!isExpanded ? "Registrar cliente" : undefined}
          >
            <div className="bg-success text-white rounded-3 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: "24px", height: "24px", backgroundColor: "#75bf06" }}>
              <i className="bi bi-person-fill" style={{ fontSize: "14px" }}></i>
            </div>
            {isExpanded && <span className="small text-dark fw-medium">Registrar cliente</span>}
          </button>

          <button
            className={`btn btn-light w-100 text-start p-2 border-radius-12 d-flex align-items-center transition-smooth hover-light border-0 ${
              !isExpanded ? "justify-content-center" : "gap-3"
            }`}
            style={{ backgroundColor: "transparent" }}
            title={!isExpanded ? "Crear de reserva" : undefined}
          >
            <div className="bg-primary text-white rounded-3 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: "24px", height: "24px", backgroundColor: "#227cf2" }}>
              <i className="bi bi-cart-fill" style={{ fontSize: "14px" }}></i>
            </div>
            {isExpanded && <span className="small text-dark fw-medium">Crear de reserva</span>}
          </button>

          <button
            className={`btn btn-light w-100 text-start p-2 border-radius-12 d-flex align-items-center transition-smooth hover-light border-0 ${
              !isExpanded ? "justify-content-center" : "gap-3"
            }`}
            style={{ backgroundColor: "transparent" }}
            title={!isExpanded ? "Calendario" : undefined}
          >
            <div className="bg-success text-white rounded-3 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: "24px", height: "24px", backgroundColor: "#75bf06" }}>
              <i className="bi bi-calendar3" style={{ fontSize: "14px" }}></i>
            </div>
            {isExpanded && <span className="small text-dark fw-medium">Calendario</span>}
          </button>
        </div>
      </div>

      <div>
        {isExpanded ? (
          <h3 className="text-dark fw-semibold px-2 py-2 mb-2 font-poppins" style={{ fontSize: "14px" }}>
            Notificaciones
          </h3>
        ) : (
          <hr className="my-2" style={{ opacity: 0.1 }} />
        )}
        <div className="d-flex flex-column gap-3">
          {notifications.map((notif, idx) => (
            <div
              key={idx}
              className={`d-flex align-items-start px-2 py-1 transition-smooth hover-light rounded-3 ${
                !isExpanded ? "justify-content-center" : "gap-3"
              }`}
              title={!isExpanded ? notif.title : undefined}
            >
              <div
                className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                style={{ width: "24px", height: "24px", minWidth: "24px", backgroundColor: notif.bgIcon }}
              >
                <i className={`bi ${notif.icon}`} style={{ fontSize: "14px", color: notif.iconColor }}></i>
              </div>
              {isExpanded && (
                <div className="flex-grow-1 min-w-0">
                  <p className="mb-0 fw-medium text-dark text-truncate" style={{ fontSize: "13px" }}>{notif.title}</p>
                  <p className="mb-0 text-muted" style={{ fontSize: "11px" }}>{notif.time}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-grow-1 overflow-y-auto">
        {isExpanded ? (
          <h3 className="text-dark fw-semibold px-2 py-2 mb-2 font-poppins" style={{ fontSize: "14px" }}>
            Contactos
          </h3>
        ) : (
          <hr className="my-2" style={{ opacity: 0.1 }} />
        )}
        <div className="d-flex flex-column gap-2">
          {contacts.map((contact, idx) => (
            <div
              key={idx}
              className={`d-flex align-items-center rounded-3 hover-light transition-smooth ${
                !isExpanded ? "justify-content-center p-1" : "gap-3 p-2"
              }`}
              title={!isExpanded ? contact.name : undefined}
            >
              <div
                className="rounded-circle bg-light d-flex align-items-center justify-content-center fw-semibold text-secondary border font-poppins text-uppercase flex-shrink-0"
                style={{ width: "24px", height: "24px", fontSize: "10px", minWidth: "24px" }}
              >
                {contact.initials}
              </div>
              {isExpanded && (
                <div className="flex-grow-1 min-w-0">
                  <p className="mb-0 fw-semibold text-dark text-truncate" style={{ fontSize: "13px" }}>{contact.name}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
