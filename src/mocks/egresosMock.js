export const egresosMetricsMock = {
  totalEgresos: { value: "$700,457.30", subtext: "+12% vs abril" },
  pendientesPago: { value: "$67,200", subtext: "12 egresos" },
  vencidos: { value: "$12,800" },
  pagadosEsteMes: { value: "$104,500", subtext: "23 egresos" },
};

export const egresosPendientesMock = [
  { id: 1, reserva: "#0038", proveedor: "Marriott Cancún", categoria: "Hotel", servicio: "Tour Chichén Itzá", monto: "$8,400", fechaLimite: "12 de mayo 2025", diasRestantes: "Vencido", estado: "Vencido" },
  { id: 2, reserva: "#0040", proveedor: "Aeromexico", categoria: "Vuelo", servicio: "GDL-CUN", monto: "$4,400", fechaLimite: "15 de mayo 2025", diasRestantes: "Vencido", estado: "Vencido" },
  { id: 3, reserva: "#0042", proveedor: "Fiesta Americana", categoria: "Hotel", servicio: "Tour Coba", monto: "$6,300", fechaLimite: "19 de mayo 2025", diasRestantes: "2 días", estado: "Por vencer" },
  { id: 4, reserva: "#0044", proveedor: "Riu Palace Peninsula", categoria: "Hotel", servicio: "Tour Xcaret", monto: "$6,800", fechaLimite: "22 de mayo 2025", diasRestantes: "6 días", estado: "Por vencer" },
  { id: 5, reserva: "#0046", proveedor: "The Westin Resort & Spa", categoria: "Operador", servicio: "Tour Sian Ka'an", monto: "$9,800", fechaLimite: "28 de mayo 2025", diasRestantes: "Pendiente", estado: "Pendiente" },
  { id: 6, reserva: "#0048", proveedor: "Grand Fiesta Americana", categoria: "Hotel", servicio: "Tour Xel-Há", monto: "$8,200", fechaLimite: "30 de mayo 2025", diasRestantes: "Vencido", estado: "Vencido" },
  { id: 7, reserva: "#0050", proveedor: "Volaris", categoria: "Vuelo", servicio: "MEX-CUN", monto: "$3,200", fechaLimite: "02 de jun. 2025", diasRestantes: "Pendiente", estado: "Pendiente" },
  { id: 8, reserva: "#0052", proveedor: "Hyatt Ziva Cancún", categoria: "Hotel", servicio: "Habitación Doble", monto: "$12,500", fechaLimite: "05 de jun. 2025", diasRestantes: "Pendiente", estado: "Pendiente" },
];

export const egresosOperadoresMock = [
  { id: 1, reserva: "#0060", proveedor: "Traslados Caribe", categoria: "Operador", servicio: "Traslado aeropuerto", monto: "$2,400", fechaLimite: "10 de jun. 2025", diasRestantes: "3 días", estado: "Por vencer" },
  { id: 2, reserva: "#0062", proveedor: "Tours Maya Explorer", categoria: "Operador", servicio: "Tour Tulum", monto: "$4,800", fechaLimite: "14 de jun. 2025", diasRestantes: "Pendiente", estado: "Pendiente" },
  { id: 3, reserva: "#0064", proveedor: "Diving Cozumel", categoria: "Operador", servicio: "Buceo arrecife", monto: "$6,200", fechaLimite: "18 de jun. 2025", diasRestantes: "Pendiente", estado: "Pendiente" },
  { id: 4, reserva: "#0066", proveedor: "Catamarán Riviera", categoria: "Operador", servicio: "Tour Isla Mujeres", monto: "$3,500", fechaLimite: "20 de jun. 2025", diasRestantes: "8 días", estado: "Por vencer" },
  { id: 5, reserva: "#0068", proveedor: "Aventura Xplor", categoria: "Operador", servicio: "Xplor Park", monto: "$7,900", fechaLimite: "25 de jun. 2025", diasRestantes: "Pendiente", estado: "Pendiente" },
];

