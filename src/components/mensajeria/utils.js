import { parsePhoneNumberFromString } from 'libphonenumber-js';

export function formatPhone(phone) {
  if (!phone) return "";
  const phoneNumber = parsePhoneNumberFromString(phone.startsWith('+') ? phone : `+${phone}`);
  return phoneNumber ? phoneNumber.formatInternational() : phone;
}

export function getInitials(name) {
  if (!name) return "CL";
  const parts = String(name).trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function formatTime(isoDate) {
  if (!isoDate) return "";
  const date = new Date(String(isoDate).replace(" ", "T"));
  if (isNaN(date.getTime())) return "";
  const today = new Date();
  const sameDay = date.toDateString() === today.toDateString();
  if (sameDay) {
    return date.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", hour12: true }).toUpperCase();
  }
  return date.toLocaleDateString("es-MX", { day: "2-digit", month: "short" });
}

export function formatFullDate(isoDate) {
  if (!isoDate) return "";
  const date = new Date(String(isoDate).replace(" ", "T"));
  if (isNaN(date.getTime())) return "";
  return (
    date.toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" }) +
    " · " +
    date.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", hour12: true })
  );
}

export const WA_STATUS = {
  open: { label: "Nuevo", color: "#16a34a", bg: "rgba(22,163,74,0.1)" },
  pending: { label: "En proceso", color: "#b9861f", bg: "rgba(245,158,11,0.1)" },
  closed: { label: "Cerrado", color: "#475569", bg: "rgba(71,71,71,0.08)" },
  not_opened: { label: "No abierta", color: "#64748b", bg: "#f1f5f9" },
};

export const WA_TEMPLATES = [
  { id: "bienvenida_1", name: "Bienvenida", category: "Marketing", language: "es_MX", body: "Hola {{1}}, gracias por contactar a 2Business Travel." },
  { id: "cotizacion_1", name: "Cotización", category: "Utility", language: "es_MX", body: "Hola {{1}}, aquí tienes los detalles de tu cotización." },
  { id: "recordatorio_1", name: "Recordatorio de pago", category: "Utility", language: "es_MX", body: "Hola {{1}}, te recordamos tu pago pendiente." },
];