export const egresosVuelosHotelesMock = [
  { id: 1, reserva: "#0070", proveedor: "Marriott Cancún", categoria: "Hotel", servicio: "Suite Ocean View", monto: "$15,200", fechaLimite: "08 de jun. 2025", diasRestantes: "Vencido", estado: "Vencido" },
  { id: 2, reserva: "#0072", proveedor: "Aeromexico", categoria: "Vuelo", servicio: "GDL-PVR", monto: "$3,800", fechaLimite: "12 de jun. 2025", diasRestantes: "5 días", estado: "Por vencer" },
  { id: 3, reserva: "#0074", proveedor: "Fiesta Americana", categoria: "Hotel", servicio: "Habitación Junior", monto: "$9,400", fechaLimite: "16 de jun. 2025", diasRestantes: "Pendiente", estado: "Pendiente" },
  { id: 4, reserva: "#0076", proveedor: "Volaris", categoria: "Vuelo", servicio: "CUN-GDL", monto: "$2,900", fechaLimite: "20 de jun. 2025", diasRestantes: "Pendiente", estado: "Pendiente" },
  { id: 5, reserva: "#0078", proveedor: "Hyatt Zilara", categoria: "Hotel", servicio: "All Inclusive", monto: "$18,600", fechaLimite: "25 de jun. 2025", diasRestantes: "9 días", estado: "Por vencer" },
];

export const egresosHistorialMock = [
  { id: 1, folio: "EGR-0089", reserva: "#0038", proveedor: "Marriott Cancún", categoria: "Hotel", servicio: "Tour Chichén Itzá", monto: "$8,400", fechaLimite: "12 de mayo 2025", registradoPor: "Carlos V.", diasRestantes: "Pagado", estado: "Pagado" },
  { id: 2, folio: "EGR-0088", reserva: "#0040", proveedor: "Aeromexico", categoria: "Vuelo", servicio: "GDL-CUN", monto: "$4,400", fechaLimite: "15 de mayo 2025", registradoPor: "Ana L.", diasRestantes: "Pagado", estado: "Pagado" },
  { id: 3, folio: "EGR-0087", reserva: "#0042", proveedor: "Fiesta Americana", categoria: "Hotel", servicio: "Tour Coba", monto: "$6,300", fechaLimite: "19 de mayo 2025", registradoPor: "Carlos V.", diasRestantes: "Pagado", estado: "Pagado" },
  { id: 4, folio: "EGR-0086", reserva: "#0044", proveedor: "Riu Palace Peninsula", categoria: "Hotel", servicio: "Tour Xcaret", monto: "$6,800", fechaLimite: "22 de mayo 2025", registradoPor: "Carlos V.", diasRestantes: "Pagado", estado: "Pagado" },
  { id: 5, folio: "EGR-0048", reserva: "#0048", proveedor: "Grand Fiesta Americana", categoria: "Hotel", servicio: "Tour Xel-Há", monto: "$8,200", fechaLimite: "30 de mayo 2025", registradoPor: "Ana L.", diasRestantes: "Pagado", estado: "Pagado" },
  { id: 6, folio: "EGR-0084", reserva: "#0049", proveedor: "Viva aerobus", categoria: "Vuelo", servicio: "MID-CDMX", monto: "$4,400", fechaLimite: "01 de junio 2025", registradoPor: "Luis R.", diasRestantes: "Pagado", estado: "Pagado" },
  { id: 7, folio: "EGR-0085", reserva: "#0046", proveedor: "The Westin Resort & Spa", categoria: "Operador", servicio: "Tour Sian Ka'an", monto: "$9,800", fechaLimite: "28 de mayo 2025", registradoPor: "Mónica", diasRestantes: "Pagado", estado: "Pagado" },
];

export const egresosPorOperadorMock = [
  { name: "Megatravel", amount: "$34,500", pct: 100 },
  { name: "Carlos Travel", amount: "$22,100", pct: 64 },
  { name: "Tours del Sureste", amount: "$18,400", pct: 53 },
  { name: "Britos Tours", amount: "$11,200", pct: 32 }
];

export const egresosEstadoCuentasMock = [
  { name: "Megatravel", paid: "$24,700", pending: "$0", pendingColor: "#0f1901" },
  { name: "Carlos Travel", paid: "$22,100", pending: "$0", pendingColor: "#0f1901" },
  { name: "Tours del Sureste", paid: "$18,400", pending: "$5,000", pendingColor: "#b9861f" },
  { name: "Britos Tours", paid: "$6,200", pending: "$9,800", pendingColor: "#b9861f" }
];
